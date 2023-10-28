import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../../component/layout/App";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestErrors";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/users/LoginForm";
import ProfilePage from "../../features/profiles/ProfilePage";

export const routes: RouteObject[] = [{
    path: '/',
    element: <App />,
    children: [
        {path:  'activities', element: <ActivityDashboard />},
        {path:  'activities/:id', element: <ActivityDetails />},
        {path:  'createActivity', element: <ActivityForm key='create' />},
        {path:  'edit/:id', element: <ActivityForm key='edit' />},
        {path:  'profile/:username', element: <ProfilePage />},
        {path:  'login', element: <LoginForm key='login' />},
        {path:  'errors', element: <TestErrors />},
        {path:  'not-found', element: <NotFound />},
        // the * implies that whenever a client makes a mistake and types a wrong url
        // they'll be redirected to the not-found page.
        {path:  '*', element: <Navigate replace to='/not-found' />},
        {path:  'server-error', element: <ServerError />},
        {path:  '*', element: <Navigate replace to='/server-error' />},
    ]
}];

export const router = createBrowserRouter(routes);