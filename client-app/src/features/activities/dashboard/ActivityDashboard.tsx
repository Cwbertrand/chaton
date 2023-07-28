import React from 'react'
import { Grid } from 'semantic-ui-react'
import { Activity } from '../../../component/models/Activity'
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';

interface Activities {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    activityInDetails: (id: string) => void;
    cancelActivity: () => void;
    editMode: boolean;
    openForm: (id: string) => void;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
    submittingLoader: boolean;
}

export default function ActivityDashboard({
    activities, 
    selectedActivity, 
    activityInDetails, 
    cancelActivity,
    editMode,
    openForm,
    closeForm,
    createOrEdit,
    deleteActivity,
    submittingLoader}: Activities) {
    return (
        <Grid>
            <Grid.Column width="10">
                <ActivityList activities={activities} activityInDetails={activityInDetails} deleteActivity={deleteActivity} submittingLoader={submittingLoader} />
            </Grid.Column>
            <Grid.Column width="6">
                {/* this means if the first activity exist, then it can be loaded to the browser */}
                {selectedActivity &&
                    <ActivityDetails 
                        activity={selectedActivity}
                        cancelActivity={cancelActivity}
                        openForm={openForm}

                    />
                }
                {editMode &&
                    <ActivityForm closeForm={closeForm} activity={selectedActivity} createOrEdit={createOrEdit} submittingLoader={submittingLoader} />
                }
            </Grid.Column>
        </Grid>
    )
}
