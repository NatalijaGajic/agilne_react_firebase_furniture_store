import React, { useState } from 'react'

export function useForm(getFreshModelObject) {

    const [values, setValues] = useState(getFreshModelObject());
    const [errors, setErrors] = useState({});

    const handleInputChange = e =>{
        const {name, value} = e.target;
        //sve vrednosti uzimamo kakve jesu u values a za customerId upisujemo novu smestenu u obelezje value
        setValues({
            ...values,
            [name]: value
        }); //[name] ukazuje na input field
    }

    const resetFormControls = () => {
        setValues(getFreshModelObject());
        setErrors({})
    }

    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetFormControls
    }
}