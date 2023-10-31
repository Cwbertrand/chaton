import { makeAutoObservable, runInAction, } from "mobx";
import { Activity, ActivityFormValues } from "../../component/models/Activity";
import agent from "../api/agentAxios";
import { v4 as uuid } from "uuid"; 
import { format } from "date-fns";
import { store } from "./Store";
import { Profile } from "../../component/models/profile";


export default class ActivityStore {
    // activities: Activity[] = [];
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
    // the map() takes 2 types. The first is the key which in this case is a string = activity.id, and the 
    // second is the object itself. = activity
    //
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    //Sorting activities by date
    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) =>
        b.date!.getTime() - a.date!.getTime() ); 
    }

    // We'll group our activitiesByDate to keys where each date will have an array of activities related
    // to same dates
    get groupActivitiesByDate() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                // This date represents the key for each of the object of activities
                // Converting the date to string
                const date = format(activity.date!, 'dd MMM yyyy');

                // Inside the brackets is the object property accessor.
                // So we're going to get the property of the activity object that matches the key (date)
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;

                // This is an array of objects(activities) and each object has a key(activity.date) and for each date 
                // is an activity of arrays
            }, {} as {[key: string]: Activity[]})
        )}


    //This is creating an action in mobx We do this so as not to worry about binding the classes
    loadActivitiesAction = async () => {
        this.setLoadingInitial(true);
        //all non-synchronouse codes should be put outside the try and catch block
        try {
            const activities = await agent.Activities.list();
                activities.forEach(activity => {
                    this.setActivity(activity);
                    //this.activities.push(activity);
                })
                this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
                this.setLoadingInitial(false);
        }
    }

    // This method loads the activity details when clicked upon
    loadActivityDetails = async (id: string) => {
        let activityDetails = this.getActivity(id);
        if (activityDetails) {
            this.selectedActivity = activityDetails;
            return activityDetails;
        }else{
            this.setLoadingInitial(true);
            try {
                activityDetails = await agent.Activities.details(id);
                this.setActivity(activityDetails);
                runInAction(() => this.selectedActivity = activityDetails);
                this.setLoadingInitial(false);
                return activityDetails;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity) => {

        //Getting the user object
        const user = store.userStore.user;
        if(user){
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.username
            )
            activity.isHost = activity.hostUserName === user.username;
            activity.host = activity.attendees?.find(x => x.username === activity.hostUserName);
        }
        //activity.date = activity.date.split('T')[0];

        // making the date to take just the date type of javascript
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    // Getting an id of an activity
    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    // //selecting activity using mobx
    // selectActivity = (id: string) => {
    //     this.selectedActivity = this.activityRegistry.get(id);
    //     // this.selectedActivity = this.activities.find(a => a.id === id);
    // }

    // //Canceling the activity details
    // cancelSelectedActivity = () => {
    //     this.selectedActivity = undefined;
    // }

    // openForm = (id?: string) => {
    //     id ? this.selectActivity(id) : this.cancelSelectedActivity();
    //     this.editMode = true;
    // }

    // closeForm = () => {
    //     this.editMode = false;
    // }

    //creating activity
    createActivity = async (activity: ActivityFormValues) => {
        //this.loading = true;
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUserName = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
                //this.activityRegistry.set(activity.id, activity);
                // this.activities.push(activity);
                //this.selectedActivity = activity;
                // this.editMode = false;
                // this.loading = false;
            })
        } catch (error) {
            console.log(error);
            // runInAction(() => {
            //     this.loading = false;
            // })
        }
    }

    //updating activity
    updatingActivity = async (activity: ActivityFormValues) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                if(activity.id){
                    const updateActivity = {...this.getActivity(activity.id), ...activity}
                    this.activityRegistry.set(activity.id, updateActivity as Activity);
                    this.selectedActivity = updateActivity as Activity;
                }
                //this.activityRegistry.set(activity.id, activity);
                // this.activities = [...this.activities.filter(a => a.id === activity.id), activity];
                // this.selectedActivity = activity;
                // this.editMode = false;
                // this.loading = false;
                //this.activities.push(activity);

            })
        } catch (error) {
            console.log(error);
            // runInAction(() => {
            //     this.loading = false;
            // })
        }
    }

    //deleting an activity
    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                // this.activities = [...this.activities.filter(a => a.id !== id)];
                // this is to remove the activity detail once deleted
                //if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
                this.loading = false;
                //this.activities.push(activity);

            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    //Updating the attenees list
    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    // if the user is already an attendee, the user can cancel his/her attendance
                    this.selectedActivity.attendees = this.selectedActivity?.attendees?.filter(a =>
                            a.username !== user?.username
                        )
                    this.selectedActivity.isGoing = false;
                }else {
                    // Adding user to attendance list
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })

        }catch (er){
            console.log(er);
        }finally {
            runInAction(() => this.loading = false);
        }
    }

    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id)
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    // Clearing activity after you've left an activity detail page so as not to encounter an error with the websocket
    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }
}

