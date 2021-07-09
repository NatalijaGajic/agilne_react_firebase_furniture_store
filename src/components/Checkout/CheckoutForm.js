import React, { useState, useEffect } from 'react'
import { useContext } from 'react';
import Form from "../../layouts/Form";
import { Grid, InputAdornment, makeStyles, ButtonGroup, Button as MuiButton } from '@material-ui/core';
import { Input, Select } from "../../controls";
import KingBedIcon from '@material-ui/icons/KingBed';
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import Notification from "../../layouts/Notification";
import CartContext from '../../store/CartContext';
import { useAuth } from "../../store/AuthContext"

const paymentMethods = [
    { id: 'none', title: 'Select' },
    { id: 'Keš', title: 'Keš' },
    { id: 'Kartica', title: 'Kartica' },
]

const useStyles = makeStyles(theme => ({
    adornmentText: {
        '& .MuiTypography-root': {
            color: '#19b5fe',
            fontWeight: 'bolder',
            fontSize: '1.2em'
        }
    },
    submitButtonGroup: {
        backgroundColor: '#19b5fe',
        margin: theme.spacing(1),
        '& .MuiButton-label': {
            textTransform: 'none'
        },
        '&:hover': {
            backgroundColor: '#6bb9f0',
        }
    }
}))

export default function CheckoutForm(props) {

    const { values, setValues, errors, setErrors, handleInputChange, resetFormControls } = props;
    const { currentUser } = useAuth()
    const cartCtx = useContext(CartContext);
    const classes = useStyles();
    const [orderId, setOrderId] = useState(0);
    const [user, setUser] = useState([]);
    const [notify, setNotify] = useState({ isOpen: false })

    useEffect(() => {
        let totalPrice = cartCtx.cartItems.reduce((tempTotal, item) => {
            return tempTotal + (item.quantity * item.price * (1-values.discount/100));
        }, 0);
        let priceWithoutDiscount = cartCtx.cartItems.reduce((tempTotal, item) => {
            return tempTotal + (item.quantity * item.price );
        }, 0);
        setValues({
            ...values,
            totalPrice: totalPrice.toFixed(2),
            priceWithoutDiscount: priceWithoutDiscount.toFixed(2)
        })

    }, [values.discount]);

    // useEffect(() => {
    //     createAPIEndpoint(ENDPOINTS.USERS).fetchAll(username)
    //         .then(res => {
    //             let user = res.data.map(item => ({
    //                 id: item.id,
    //             }));
    //              setUser(user);
    //         })
    //         .catch(err => console.log(err))
    // }, [])

    useEffect(() => {
        cartCtx.cartItems.forEach(element => {
            if (element.quantity >= 10) {
                setValues({
                    ...values,
                    discount: values.discount +=10
                })
                setNotify({ isOpen: true, message: 'Ostvarili ste ' +values.discount + "% popusta zbog naručene količine!" });
            }
        })
    }, []);

    const validateForm = () => {
        let temp = {};
        temp.paymentMethod = values.paymentMethod != "none" ? "" : "Ovo polje je obavezno";
        setErrors({ ...temp });
        return Object.values(temp).every(x => x === "");
    }

    const submitOrder = e => {
        e.preventDefault();
        if (validateForm()) {
            let of = [];
            cartCtx.cartItems.forEach(element => {
                of.push({
                    furnitureId: element.furnitureId,
                    quantity: element.quantity,
                })
            });
            // setValues({
            //     ...values,
            //     orderFurnitures: [...values.orderFurnitures, of]
            // })
            console.log("of" +of)
            values.orderFurnitures = of;
            values.customer = currentUser.email;

            createAPIEndpoint(ENDPOINTS.ORDERS).create(values)
                resetFormControls();
                setNotify({ isOpen: true, message: 'Nova porudžbina je kreirana!' });
                //isprazni korpu
                cartCtx.emptyCart()
        }

    }

    const resetForm = () => {
        resetFormControls();
        setOrderId(0);
    }

    return (
        <>
            <Form onSubmit={submitOrder}>
                <Grid container>
                    <Grid item xs={6}>
                        <Select
                            label="Način plaćanja"
                            name="paymentMethod"
                            onChange={handleInputChange}
                            value={values.paymentMethod}
                            options={paymentMethods}
                            error={errors.paymentMethod}
                        />
                        <Input
                            disabled
                            label="Valuta"
                            name="currency"
                            value={values.currency}
                            onChange={(e) => setValues({...values, currency: e.target.value})}
                            error={errors.currency}
                        />
                        <Input
                            disabled
                            label="Popust"
                            name="discount"
                            value={values.discount + "%"}
                            onChange={(e) => setValues({...values, discount: e.target.value})}
                        />

                    </Grid>
                    <Grid item xs={6}>
                        <Input
                            disabled
                            label="Cena bez popusta"
                            name="priceWithoutDiscount"
                            value={values.priceWithoutDiscount}
                            InputProps={{
                                startAdornment: <InputAdornment
                                    className={classes.adornmentText}
                                    position="start">{values.currency}</InputAdornment>
                            }}
                        />
                        <Input
                            disabled
                            label="Ukupna cena"
                            name="totalPrice"
                            value={values.totalPrice}
                            InputProps={{
                                startAdornment: <InputAdornment
                                    className={classes.adornmentText}
                                    position="start">{values.currency}</InputAdornment>
                            }}
                        />
                        <ButtonGroup className={classes.submitButtonGroup}>
                            <MuiButton
                                size="large"
                                endIcon={<KingBedIcon />}
                                type="submit">Potvrdi</MuiButton>
                        </ButtonGroup>
                    
                    </Grid>
                </Grid>
            </Form>
            <Notification
                {...{ notify, setNotify }} />
        </>
    )
}
