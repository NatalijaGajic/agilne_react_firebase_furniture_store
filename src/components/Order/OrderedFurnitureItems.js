import React, { useState } from 'react'
import { List, ListItemText, Paper, ListItem, ListItemSecondaryAction, IconButton, ButtonGroup, Button, makeStyles } from '@material-ui/core';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import Notification from "../../layouts/Notification";

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
    }
}))

export default function OrderedFurnitureItems(props) {
    const { values, setValues } = props;
    const classes = useStyles();
    const [notify, setNotify] = useState({ isOpen: false })

    let orderedFurnitureItems = values.orderFurnitures;

    const removeFurniture = (index, id) => {
        let x = { ...values };
        x.orderFurnitures = x.orderFurnitures.filter((_, i) => i != index);
        if (id !== 0 && !x.confirmed)  {
            x.deletedOrderItemIds += id + ',';
            setValues({ ...x });
        }
        else 
            setNotify({ isOpen: true, message: 'Ne može biti obrisana jer je porudžbina prethodno već potvrđena' });
    }

    const updateQuantity = (idx, value) => {
        let x = { ...values };
        let furnitureItem = x.orderFurnitures[idx];
        if (furnitureItem.quantity + value > 0) {
            furnitureItem.quantity += value;
            setValues({ ...x });
        }
    }


    return (
        <>
        <List>
            {orderedFurnitureItems.length == 0 ?
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
                : orderedFurnitureItems.map((item, idx) => (
                    <Paper key={idx}>
                        <ListItem>
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
                                            {(item.quantity * item.price) + ' RSD'}
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
                                    onClick={e => removeFurniture(idx, item.id)}
                                >
                                    <DeleteTwoToneIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </Paper>
                ))
            }
        </List>
        <Notification
        {...{ notify, setNotify }} />
        </>
    )
}
