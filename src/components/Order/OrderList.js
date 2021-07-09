import React, { useState, useEffect } from 'react'
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import Table from "../../layouts/Table";
import { TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineTwoToneIcon from '@material-ui/icons/DeleteOutlineTwoTone';
import firebase from '../../firebase'

export default function OrderList(props) {

    const { setOrderId, setOrderListVisibility, resetFormControls, setNotify } = props;
    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
            createAPIEndpoint(ENDPOINTS.ORDERS).fetchAll().then(function(snapshot){
                const array = []
                snapshot.forEach(function(child) {
                        const order = {
                            ...child.val()
                        }
                        console.log("lista")
                        console.log(order)
                        array.push(order)
                        setOrderList([...array])
                })
            })
    }, []);

    const showForUpdate = id => {
        setOrderId(id);
        setOrderListVisibility(false);
    }

    const deleteOrder = item => {
        if (window.confirm('Da li ste sigurni da želite da obrišete ovu porudžbinu?')) {
            if (item.confirmed) {
                setNotify({ isOpen: true, message: 'Porudžbina ne može biti obrisana jer je prethodno već potvrđena!' });
            } else {
                createAPIEndpoint(ENDPOINTS.ORDERS).delete(item.id)
                    .then((snapshot) => {
                        snapshot.forEach(function (child) {
                            child.ref.remove();
                        })
                        setOrderListVisibility(false);
                        setOrderId(0);
                        resetFormControls();
                        setNotify({ isOpen: true, message: 'Porudžbina uspešno obrisana!' });
                    })
            }
        }
    }


    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Broj porudžbine</TableCell>
                        <TableCell>Kupac</TableCell>
                        <TableCell>Način plaćanja</TableCell>
                        <TableCell>Potvrđena</TableCell>
                        <TableCell>Ukupna cena</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        orderList.map(item => (
                            <TableRow key={item.id}>
                                <TableCell
                                    onClick={e => showForUpdate(item.id)}>
                                    {item.id}
                                </TableCell>
                                <TableCell
                                    onClick={e => showForUpdate(item.id)}>
                                    {item.customer}
                                </TableCell>
                                <TableCell
                                    onClick={e => showForUpdate(item.id)}>
                                    {item.paymentMethod}
                                </TableCell>
                                <TableCell
                                    onClick={e => showForUpdate(item.id)}>
                                    {item.confirmed ? "Da" : "Ne"}
                                </TableCell>
                                <TableCell
                                    onClick={e => showForUpdate(item.id)}>
                                    {item.totalPrice}
                                </TableCell>
                                <TableCell>
                                    <EditOutlinedIcon
                                        color="secondary"
                                        onClick={e => showForUpdate(item.id)} />
                                </TableCell>
                                <TableCell>
                                    <DeleteOutlineTwoToneIcon
                                        color="secondary"
                                        onClick={e => deleteOrder(item)} />
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </>
    )
}