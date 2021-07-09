import React from 'react'
import OrderForm from './OrderForm'
import { useForm } from '../../hooks/useForm';
import { Grid } from '@material-ui/core';
import SearchFurnitureItems from './SearchFurnitureItems';
import OrderedFurnitureItems from './OrderedFurnitureItems';
import { Container, Typography } from "@material-ui/core";

const getFreshModelObject = () => ({
    id: 0,
    paymentMethod: 'none',
    orderDate: new Date().toLocaleString(),
    currency: '',
    discount: 0,
    priceWithoutDiscount: 0,
    totalPrice: 0,
    confirmed: false,
    customer: '',
    employee: '',
    orderFurnitures: [],
    deletedOrderItemIds: []
})


export default function Order() {

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
                <OrderForm
                    {...{ 
                        values, 
                        setValues,
                        errors, 
                        setErrors,
                        resetFormControls,
                        handleInputChange }} //sve sto se ovde prosledi u OrderForm je smesteno u props
                />
            </Grid>
            <Grid item xs={6}>
                <SearchFurnitureItems
                    {...{
                        values,
                        setValues
                    }}
                />
            </Grid>
            <Grid item xs={6}>
                <OrderedFurnitureItems
                    {...{
                        values,
                        setValues
                    }}
                />
            </Grid>
        </Grid>
    </Container>


    )
}