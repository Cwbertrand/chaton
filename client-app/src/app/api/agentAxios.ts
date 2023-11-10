import axios, { AxiosError, AxiosResponse } from 'axios';
import { Activity, ActivityFormValues } from '../../component/models/Activity';
import { toast } from 'react-toastify';
import { router } from '../router/Routes';
import { store } from '../stores/Store';
import { User, UserFormValues } from '../../component/models/user';
import { Photo, Profile } from '../../component/models/profile';

//making a loader function while waiting the response from axios
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

//creating a base url endpoint
axios.defaults.baseURL = 'http://localhost:5000/api';

//using axios interceptors, we can set the timeout
// this handles the various error status codes
axios.interceptors.response.use(async response => {
        await sleep(1000);
        return response;
}, (error: AxiosError) => {
    const {data, status, config} = error.response as AxiosResponse; //response! this means we are overriding the error from typescript
    switch (status) {
        case 400:
            if(config.method === 'get' && data.errors.hasOwnProperty('id')){
                router.navigate('/not-found');
            }
            if(data.errors){
                const modalStateError = [];
                for (const key in data.errors) {
                    if(data.errors[key]){
                        modalStateError.push(data.errors[key]);
                    }
                }
                throw modalStateError.flat();
            }else{
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorized')
            break;
        case 403:
            toast.error('forbidden')
            break;
        case 404:
            // toast.error('not found')
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }
    return Promise.reject(error);
})

// axios.interceptors.response.use(response => {
//     return sleep(1000).then(() => {
//         return response;
//     }).catch((error) => {
//         console.log(error);
//         return Promise.reject(error);
//     })
// })

// Geting the response from axios
// to specify the type of axios type for responses, we need to add a generic type which is (<T>)
const responseData = <T> (response: AxiosResponse<T>) => response.data;

// With the use of interceptors, we can pass a request from our frontend to the backend
axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if(token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

// Storing the request which is to be passed through axios.
// A snippet for data types which is to be inserted
const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseData),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseData),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseData),
    del: <T> (url: string) => axios.delete<T>(url).then(responseData),
}

//Creating an object that stores the various activities
const Activities = {
    //getting list of activities
    //this will be returning void for create, update and delete
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => axios.delete<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
}

const Profiles = {
    getProfile: (username: string) => requests.get<Profile>(`/profile/${username}`),
    // Getting form data and sending it to the api
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: {'Content-type': 'mulitpart/form-data'},
        })
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.del(`/photos/${id}`),
    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
    listFollowing: (username: string, predicate: string) => requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    //TODO: not used yet
    updateProfile: (profile: Partial<Profile>) => requests.put(`/profile`, profile),

}

const agent = {
    Activities,
    Account,
    Profiles,
}

export default agent;