import axios, { AxiosResponse } from 'axios';
import { Activity } from '../../component/models/Activity';

//making a loader function while waiting the response from axios
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}


//creating a base url endpoint
axios.defaults.baseURL = 'http://localhost:5000/api';

// Geting the response from axios
// to specify the type of axios type for responses, we need to add a generic type which is (<T>)
const responseData = <T> (response: AxiosResponse<T>) => response.data;

//using axios interceptors, we can set the timeout 
axios.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

// axios.interceptors.response.use(response => {
//     return sleep(1000).then(() => {
//         return response;
//     }).catch((error) => {
//         console.log(error);
//         return Promise.reject(error);
//     })
// })


// Storing the request which is to be passed through axios
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
    create: (activity: Activity) => requests.post<void>('/activities', activity),
    update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => axios.delete<void>(`/activities/${id}`),
}

const agent = {
    Activities
}

export default agent;