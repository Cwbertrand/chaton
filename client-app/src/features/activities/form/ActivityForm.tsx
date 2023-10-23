import React, { useEffect, useState } from 'react'
import { Button, Header, Segment } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from "uuid"; 
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { useStore } from '../../../app/stores/Store';
import { ActivityFormValues } from '../../../component/models/Activity';
import LoadingComponent from '../../../component/layout/LoadingComponent';
import MyTextInputValidation from '../../../app/common/form/MyTextInputValidation';
import MyTextAreaValidation from '../../../app/common/form/MyTextAreaValidation ';
import MySelectValidation from '../../../app/common/form/MySelectValidation';
import { categoryOptions } from '../../../app/common/optionSelect/categoryOptions';
import MyDateValidation from '../../../app/common/form/MyDateValidation';


export default observer (function ActivityForm() {

    const {activityStore} = useStore();
    const {createActivity, updatingActivity, 
        loadActivityDetails, loadingInitial} = activityStore;
    const {id} = useParams();
    // Navigate helps the user to redirect
    const navigate = useNavigate();

    //the initialstate will be either the selected activity or a new activity we want to create.
    // if the activity is null (??) then we'll create new data for the ids
    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    // Form validation using the formik and yuup library
    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required("Date is required"),
        venue: Yup.string().required(),
        city: Yup.string().required(),
    })

    // We'll add a useEffect so it does something when the activity loads
    useEffect(() => {
        if(id) loadActivityDetails(id).then(activity => setActivity(new ActivityFormValues(activity)));
    }, [id, loadActivityDetails]);

    function handleFormSubmit(activity: ActivityFormValues) {
        if (!activity.id){
            activity.id = uuid();
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }else{
            updatingActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }
    }

    // function handleChange(event: ChangeEventHTMLInputElement | HTMLTextAreaElement>){
    //     const { name, value } = event.target;
    //     setActivity({...activity, [name]: value});
    // }

    if(loadingInitial) return <LoadingComponent content='Loading activity...' />
    return (
        <Segment clearing>
            <Header content='Activity Details' sub color='teal' />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={activity} 
                onSubmit={values => handleFormSubmit(values)}>
                {({handleSubmit, isValid, isSubmitting, dirty}) => (
                    <Form onSubmit={handleSubmit} autoComplete='off' className='ui form' >
                        <MyTextInputValidation name='title' placeholder='Title' />
                        <MyTextAreaValidation row={3} placeholder="Description"  name='description' />
                        <MySelectValidation options={categoryOptions} placeholder="Category" name='category' />
                        <MyDateValidation
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMM d, yyyy h:mm aa'
                            placeholderText="Date" 
                            name='date' 
                        />

                        <Header content='Location Details' sub color='teal' />

                        <MyTextInputValidation placeholder="City" name='city' />
                        <MyTextInputValidation placeholder="Venue" name='venue' />
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting}  floated='right' 
                            positive type="submit" content="Submit" 
                        />
                        <Button as={Link} to='/activities' floated='right' type='button' content="Cancel" />
                    </Form>
                )}
            </Formik>
    </Segment>
    )
})
