import React from 'react';
import { observer } from "mobx-react-lite";
import { Container } from 'semantic-ui-react';


import './style.css';
import NavBar from './NavBar';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';

function App() {
  // This helps to remove the navbar inside the homepage
  const location = useLocation();
  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      {location.pathname === '/' ? <HomePage /> :
        <>
          <NavBar />
          <Container style ={{marginTop: '7em'}}>
            <Outlet />
          </Container>
        </>
      }
    </>
  );
}

export default observer(App);
