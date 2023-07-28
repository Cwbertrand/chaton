import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from "uuid"; 

import { useStore } from '../../../app/stores/Store';
import { Activity } from '../../../component/models/Activity';
import LoadingComponent from '../../../component/layout/LoadingComponent';


export default observer (function ActivityForm() {

    const {activityStore} = useStore();
    const {createActivity, updatingActivity, loading, 
        loadActivityDetails, loadingInitial} = activityStore;
    const {id} = useParams();
    // Navigate helps the user to redirect
    const navigate = useNavigate();

    //the initialstate will be either the selected activity or a new activity we want to create.
    // if the activity is null (??) then we'll create new data for the ids
    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        description: '',
        category: '',
        date: '',
        city: '',
        venue: '',
    });

    // We'll add a useEffect so it does something when the activity loads
    useEffect(() => {
        if(id) loadActivityDetails(id).then(activity => setActivity(activity!));
    }, [id, loadActivityDetails]);

    function handleSubmit() {
        if (!activity.id){
            activity.id = uuid();
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }else{
            updatingActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const { name, value } = event.target;
        setActivity({...activity, [name]: value});
    }

    if(loadingInitial) return <LoadingComponent content='Loading activity...' />
    return (
        <Segment clearing>
        <Form onSubmit={handleSubmit} autoComplete='off' >
            <Form.Input required placeholder="Title" value={activity.title} name='title' onChange={handleInputChange} />
            <Form.TextArea required placeholder="Description" value={activity.description} name='description' onChange={handleInputChange} />
            <Form.Input placeholder="Category" value={activity.category} name='category' onChange={handleInputChange} />
            <Form.Input placeholder="Date" type='date' value={activity.date} name='date' onChange={handleInputChange} />
            <Form.Input placeholder="City" value={activity.city} name='city' onChange={handleInputChange} />
            <Form.Input placeholder="Venue" value={activity.venue} name='venue' onChange={handleInputChange} />
            <Button loading={loading}  floated='right' positive type="submit" content="Submit" />
            <Button as={Link} to='/activities' floated='right' type='button' content="Cancel" />
        </Form>
    </Segment>
    )
})
