import { useField } from 'formik';
import React from 'react'
import { Form, Label } from 'semantic-ui-react';
import DatePicker, {ReactDatePickerProps} from 'react-datepicker';

export default function MyDateValidation(props: Partial<ReactDatePickerProps>) {
    // Partial make makes it possible for all the options to be optional
    const [field, meta, helpers] = useField(props.name!);
    return (
        // the !!meta.error means it's a boolean
        <Form.Field error={meta.touched && !!meta.error}>
            <DatePicker
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => helpers.setValue(value)}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}
