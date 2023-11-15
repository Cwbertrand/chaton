import { createRoot } from 'react-dom/client';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import { store, StoreContext } from './app/stores/Store';
import { router } from './app/router/Routes';
import { RouterProvider } from 'react-router-dom';
import React from 'react';

const root = createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    //This is setting up mobx
    <React.StrictMode>
        <StoreContext.Provider value={store}>
            <RouterProvider router={router} />
        </StoreContext.Provider>
    </React.StrictMode>
);

