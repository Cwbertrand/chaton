import React, { useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/Store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../component/layout/LoadingComponent';


export default observer( function ActivityDashboard() {
    
    //***==================== HOOKS ====================*/
    const {activityStore} = useStore();
    const {loadActivitiesAction, activityRegistry} = activityStore;

    //***==================== EFFECTS ====================*/
    useEffect(() => {
        if (activityRegistry.size <= 1) loadActivitiesAction();
    }, [activityRegistry.size, loadActivitiesAction]);


    //Handling loading functionality when delay response
    if(activityStore.loadingInitial) return <LoadingComponent content='Loading app' />

    return (
        <Grid>
            <Grid.Column width="10">
                <ActivityList />
            </Grid.Column>
            <Grid.Column width="6">
                <h3>Filter activities</h3>
            </Grid.Column>
        </Grid>
    )
})
