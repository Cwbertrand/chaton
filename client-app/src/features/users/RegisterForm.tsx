import { ErrorMessage, Form, Formik } from 'formik'
import React from 'react'
import MyTextInputValidation from '../../app/common/form/MyTextInputValidation'
import { Button, Header } from 'semantic-ui-react'
import { useStore } from '../../app/stores/Store'
import { observer } from 'mobx-react-lite'
import * as Yup from 'yup'
import ValidationError from '../errors/ValidationError'

export default observer (function RegisterForm() {
    const {userStore} = useStore();
    return (
        <Formik
            initialValues = {{displayName: '', username: '', email: '', password: '', error: null}}
            onSubmit = {(values, {setErrors}) => userStore.register(values).catch(error => {
                setErrors((error));
            })}
            validationSchema = {Yup.object({
                displayName: Yup.string().required(),
                username: Yup.string().required(),
                email: Yup.string().required(),
                password: Yup.string().required(),

            })}
        >

            {({handleSubmit, isSubmitting, errors, isValid, dirty}) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Sign up to the Activities' color='teal' textAlign='center' />
                    <ErrorMessage 
                        name='error' render={() => 
                            // <Label style={{marginBottom: 10}} basic color='red' content={errors.error} />
                            <ValidationError errors={errors.error as unknown as string[]} />
                        }
                    />
                    <MyTextInputValidation placeholder='Display Name' name='displayName' />
                    <MyTextInputValidation placeholder='Username' name='username' />
                    <MyTextInputValidation placeholder='Email' name='email' />
                    <MyTextInputValidation placeholder='Password' name='password' type='password' />
                    <Button 
                        disabled={!isValid || !dirty || isSubmitting}
                        loading={isSubmitting} 
                        positive content='Register' 
                        type='submit' fluid />
                </Form>
            )}

            
        </Formik>
    )
})
