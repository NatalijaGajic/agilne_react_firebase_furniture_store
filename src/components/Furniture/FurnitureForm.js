import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import classes from './FurnitureForm.module.css';
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import Form from "../../layouts/Form";
import { Select, Input } from "../../controls"
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { storage } from '../../firebase';


const useStyles = makeStyles((theme) => ({
    img: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '200px',
        height: '200px'
      }
}));

const imageInfo = {
    imagePath: '',
    imageFile: ''
}

export default function FurnitureForm(props) {

    const { values, setValues, errors, setErrors, handleInputChange, resetFormControls } = props;
    const history = useHistory();
    const [supplierList, setSupplierList] = useState([{id: 0, title:''}]);
    const [categoryList, setCategoryList] = useState([{id: 0, title:''}]);
    const [modelList, setModelList] = useState([{id: 0, title:''}]);
    const [materialList, setMaterialList] = useState([{id: 0, title:''}]);
    const { id } = useParams();
    const customClasses = useStyles();
    const defaultImageSource = '/images/preview.jpg'
    const storageRef = storage.ref()
    const [image, setImage] = useState(imageInfo);
    const [body, setBody] = useState({})
    const [imageForUpdate, setImageForUpdate] = useState(null)
    const [previewImage, setPreviewImage] = useState('/images/preview.jpg')
    
    useEffect(() => {
        if (id) {
            createAPIEndpoint(ENDPOINTS.FURNITURES).fetchAll()
            .then(function(snapshot){
                snapshot.forEach(function(child) {
                    if(child.val().id == id){
                        const furniture = {
                            ...child.val()
                        }
                        setValues(furniture)
                        setPreviewImage(furniture.image)
                        return
                    }
                })
            })
            .catch(err => console.log(err))
        }
    }, []);

    useEffect(() => {
            createAPIEndpoint(ENDPOINTS.MATERIALS).fetchAll().then(function(snapshot){
                const array = []
                snapshot.forEach(function(child) {
                    let material = {
                        id: child.val().id,
                        title: child.val().name    
                    }
                        array.push(material)
                })
                setMaterialList([...array])
            })
    }, [])
    
    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.MODELS).fetchAll().then(function(snapshot){
                const array = []
                snapshot.forEach(function(child) {
                    let model = {
                        id: child.val().id,
                        title: child.val().name    
                    }
                        array.push(model)
                })
                setModelList([...array])
            })
    }, [])

    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.CATEGORIES).fetchAll().then(function(snapshot){
            const array = []
            snapshot.forEach(function(child) {
                let category = {
                    id: child.val().id,
                    title: child.val().name    
                }
                    array.push(category)
            })
            setCategoryList([...array])
        })
    }, [])

    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.SUPPLIERS).fetchAll().then(function(snapshot){
            const array = []
            snapshot.forEach(function(child) {
                let supplier = {
                    id: child.val().id,
                    title: child.val().name    
                }
                    array.push(supplier)
            })
            setSupplierList([...array])
        })
    }, [])

    const validateForm = () => {
        let temp = {};
        temp.name = values.name != '' ? "" : "Obavezno je uneti naziv nameštaja";
        temp.size = values.size != '' ? "" : "Obavezno je uneti dimenizije nameštaja";
        temp.price = values.price >= 0 ? "" : "Cena ne može biti manja od 0";
        temp.image = values.image != '' ? "" : "Obavezno je uneti sliku nameštaja";
        temp.color = values.color != '' ? "" : "Obavezno je uneti boju nameštaja";
        temp.stockQuantity = values.stockQuantity >= 0 ? "" : "Količina ne može biti manja od 0";
        temp.description = values.description != '' ? "" : "Obavezno je uneti opis nameštaja";
        temp.modelId = values.modelId != 0 ? "" : "Obavezno je uneti model nameštaja";
        temp.materialId = values.materialId != 0 ? "" : "Obavezno je uneti materijal od kog je napravljen nameštaj";
        temp.categoryId = values.categoryId != 0 ? "" : "Obavezno je uneti kategoriju nameštaja";
        temp.supplierId = values.supplierId != 0 ? "" : "Obavezno je uneti dobavljača nameštaja";
        setErrors({ ...temp });
        return Object.values(temp).every(x => x === "");
    }

    const submitFurniture = e => {
        e.preventDefault();
        if (validateForm()) {
            setBody({ 
                id: values.id,
                name: values.name,
                size: values.size,
                price: values.price,
                color: values.color,
                image: values.image,
                stockQuantity: values.stockQuantity,
                description: values.description,
                supplierName: supplierList.find(x => x.id == values.supplierId).title,
                supplierId: values.supplierId,
                categoryId: values.categoryId,
                modelId: values.modelId,
                materialId: values.materialId,
                categoryName:categoryList.find(x => x.id == values.categoryId).title,
                modelName: modelList.find(x => x.id == values.modelId).title,
                materialName: materialList.find(x => x.id == values.materialId).title

            })
            console.log(values)
            if (!id) {
                storageRef.child(values.image).put(image.imageFile).then((snapshot) => {
                    console.log('Uploaded a blob or file!');
                    console.log(snapshot)
                    storage.ref(values.image).getDownloadURL().then((url) => {
                        const createBody = { 
                            id: values.id,
                            name: values.name,
                            size: values.size,
                            price: values.price,
                            color: values.color,
                            image: url,
                            stockQuantity: values.stockQuantity,
                            description: values.description,
                            supplierName: supplierList.find(x => x.id == values.supplierId).title,
                            supplierId: values.supplierId,
                            categoryId: values.categoryId,
                            modelId: values.modelId,
                            materialId: values.materialId,
                            categoryName:categoryList.find(x => x.id == values.categoryId).title,
                            modelName: modelList.find(x => x.id == values.modelId).title,
                            materialName: materialList.find(x => x.id == values.materialId).title
            
                        }
                        createAPIEndpoint(ENDPOINTS.FURNITURES).create(createBody)
                        history.push('/furnitures')
                  });
                
                })
                
            } else {
                if(imageForUpdate != null){
                    storageRef.child(values.image).put(image.imageFile).then((snapshot) => {
                        console.log('Uploaded a blob or file!');
                        storage.ref(values.image).getDownloadURL().then((url) => {
                            createAPIEndpoint(ENDPOINTS.FURNITURES).update(values.id)
                            .then((snapshot) => {
                                console.log(url)
                                snapshot.forEach(function(child) {
                                    console.log('usao u snapshot')
                                    child.ref.child('name').set(values.name);
                                    child.ref.child('size').set(values.size);
                                    child.ref.child('price').set(values.price);
                                    child.ref.child('color').set(values.color);
                                    child.ref.child('image').set(url);
                                    child.ref.child('stockQuantity').set(values.stockQuantity);
                                    child.ref.child('description').set(values.description);
                                    child.ref.child('supplierName').set(supplierList.find(x => x.id == values.supplierId).title);
                                    child.ref.child('supplierId').set(values.supplierId);
                                    child.ref.child('categoryId').set(values.categoryId);
                                    child.ref.child('modelId').set(values.modelId);
                                    child.ref.child('materialId').set(values.materialId);
                                    child.ref.child('categoryName').set(categoryList.find(x => x.id == values.categoryId).title);
                                    child.ref.child('modelName').set(modelList.find(x => x.id == values.modelId).title);
                                    child.ref.child('materialName').set(materialList.find(x => x.id == values.materialId).title);
                                })
                                resetFormControls();
                                history.replace('/furnitures');
                            })
                      });
                    
                    })    
                } else {
                    createAPIEndpoint(ENDPOINTS.FURNITURES).update(values.id)
                    .then((snapshot) => {
                        console.log('update pls')
                        snapshot.forEach(function(child) {
                            child.ref.child('name').set(values.name);
                            child.ref.child('size').set(values.size);
                            child.ref.child('price').set(values.price);
                            child.ref.child('color').set(values.color);
                            child.ref.child('image').set(values.image);
                            child.ref.child('stockQuantity').set(values.stockQuantity);
                            child.ref.child('description').set(values.description);
                            child.ref.child('supplierName').set(supplierList.find(x => x.id == values.supplierId).title);
                            child.ref.child('supplierId').set(values.supplierId);
                            child.ref.child('categoryId').set(values.categoryId);
                            child.ref.child('modelId').set(values.modelId);
                            child.ref.child('materialId').set(values.materialId);
                            child.ref.child('categoryName').set(categoryList.find(x => x.id == values.categoryId).title);
                            child.ref.child('modelName').set(modelList.find(x => x.id == values.modelId).title);
                            child.ref.child('materialName').set(materialList.find(x => x.id == values.materialId).title);
                        })
                        resetFormControls();
                        history.replace('/furnitures');
                    })
                }
    
            }
        }

    }

    const showPreview = e => {
        if(e.target.files && e.target.files[0]){
            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setValues({
                    ...values,
                    image: "images/"+values.name.trim().replace(' ', '')+new Date().getTime()
                })
                setImage({
                    imageFile,
                    imagePath:x.target.result,
                })
                setPreviewImage(x.target.result)

            }
            reader.readAsDataURL(imageFile)
            if(id){
                setImageForUpdate(values.image)
            }
        }else{
            setValues({
                ...values,
                image: ''
            })
            setImage({
                imageFile: null,
                imagePath:defaultImageSource,
            })
        }
    }

    return (
        <>
            {id ? <h1>Izmeni nameštaj</h1> : <h1>Kreiraj nameštaj</h1>}
            <Form className={classes.form} onSubmit={submitFurniture}>
                <div className={classes.control}>
                    <label htmlFor='name'>Naziv nameštaja</label>
                    <Input
                        style={{width:"80%"}}
                        type='text'
                        required
                        id='name'
                        value={values.name}
                        onChange={(e) => setValues({ ...values, name: e.target.value })}
                        error={errors.name} />
                </div>
                <div className={classes.control}>
                    <label htmlFor='size'>Dimenzije nameštaja</label>
                    <Input
                        style={{width:"80%"}}
                        type='text'
                        required
                        id='size'
                        value={values.size}
                        onChange={(e) => setValues({ ...values, size: e.target.value })}
                        error={errors.size} />
                </div>
                <div className={classes.control}>
                    <label htmlFor='price'>Cena nameštaja</label>
                    <Input
                        style={{width:"80%"}}
                        type='number'
                        required
                        id='price'
                        value={values.price}
                        onChange={(e) => setValues({ ...values, price: e.target.value })}
                        error={errors.price} />
                </div>
                <div className={classes.control}>
                    <label htmlFor='color'>Boja nameštaja</label>
                    <Input
                        type='text'
                        required
                        id='color'
                        value={values.color}
                        style={{width:"80%"}}
                        onChange={(e) => setValues({ ...values, color: e.target.value })}
                        error={errors.color} />
                </div>
                <div className={classes.control}>
                    <label htmlFor='image'>Slika</label>
                    <img src={previewImage} className={customClasses.img}></img>
                    <input type="file" accept="image/*"
                    id="image-uploader"
                    style={{marginTop:'2em', width:"80%"}}
                    onChange={showPreview}></input>
                </div>
                <div className={classes.control}>
                    <label htmlFor='stockQuanity'>Količina nameštaja na stanju</label>
                    <Input
                        type='number'
                        required
                        id='stockQuanity'
                        value={values.stockQuantity}
                        style={{width:"80%"}}
                        onChange={(e) => setValues({ ...values, stockQuantity: e.target.value })}
                        error={errors.stockQuantity} />
                </div>
                <div className={classes.control}>
                    <label htmlFor='description'>Opis</label>
                    <textarea
                        style={{width:"80%"}}
                        id='description'
                        required
                        rows='5'
                        value={values.description}
                        onChange={(e) => setValues({ ...values, description: e.target.value })}
                        error={errors.description}
                    ></textarea>
                </div>
                <div >
                    
                    <Select
                        label="Dobavljac"
                        name="supplierId"
                        value={values.supplierId}
                        onChange={handleInputChange}
                        options={supplierList}
                        error={errors.supplierId}
                        style={{width:"80%"}}
                    />
                    <Select
                        style={{width:"80%"}}
                        label="Kategorija"
                        name="categoryId"
                        value={values.categoryId}
                        onChange={handleInputChange}
                        options={categoryList}
                        error={errors.categoryId}
                    />
                    <Select
                        style={{width:"80%"}}
                        label="Model"
                        name="modelId"
                        value={values.modelId}
                        onChange={handleInputChange}
                        options={modelList}
                        error={errors.modelId}
                    />
                    <Select
                        style={{width:"80%"}}
                        label="Materijal"
                        name="materialId"
                        value={values.materialId}
                        onChange={handleInputChange}
                        options={materialList}
                        error={errors.materialId}
                    />
                </div>
                <div className={classes.actions}>
                    {id ? <button type="submit">Izmeni</button> : <button type="submit">Kreiraj</button>}
                </div>
            </Form>
        </>
    )
}
