import { makeAutoObservable } from "mobx";
import { ServerError } from "../../component/models/serverError";

export default class CommonStore{
    error: ServerError | null = null;

    constructor(){
        makeAutoObservable(this);
    }

    setServerError(error: ServerError){
        this.error = error;
    }
}