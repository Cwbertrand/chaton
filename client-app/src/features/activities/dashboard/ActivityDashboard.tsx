import React from 'react'
import { Grid } from 'semantic-ui-react'
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import { useStore } from '../../../app/stores/Store';
import { observer } from 'mobx-react-lite';


export default observer( function ActivityDashboard() {
    
    const {activityStore} = useStore();
    const {selectedActivity, editMode} = activityStore;

    return (
        <Grid>
            <Grid.Column width="10">
                <ActivityList />
            </Grid.Column>
            <Grid.Column width="6">
                {/* this means if the first activity exist, then it can be loaded to the browser */}
                {selectedActivity && !editMode &&
                    <ActivityDetails />
                }
                {editMode &&
                    <ActivityForm />
                }
            </Grid.Column>
        </Grid>
    )
})
