import React, { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { Container } from 'semantic-ui-react';


import './style.css';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../../app/stores/Store';

function App() {

  //***==================== HOOKS ====================*/
  const {activityStore} = useStore();

  //***==================== EFFECTS ====================*/
  useEffect(() => {
    activityStore.loadActivitiesAction();
  }, [activityStore]);


  //Handling loading functionality when delay response
  if(activityStore.loadingInitial) return <LoadingComponent content='Loading app' />

  return (
    <>
      <NavBar />
      <Container style ={{marginTop: '7em'}}>
        <ActivityDashboard />
      </Container>
    </>
  );
}

export default observer(App);
