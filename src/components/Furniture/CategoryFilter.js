import React, { useState, useEffect } from 'react'
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import {Select } from "../../controls";
import { useHistory } from 'react-router-dom';

export default function CategoryFilter(props) {
    const {setFilter} = props
    const [categoryList, setCategoryList] = useState([]);
    const history = useHistory();

    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.CATEGORIES).fetchAll().then(function(snapshot){
            const array = []
            snapshot.forEach(function(child) {
                    const category = {
                        id: child.val().id,
                        title: child.val().name
                    }
                    array.push(category)
                    setCategoryList([...array])
            })
        })
    }, [])

    const setCategory = (value) => {
        console.log('setCategory')
        setFilter(value)
        history.replace('/furnitures?category=' + value);    
    }

    return (
        <div style={{margin:'12px'}}>
            <Select
                label="Kategorija namestaja"
                name="category"
                onChange={(e) => setCategory(e.target.value)}
                value={categoryList.id}
                options={categoryList}
            />
        </div>
    )
}
