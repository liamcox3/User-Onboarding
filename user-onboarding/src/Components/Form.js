import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

let Form = (props) => {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        terms: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        terms: "",
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const [login, setLogin] = useState([]);

    const formSchema = yup.object().shape({
        name: yup.string().required("Name is a required field."),
        password: yup
            .string()
            .required()
            .min(6, "Password must be at least 6 characters long."),
        email: yup
            .string()
            .email("Must be a valid email address.")
            .required("Must include email address."),
        terms: yup.boolean().oneOf([true], "please agree to terms of use"),
    });

    useEffect(() => {
        formSchema.isValid(formState).then((valid) => {
            setButtonDisabled(!valid);
        });
    }, [formState]);

    const validateChange = (e) => {
        yup.reach(formSchema, e.target.name)
            .validate(e.target.value)
            .then((valid) => {
                setErrors({
                    ...errors,
                    [e.target.name]: "",
                });
            })
            .catch((err) => {
                setErrors({
                    ...errors,
                    [e.target.name]: err.errors[0],
                });
            });
    };

    const inputChange = (e) => {
        e.persist();
        const newFormData = {
            ...formState,
            [e.target.name]:
                e.target.type === "checkbox"
                    ? e.target.checked
                    : e.target.value,
        };

        validateChange(e);
        setFormState(newFormData);
    };

    const formSubmit = (e) => {
        e.preventDefault();
        axios
            .post("https://reqres.in/api/users", formState)
            .then((res) => {
                setLogin(res.data); // get just the form data from the REST api
                console.log("success", login);
                // reset form if successful
                setFormState({
                    name: "",
                    email: "",
                    password: "",
                });
            })
            .catch((err) => console.log(err.response));
    };

    return (
        <form onSubmit={formSubmit}>
            <label htmlFor='name'>Name</label>
            <input
                id='name'
                type='text'
                name='name'
                value={formState.name}
                onChange={inputChange}
            />
            {errors.name.length > 0 ? (
                <p className='error'>{errors.name}</p>
            ) : null}
            <label htmlFor='email'>Email</label>
            <input
                id='email'
                name='email'
                type='email'
                value={formState.email}
                onChange={inputChange}
            />
            {errors.email.length > 0 ? (
                <p className='error'>{errors.email}</p>
            ) : null}
            <label htmlFor='password'>Password</label>
            <input
                id='password'
                name='password'
                type='password'
                defaultValue={formState.password}
                onChange={inputChange}
            />
            {errors.password.length > 0 ? (
                <p className='error'>{errors.password}</p>
            ) : null}
            <label htmlFor='terms' className='terms'>
                <input
                    type='checkbox'
                    name='terms'
                    checked={formState.terms}
                    onChange={inputChange}
                />
                Terms & Conditions
            </label>
            <pre>{JSON.stringify(login, null, 2)}</pre>
            <button type='submit' disabled={buttonDisabled}>
                Submit
            </button>
        </form>
    );
};

export default Form;
