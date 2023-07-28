import React, { SyntheticEvent, useState } from 'react'
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../component/models/Activity';

interface Activities {
    activities: Activity[];
    activityInDetails: (id: string) => void;
    deleteActivity: (id: string) => void;
    submittingLoader: boolean;
}

export default function ActivityList({ activities, activityInDetails, deleteActivity, submittingLoader}: Activities) {
    const [targetId, setTargetId] = useState('');

    // This prevents that when you click the delete button, all the buttons shouldn't load
    function handleDeleteButtonClick(e: SyntheticEvent<HTMLButtonElement>, id: string){
        setTargetId(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {activities.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={() => activityInDetails(activity.id)} floated='right' content='View' color='blue' />
                                <Button
                                    name={activity.id}
                                    loading={submittingLoader && targetId === activity.id}
                                    onClick={(e) => handleDeleteButtonClick(e, activity.id)}
                                    floated='right'
                                    content='Delete'
                                    color='red'
                                />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}
