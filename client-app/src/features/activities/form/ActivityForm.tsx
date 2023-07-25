import React, { ChangeEvent, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { Activity } from '../../../component/models/Activity';


interface Activities {
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
    // submittingLoader: boolean;
}

export default function ActivityForm({activity: selectedActivity, closeForm, createOrEdit}: Activities) {

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
        createOrEdit(activity);
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
            <Button  floated='right' positive type="submit" content="Submit" />
            <Button onClick={closeForm} floated='right' type='button' content="Cancel" />
        </Form>
    </Segment>
    )
}
