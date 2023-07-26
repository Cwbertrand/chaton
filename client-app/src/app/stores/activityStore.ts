import { makeAutoObservable, runInAction, } from "mobx";
import { Activity } from "../../component/models/Activity";
import agent from "../api/agentAxios";
import { v4 as uuid } from "uuid"; 


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
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this)
    }

    //Sorting activities by date
    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) =>
        Date.parse(b.date) - Date.parse(a.date) ); 
    }


    //This is creating an action in mobx We do this so as not to worry about binding the classes
    loadActivitiesAction = async () => {
        //all non-synchronouse codes should be put outside the try and catch block
        try {
            const activities = await agent.Activities.list();
                activities.forEach(activity => {
                    activity.date = activity.date.split('T')[0];
                    this.activityRegistry.set(activity.id, activity);
                    //this.activities.push(activity);
                })
                this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
                this.setLoadingInitial(false);
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    //selecting activity using mobx
    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        // this.selectedActivity = this.activities.find(a => a.id === id);
    }

    //Canceling the activity details
    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    //creating activity
    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                // this.activities.push(activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    //updating activity
    updatingActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                // this.activities = [...this.activities.filter(a => a.id === activity.id), activity];
                this.selectedActivity = activity;
                this.editMode = false;
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

    //deleting an activity
    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                // this.activities = [...this.activities.filter(a => a.id !== id)];
                // this is to remove the activity detail once deleted
                if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
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
}

