import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../../component/models/serverError";

export default class CommonStore{
    error: ServerError | null = null;
    token: string | null = localStorage.getItem('jwt');
    appLoaded: boolean = false;

    constructor(){
        makeAutoObservable(this);

        reaction(
            () => this.token,
            token => {
                if(token) {
                    localStorage.setItem('jwt', token)
                }else{
                    localStorage.removeItem('jwt')
                }
            }
        )
    }

    setServerError(error: ServerError){
        this.error = error;
    }

    // Storing the jwt token of the user inside localStorage
    setToken = (token: string | null) => {
        // if (token) localStorage.setItem('jwt', token);
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}