import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import {v4 as uuid} from 'uuid';


import './style.css';
import NavBar from './NavBar';
import { Activity } from '../models/Activity';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../../app/api/agentAxios';
import LoadingComponent from './LoadingComponent';

function App() {

  //***==================== STATES ====================*/

  const [loading, setLoading] = useState(true);
  const [submittingLoader, setSubmittingLoader] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([]);

  //the initial state of the hook is undefined
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined> (undefined);

  //setting a state for editing an activity
  const [editMode, setEditMode] = useState(false);



  //***==================== EFFECTS ====================*/

  useEffect(() => {
    agent.Activities.list().then((response) => {
      let activities: Activity[] = [];
      response.forEach((activity) => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
      })
      setActivities(response);
      setLoading(false);
      })
  }, []);


  //*** ==================== METHODS ====================*/

  //we'll create a function that will show the selected activity. this method we'll pass down
  //through our activityDashboard to our activityList so we can select from our activity list then we set it as a state
  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(eachActivity => eachActivity.id === id));
  }

  //Canceling the view detail activity
  function handleCancelActivity(){
    setSelectedActivity(undefined);
  }

  //method that opens the form be it in the edit mode or creating a new form
  //id? means it is optional because the form might be opening to create a new form or to edit an existing id
  function handleFormOpen(id?: string){
    //if an id exist(edit mode), it should open the edit form with the selected id, if not, it should cancel
    id ? handleSelectActivity(id) : handleCancelActivity();
    setEditMode(true);
  }

  //handling the close form functionality
  function handleFormClose(){
    setEditMode(false);
  }

  //Displaying the submitted form's data when submitted
  function handleCreateOrEditActivity(activity: Activity){
    //if we have an activity id, just update the data, if not,
    setSubmittingLoader(true);
    if(activity.id){
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity])
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmittingLoader(false);
      })
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmittingLoader(false);
      })
    }
  }

  // Handling delete activity
  function deleteActivity(id: string) {
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmittingLoader(false);
    })
  }

  //Handling loading functionality when delay response
  if(loading) return <LoadingComponent content='Loading app' />

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style ={{marginTop: '7em'}}>
        {/* the activities, selectedActivity, activityInDetails comes from the activityDashboard file while the
        actvities, selectedActivity, handleSelectActivity comes from the app.tsx file */}
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          activityInDetails={handleSelectActivity}
          cancelActivity={handleCancelActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={deleteActivity}
          submittingLoader={submittingLoader}

        
        />
      </Container>
    </>
  );
}

export default App;
