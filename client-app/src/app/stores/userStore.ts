import { User, UserFormValues } from '../../component/models/user';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agentAxios';
import { store } from './Store';
import { router } from '../router/Routes';

export default class UserStore {
        user: User | null = null;

        constructor() {
            makeAutoObservable(this)
        }

        get isLoggedIn() {
            //making this a boolean method by adding !!
            return !!this.user;
        }

        // Making the login functionality
        login = async (credentials: UserFormValues) => {
            try {
                // Getting the user credentials through an api call
                const user = await agent.Account.login(credentials)

                // Getting the token of the user through local storage
                store.commonStore.setToken(user.token);
                runInAction(() => this.user = user);
                router.navigate('/activities');
                store.modalStore.closeModal();
                
            } catch (error) {
                throw error;
            }
        }

        // Making the register functionality
        register = async (credentials: UserFormValues) => {
            try {
                // Getting the user credentials through an api call
                const user = await agent.Account.register(credentials)

                // Getting the token of the user through local storage
                store.commonStore.setToken(user.token);
                runInAction(() => this.user = user);
                router.navigate('/activities');
                store.modalStore.closeModal();
                
            } catch (error) {
                throw error;
            }
        }

        //Making the logout functionality
        logout = () => {
            store.commonStore.setToken(null);
            // localStorage.removeItem('jwt');
            this.user = null;
            router.navigate('/');
        }

        getUser = async () => {
            try {
                const user = await agent.Account.current();
                runInAction(() => this.user = user);
            } catch (error) {
                console.log(error);
            }
        }


}
