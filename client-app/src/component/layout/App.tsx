import React, { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { Container } from 'semantic-ui-react';


import './style.css';
import NavBar from './NavBar';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../../app/stores/Store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../../app/common/modal/ModalContainer';

function App() {
  // This helps to remove the navbar inside the homepage
  const location = useLocation();

  const {commonStore, userStore} = useStore();
  
  // This get's the user that is logged in
  useEffect(() => {
    if(commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded())
    }else{
      commonStore.setAppLoaded()
    }
  }, [commonStore, userStore])

  if(!commonStore.appLoaded) return <LoadingComponent content='Loading app...' />
  return (
    <>
    <ScrollRestoration />
      <ModalContainer />
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
