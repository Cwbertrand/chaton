import React from 'react';
import ReactDOM from 'react-dom';
import 'react-calendar/dist/Calendar.css';
import reportWebVitals from './reportWebVitals';
import { store, StoreContext } from './app/stores/Store';
import { router } from './app/router/Routes';
import { RouterProvider } from 'react-router-dom';

ReactDOM.render(
    //This is setting up mobx
    <StoreContext.Provider value={store}>
        <RouterProvider router={router} />
    </StoreContext.Provider>
    , document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
