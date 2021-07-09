import { useContext } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import { getRole } from '../api/common';
import { getToken } from '../api/common';
import CartContext from '../store/CartContext';
import Notification from "../layouts/Notification";
import { fireDb, storage } from "../firebase";
import { useAuth } from "../store/AuthContext"

const useStyles = makeStyles({
    table: {
      minWidth: 650,
      marginTop: '15px'
    },
    status: {
        color: 'grey'
    }
  });

const admin = true
export default function FurnitureDetails() {
    const [role, setRole] = useState();
    const { id } = useParams();
    const [loadedFurniture, setLoadedFurniture] = useState({});
    const classes = useStyles();
    const history = useHistory();
    const cartCtx = useContext(CartContext);
    const [notify, setNotify] = useState({ isOpen: false })
    const { currentUser } = useAuth()

    useEffect(() => {
        if (currentUser && currentUser.email == 'admin@gmail.com') {
            setRole('admin')
            console.log(role)
        }
      }, [currentUser])

    useEffect(() => {
        console.log(id)
        createAPIEndpoint(ENDPOINTS.FURNITURES).fetchAll()
            .then(function(snapshot){
                snapshot.forEach(function(child) {
                    if(child.val().id == id){
                        const furniture = {
                            ...child.val()
                        }
                        setLoadedFurniture(furniture)
                        return
                    }
                })
            })
            .catch(err => console.log(err))
    }, []);

    const handleDelete = index => {
        if (window.confirm('Da li ste sigurni da želite da obrišete ovaj proizvod?')) {
            createAPIEndpoint(ENDPOINTS.FURNITURES).delete(index)
            .then((snapshot) => {
                snapshot.forEach(function(child) {
                    child.ref.remove();
                })
                setNotify({ isOpen: true, message:'Proizvod uspešno obrisan!' });
                history.replace('/furnitures');
           
            })
        }
    }

    function cartHandler() {
        const isInCart = cartCtx.itemIsInCart(loadedFurniture.id);
        if(!isInCart){
            cartCtx.addToCart({
                id: 0,
                furnitureId: loadedFurniture.id,
                orderId: 0,
                quantity: 1,
                discount: 0,
                name: loadedFurniture.name,
                image: loadedFurniture.image,
                price: loadedFurniture.price,
            });
        } else 
        setNotify({isOpen:true, message:'Ovaj proizvod je već u korpi'});
    }

    return (
        <>
            <div className="app">
                <div className="details" key="id">
                    <div className="big-img">
                        <img src={loadedFurniture.image} alt="" />
                    </div>
                    <div className="box">
                        <div className="row">
                            <h2>{loadedFurniture.name}</h2>
                        </div>
                        <hr></hr>
                        <p>Dimenzije: {loadedFurniture.size} cm</p>
                        <p className={classes.status}>Status: {loadedFurniture.stockQuantity > 0 ? "Na stanju" : "Trenutno nije na stanju"}</p>
                        {role == "admin" && <p>Količina: {loadedFurniture.stockQuantity}</p>}
                        <p>{loadedFurniture.description}</p>
                        <div className="detailPrice">
                            {loadedFurniture.price} RSD
                        </div>
                        {loadedFurniture.stockQuantity > 0 && currentUser && <button className="cart" onClick={cartHandler}>Dodaj u korpu</button>}

                        {role == "admin" && <button className="delete" onClick={() => handleDelete(loadedFurniture.id)}>Obriši</button>}
                        {role == "admin" && <button className="cart" onClick={() => history.push(`/createFurniture/${loadedFurniture.id}`)}>Izmeni</button>}

                    </div>
                </div>
            </div>
            <div className="app">
                <div className="details" key="id">
                    <h2>Specifikacija</h2>
                            <TableContainer className={classes.table} component={Paper}>
                                <Table aria-label="simple table">
                                    <TableBody>
                                    <TableRow>
                                        <TableCell>Dimenzije:</TableCell>
                                        <TableCell>{loadedFurniture.size} cm</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Materijal:</TableCell>
                                        <TableCell>{loadedFurniture.materialName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Kategorija:</TableCell>
                                        <TableCell>{loadedFurniture.categoryName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Model:</TableCell>
                                        <TableCell>{loadedFurniture.modelName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Dobavljač:</TableCell>
                                        <TableCell>{loadedFurniture.supplierName}</TableCell>
                                    </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                </div>
            </div>
            <Notification
                {...{ notify, setNotify }} />
        </>
    )
}
    


