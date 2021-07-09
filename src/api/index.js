import axios from "axios";
import { fireDb, storage } from "../firebase";

const BASE_URL = 'https://localhost:44365/api/';

export const ENDPOINTS = {
    CUSTOMERS: 'Customers',
    ORDERS: 'Orders',
    CATEGORIES: 'Categories',
    FURNITURES: 'Furnitures',
    SUPPLIERS: 'Suppliers',
    MATERIALS: 'Materials',
    MODELS: 'Models',
    USERS: 'Users'
}

export const createAPIEndpoint = child => {
    return {
        create: newRecord => fireDb.ref(child).push(newRecord, err => {
            if(err)
            console.log(err)
        }),
        fetchAll: () => fireDb.ref(child).once("value"),
        fetchImage: (image) => storage.ref(image).getDownloadURL(),
        fetchById: id => fireDb.ref(child).orderByChild('id').equalTo(id).once("value"),
        update: (id) => fireDb.ref(child).orderByChild('id').equalTo(id)
        .once("value"),
        delete: id => fireDb.ref(child).orderByChild('id').equalTo(id).once('value')
    }
}