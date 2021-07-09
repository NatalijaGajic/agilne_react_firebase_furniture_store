import { useContext } from 'react';
import React, { useEffect, useState} from 'react'
import CartContext from '../store/CartContext';
import { List, ListItemText, Paper, ListItem, ListItemSecondaryAction, IconButton, ButtonGroup, Button, makeStyles} from '@material-ui/core';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import { Grid } from '@material-ui/core';
import { Container, Typography } from "@material-ui/core";
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    paperRoot: {
        margin: '15px 0px',
        '&:hover': {
            cursor: 'pointer'
        },
        '&:hover $deleteButton': {
            display: 'block'
        }
    },
    paper: {
        margin: '10px 50px'
    },
    buttonGroup: {
        backgroundColor: '#E3E3E3',
        borderRadius: 8,
        '& .MuiButtonBase-root ': {
            border: 'none',
            minWidth: '25px',
            padding: '1px'
        },
        '& button:nth-child(2)': {
            fontSize: '1.2em',
            color: '#000'
        }
    },
    deleteButton: {
  
        '& .MuiButtonBase-root': {
            color: '#E81719'
        },
    },
    totalPerItem: {
        fontWeight: 'bolder',
        fontSize: '1.2em',
        margin: '0px 10px'
    },
    totalPrice: {
        textAlignLast: 'right',
        margin: '10px 50px'
    }
}))

function Cart() {
    const cartCtx = useContext(CartContext);
    const classes = useStyles();
    const [totalPrice, setTotalPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);

    const updateQuantity = (idx, value) => {
        let x = { ...cartCtx };
        let furnitureItem = x.cartItems[idx];
        if (furnitureItem.quantity + value > 0) {
            setQuantity(furnitureItem.quantity += value);
        }
    }

    const removeFurniture = ( id) => {
        cartCtx.removeFromCart(id);
    }

    useEffect(() => {
        setTotalPrice(cartCtx.cartItems.reduce((tempTotal, item) => {
            return (tempTotal + (item.quantity * item.price));
        }, 0));

    }, [JSON.stringify(cartCtx.cartItems)]);

    return (
        <>
            <Container>
                <Typography
                    gutterBottom
                    variant="h3"
                    align="center"
                    style={{ marginTop: '10px' }}>
                    Korpa
            </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <List>
                            {cartCtx.totalItems === 0 ?
                                <ListItem>
                                    <ListItemText
                                        primary="Trenutno nema proizvoda"
                                        primaryTypographyProps={{
                                            style: {
                                                textAlign: 'center',
                                                fontStyle: 'italic'
                                            }
                                        }}
                                    />
                                </ListItem>
                                : cartCtx.cartItems.map((item, idx) => (
                                    <Paper className={classes.paper} key={idx}>
                                        <ListItem>
                                            <img style={{ width: '150px', marginRight: '50px' }} src={item.image} />
                                            <ListItemText

                                                primary={item.name}
                                                primaryTypographyProps={{
                                                    component: 'h1',
                                                    style: {
                                                        fontWeight: '500',
                                                        fontSize: '1.2em'
                                                    }
                                                }}
                                                secondary={
                                                    <>
                                                        <ButtonGroup
                                                            className={classes.buttonGroup}
                                                            size="small">
                                                            <Button
                                                                onClick={e => updateQuantity(idx, -1)}
                                                            >-</Button>
                                                            <Button
                                                                disabled
                                                            >{item.quantity}</Button>
                                                            <Button
                                                                onClick={e => updateQuantity(idx, 1)}
                                                            >+</Button>
                                                        </ButtonGroup>
                                                        <span className={classes.totalPerItem}>
                                                            {(item.quantity * item.price).toFixed(2) + ' RSD'}
                                                        </span>
                                                    </>
                                                }
                                                secondaryTypographyProps={{
                                                    component: 'div'
                                                }}
                                            />
                                            <ListItemSecondaryAction
                                                className={classes.deleteButton}>
                                                <IconButton
                                                    disableRipple
                                                    onClick={e => removeFurniture(item.furnitureId)}
                                                >
                                                    <DeleteTwoToneIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </Paper>
                                ))
                            }
                            <Button
                                size="large"
                                style={{ backgroundColor: 'deepskyblue', margin: '10px 50px' }}
                                component={Link} to='/furnitures'
                                startIcon={<SkipPreviousIcon />}>
                                Nastavite sa kupovinom
                        </Button>
                            {cartCtx.totalItems !== 0 && <Button
                                component={Link} to='/checkout'
                                size="large"
                                style={{ backgroundColor: 'deepskyblue', margin: '10px 50px', float: 'right' }}
                                endIcon={<SkipNextIcon />}>
                                Nastavite sa plaćanjem
                        </Button>}
                            {cartCtx.totalItems !== 0 &&
                                <div className={classes.totalPrice}>
                                    <h3>Ukupna cena: </h3>
                                    <h2>{(totalPrice).toFixed(2)} RSD</h2>
                                </div>
                            }
                        </List>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default Cart;
