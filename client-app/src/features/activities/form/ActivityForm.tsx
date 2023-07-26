import React, { ChangeEvent, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/Store';
import { observer } from 'mobx-react-lite';


export default observer (function ActivityForm() {

    const {activityStore} = useStore();
    const {selectedActivity, closeForm, createActivity, updatingActivity, loading} = activityStore;

    //the initialstate will be either the selected activity or a new activity we want to create.
    // if the activity is null (??) then we'll create new data for the ids
    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        description: '',
        category: '',
        date: '',
        city: '',
        venue: '',
    }

    const [activity, setActivity] = useState(initialState);

    function handleSubmit() {
        activity.id ? updatingActivity(activity) : createActivity(activity);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const { name, value } = event.target;
        setActivity({...activity, [name]: value});
    }


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
            <Button onClick={closeForm} floated='right' type='button' content="Cancel" />
        </Form>
    </Segment>
    )
})
