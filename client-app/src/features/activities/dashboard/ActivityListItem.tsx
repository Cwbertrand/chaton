import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react'
import { Activity } from '../../../component/models/Activity';
//import { useStore } from '../../../app/stores/Store';
import format from 'date-fns/format';
import ActivityListItemAttendee from './ActivityListItemAttendee';

interface Props {
    activity: Activity
}
export default function ActivityListItem({activity}: Props) {
    
    //const {activityStore} = useStore();
    //const {deleteActivity, loading} = activityStore
    //const [targetId, setTargetId] = useState('');

    // This prevents that when you click the delete button, all the buttons shouldn't load
    // function handleDeleteButtonClick(e: SyntheticEvent<HTMLButtonElement>, id: string){
    //     setTargetId(e.currentTarget.name);
    //     deleteActivity(id);
    // }
    return (
        <Segment.Group>
            <Segment>
                {activity.isCancelled &&
                    <Label attached='top' color='red' content='Cancelled' style={{textAlign: 'center'}} />
                }
                <Item.Group>
                    <Item>
                        <Item.Image style={{marginBottom: 5}} size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
                            <Item.Description>Hosted by {activity.host?.displayName} </Item.Description>
                            {activity.isHost && (
                                <Item.Description>
                                    <Label basic color="orange">
                                        You are hosting this activity
                                    </Label>
                                </Item.Description>
                            )}
                            {activity.isGoing && !activity.isHost && (
                                <Item.Description>
                                    <Label basic color="green">
                                        You are going to this activity
                                    </Label>
                                </Item.Description>
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name="clock" />{format(activity.date!, 'dd MMM yyyy h:mm aa')}
                    <Icon name="marker" />{activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!} />
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button 
                    as={Link}
                    to={`/activities/${activity.id}`}
                    color='teal'
                    floated='right'
                    content='View'
                />
            </Segment>
        </Segment.Group>
        // <Item key={activity.id}>
        //     <Item.Content>
        //         <Item.Header as='a'>{activity.title}</Item.Header>
        //         <Item.Meta>{activity.date}</Item.Meta>
        //         <Item.Description>
        //             <div>{activity.description}</div>
        //             <div>{activity.city}, {activity.venue}</div>
        //         </Item.Description>
        //         <Item.Extra>
        //             <Button as={Link} to={`/activities/${activity.id}`} floated='right' content='View' color='blue' />
        //             <Button
        //                 name={activity.id}
        //                 loading={loading && targetId === activity.id}
        //                 onClick={(e) => handleDeleteButtonClick(e, activity.id)}
        //                 floated='right'
        //                 content='Delete'
        //                 color='red'
        //             />
        //             <Label basic content={activity.category} />
        //         </Item.Extra>
        //     </Item.Content>
        // </Item>
    )
}
