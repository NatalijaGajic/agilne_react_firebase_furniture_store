import React, { useState, useEffect } from 'react'
import Form from "../../layouts/Form";
import { Grid, InputAdornment, makeStyles, ButtonGroup, Button as MuiButton } from '@material-ui/core';
import { Input, Select, Button } from "../../controls";
import ReplayIcon from '@material-ui/icons/Replay';
import KingBedIcon from '@material-ui/icons/KingBed';
import ReorderIcon from '@material-ui/icons/Reorder';
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import Popup from '../../layouts/Popup';
import OrderList from './OrderList';
import Notification from "../../layouts/Notification";
import Checkbox from '@material-ui/core/Checkbox';
import {useAuth} from '../../store/AuthContext'
import { v4 as uuidv4 } from 'uuid';

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

export default function OrderForm(props) {

    const { values, setValues, errors, setErrors, handleInputChange, resetFormControls } = props;
    const classes = useStyles();

    const [customerList, setCustomerList] = useState([]);
    const [orderListVisibility, setOrderListVisibility] = useState(false);
    const [orderId, setOrderId] = useState(0);
    const [notify, setNotify] = useState({ isOpen: false })
    const [checked, setChecked] = useState(false);
    const {currentUser, setCurrentUser, logout} = useAuth();


    const handleChange = (event) => {
        setChecked(event.target.checked);
        setValues({...values, confirmed: event.target.checked});
      };

    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.CUSTOMERS).fetchAll().then(function (snapshot) {
            const array = []
            snapshot.forEach(function (child) {
                const customer = {
                    ...child.val()
                }
                console.log(customer)
                array.push(customer)
                setCustomerList([...array]);
            })
        })
    }, []);

    useEffect(() => {
        if (orderId == 0) resetFormControls()
        else {
            createAPIEndpoint(ENDPOINTS.ORDERS).fetchAll()
            .then(function(snapshot){
                console.log(snapshot)
                snapshot.forEach(function(child) {
                    console.log(child.val())
                    if(child.val().id == orderId){
                        const order = {
                            ...child.val()
                        }
                        setValues(order)
                        console.log(child.val())
                        return
                    }
                })
            })
            .catch(err => console.log(err))
        }
    }, [orderId]);

    useEffect(() => {
        let totalPrice = values.orderFurnitures.reduce((tempTotal, item) => {
            return tempTotal + (item.quantity * item.price * (1-values.discount/100));
        }, 0);
        let priceWithoutDiscount = values.orderFurnitures.reduce((tempTotal, item) => {
            return tempTotal + (item.quantity * item.price );
        }, 0);
        setValues({
            ...values,
            totalPrice: totalPrice.toFixed(2),
            priceWithoutDiscount: priceWithoutDiscount.toFixed(2)
        })

    }, [JSON.stringify(values.discount), JSON.stringify(values.orderFurnitures)]);

    const validateForm = () => {
        let temp = {};
        temp.customerId = values.customerId != 0 ? "" : "Ovo polje je obavezno";
        temp.paymentMethod = values.paymentMethod != "none" ? "" : "Ovo polje je obavezno";
        temp.currency = values.currency != null ? "" : "Ovo polje je obavezno";
        setErrors({ ...temp });
        return Object.values(temp).every(x => x === "");
    }

    const submitOrder = e => {
        e.preventDefault();
        if (validateForm()) {
            if (values.id == 0) {
                console.log("values ");
                console.log(values);
                values.id = uuidv4();
                values.employee = currentUser.email;
                createAPIEndpoint(ENDPOINTS.ORDERS).create(values)
                setNotify({ isOpen: true, message: 'Porudžbina je kreirana' });
                resetFormControls()
            }
            else {
                console.log(values.id)
                createAPIEndpoint(ENDPOINTS.ORDERS).update(values.id)
                .then((snapshot) => {
                    snapshot.forEach(function(child) {
                        child.ref.child('paymentMethod').set(values.paymentMethod);
                        child.ref.child('orderDate').set(values.orderDate);
                        child.ref.child('currency').set(values.currency);
                        child.ref.child('discount').set(values.discount);
                        child.ref.child('priceWithoutDiscount').set(values.priceWithoutDiscount);
                        child.ref.child('totalPrice').set(values.totalPrice);
                        child.ref.child('confirmed').set(values.confirmed);
                        child.ref.child('customer').set(values.customer);
                        child.ref.child('employee').set(values.employee);
                        child.ref.child('orderFurnitures').set(values.orderFurnitures);
                    })
                    setOrderId(0);
                    setNotify({ isOpen: true, message: 'Porudžbina je izmenjena' });
                })


                createAPIEndpoint(ENDPOINTS.ORDERS).update(values.id, values)
                    .then(res => {
                       
                    })
                    .catch(err => {
                        console.log(err)
                    });
            }
        }

    }

    const openListOfOrders = () => {
        setOrderListVisibility(true);
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
                        <Input
                            label="Valuta"
                            name="currency"
                            value={values.currency}
                            //onChange={handleInputChange}
                            onChange={(e) => setValues({...values, currency: e.target.value})}
                            error={errors.currency}
                        />
                        <Input
                            label="Popust"
                            name="discount"
                            value={values.discount}
                            onChange={(e) => setValues({...values, discount: e.target.value})}
                        />
                       <Input
                            label="Kupac"
                            name="customer"
                            value={values.customer}
                            //onChange={handleInputChange}
                            onChange={(e) => setValues({...values, customer: e.target.value})}
                            error={errors.customer}
                        />
                        <div style={{margin: '8px'}}>
                            <p>Potvrdjena: 
                            <Checkbox
                            label="Potvrdi porudzbinu"
                            checked={values.confirmed}
                            name="confirmed"
                            //value={values.confirmed}
                            onChange={handleChange}
                            color= "secondary"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        </p>
                        </div>

                    </Grid>
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
                            <MuiButton
                                size="small"
                                onClick={resetForm}
                                startIcon={<ReplayIcon />}
                            />
                        </ButtonGroup>
                        <Button
                            size="large"
                            onClick={openListOfOrders}
                            startIcon={<ReorderIcon />}
                        >Lista porudžbina</Button>
                    </Grid>
                </Grid>
            </Form>
            <Popup
                title="Lista porudžbina"
                openPopup={orderListVisibility}
                setOpenPopup={setOrderListVisibility}>
                <OrderList
                    {...{ setOrderId, setOrderListVisibility, resetFormControls, setNotify }} />
            </Popup>
            <Notification
                {...{ notify, setNotify }} />
        </>
    )
}
