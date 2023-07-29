import React, { useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/Store';
import LoadingComponent from '../../../component/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import ActivityDetailedHeader from './componentActivityDetails/ActivityDetailedHeader';
import ActivityDetailedInfo from './componentActivityDetails/ActivityDetailedInfo';
import ActivityDetailedChat from './componentActivityDetails/ActivityDetailedChat';
import ActivityDetailedSideBar from './componentActivityDetails/ActivityDetailedSideBar';



export default observer (function ActivityDetails() {

    const {activityStore} = useStore();
    const {selectedActivity: activity, loadActivityDetails, loadingInitial} = activityStore;
    const {id} = useParams();

    useEffect(() => {
        if (id) loadActivityDetails(id);
    }, [id, loadActivityDetails]);

    if(loadingInitial || !activity) return <LoadingComponent />;
    
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity}/>
                <ActivityDetailedInfo activity={activity} />
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6} >
                <ActivityDetailedSideBar />
            </Grid.Column>
        </Grid>
        // <Card fluid>
        //     <Image  src={`/assets/categoryImages/${activity.category}.jpg`} />
        //     <Card.Content>
        //     <Card.Header>{activity.title}</Card.Header>
        //     <Card.Meta>
        //         {activity.date}
        //     </Card.Meta>
        //     <Card.Description>
        //         {activity.description}
        //     </Card.Description>
        //     </Card.Content>
        //     <Card.Content extra>
        //         <Button.Group widths='2' >
        //             <Button as={Link} to={`/edit/${activity.id}`} basic color='blue' content="Edit" />
        //             <Button as={Link} to='/activities' basic color='grey' content="Cancel" />
        //         </Button.Group>
        //     </Card.Content>
        // </Card>
    )
})
