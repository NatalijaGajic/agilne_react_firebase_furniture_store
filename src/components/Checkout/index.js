import React from 'react'
import CheckoutForm from '../Checkout/CheckoutForm'
import { useForm } from '../../hooks/useForm';
import { Grid } from '@material-ui/core';
import { Container, Typography } from "@material-ui/core";
import { v4 as uuidv4 } from 'uuid';

const getFreshModelObject = () => ({
    id: uuidv4(),
    paymentMethod: 'none',
    orderDate: new Date().toLocaleString(),
    currency: "rsd",
    discount: 0,
    priceWithoutDiscount: 0,
    totalPrice: 0,
    confirmed: false,
    customer: '',
    orderFurnitures: []
})


export default function Checkout() {

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetFormControls
    } = useForm(getFreshModelObject);

    return (
    <Container>
      <Typography
      gutterBottom
      variant="h3"
      align ="center">
        Kreiraj porudžbinu
      </Typography>
      <Grid container spacing={2}>
            <Grid item xs={12}>
                <CheckoutForm
                    {...{ 
                        values, 
                        setValues,
                        errors, 
                        setErrors,
                        resetFormControls,
                        handleInputChange }} 
                />
            </Grid>
        </Grid>
    </Container>


    )
}