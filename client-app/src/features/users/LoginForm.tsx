import { ErrorMessage, Form, Formik } from 'formik'
import React from 'react'
import MyTextInputValidation from '../../app/common/form/MyTextInputValidation'
import { Button, Header, Label } from 'semantic-ui-react'
import { useStore } from '../../app/stores/Store'
import { observer } from 'mobx-react-lite'

export default observer (function LoginForm() {
    const {userStore} = useStore();
    return (
        <Formik
            initialValues = {{email: '', password: '', error: null}}
            onSubmit = {(values, {setErrors}) => userStore.login(values).catch(error => {
                setErrors({error: 'Invalid email or password'});
            })}
        >

            {({handleSubmit, isSubmitting, errors}) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Login to the Activities' color='teal' textAlign='center' />
                    <ErrorMessage 
                        name='error' render={() => 
                            <Label style={{marginBottom: 10}} basic color='red' content={errors.error} />
                        }
                    />
                    <MyTextInputValidation placeholder='Email' name='email' />
                    <MyTextInputValidation placeholder='Password' name='password' type='password' />
                    <Button loading={isSubmitting} positive content='Login' type='submit' fluid />
                </Form>
            )}

            
        </Formik>
    )
})
