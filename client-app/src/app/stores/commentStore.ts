import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../../component/models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./Store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    // Creating a hub connection
    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/chat?activityId=' + activityId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection.start().catch(error => console.log('Error establishing connection', error));

            // Loading the entire previous comments to the hub
            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
                //Because we're observing an observable we use runinaction
                runInAction(() => {
                    comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt + 'Z')
                    })
                    this.comments = comments
                })
            })

            // Receiving a new comment. 
            this.hubConnection.on('ReceiveComment', (comment: ChatComment) => {
                //This adds the newly sent comment
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt);
                    this.comments.unshift(comment)
                });
            })
        }
    }

    //Stoping the hub when the user leaves the comment section
    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ' + error));
    }

    // Clearing the comments section
    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: {body: string, activityId?: string}) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke("SendComment", values);
        } catch (error) {
            console.log(error);
        }
    }
}