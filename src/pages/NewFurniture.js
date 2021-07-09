import React from 'react'
import FurnitureForm from '../components/Furniture/FurnitureForm'
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from '../hooks/useForm';
import { v4 as uuidv4 } from 'uuid';


const useStyles = makeStyles({
    align: {
    textAlign: '-webkit-center',
    marginTop: '15px'
    },
  });

const getFreshModelObject = () => ({
    id: uuidv4(),
    name: '',
    size: '',
    price: 0,
    color: '',
    image: '/images/preview.jpg',
    stockQuantity: 0,
    description: '',
    supplierName: '',
    supplierId: 0,
    categoryId: 0,
    modelId: 0,
    materialId: 0,
    categoryName: '',
    modelName: '',
    materialName: ''

})


export default function NewFurniture() {
    const classes = useStyles();
    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetFormControls
    } = useForm(getFreshModelObject);

    // function addFurnitureHandler(furnitureData) {
    //     createAPIEndpoint(ENDPOINTS.FURNITURES).create(furnitureData)
    //     .then(() => {
    //         history.replace('/furnitures');
    //     });
    // }
    return (
        <div className={classes.align}>
            <FurnitureForm {...{ 
                        values, 
                        setValues,
                        errors, 
                        setErrors,
                        resetFormControls,
                        handleInputChange }}/>
        </div>
    )
}
