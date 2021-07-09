import { List, ListItem, ListItemText, Paper, InputBase, IconButton, makeStyles, ListItemSecondaryAction } from '@material-ui/core';
import React, {useState, useEffect} from 'react'
import {createAPIEndpoint, ENDPOINTS} from "../../api"
import SearchIcon from '@material-ui/icons/Search';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles(theme => ({
    searchPaper: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
    },
    searchInput: {
        marginLeft: theme.spacing(1.5),
        flex: 1,
    },
    listRoot: {
        marginTop: theme.spacing(1),
        maxHeight: 450,
        overflow: 'auto',
        '& li:hover': {
            cursor: 'pointer',
            backgroundColor: '#E3E3E3'
        },
        '& li:hover .MuiButtonBase-root': {
            display: 'block',
            color: '#000',
        },
        '& .MuiButtonBase-root': {
            display: 'none'
        },
        '& .MuiButtonBase-root:hover': {
            backgroundColor: 'transparent'
        }
    }
}))

export default function SearchFurnitureItems(props) {

    const { values, setValues } = props;
    let orderedFurnitureItems = values.orderFurnitures;

    const [furnitureItems, setFurnitureItems] = useState([])
    const [searchList, setSearchList] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const classes = useStyles();

    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.FURNITURES).fetchAll().then(function (snapshot) {
            const array = []
            snapshot.forEach(function (child) {
                console.log('evo me')
                const furniture = {
                    ...child.val()
                }
                console.log(furniture)
                array.push(furniture)
                //setLoadedFurnitures([...array])
                setFurnitureItems([...array]);
                setSearchList([...array]);
            })
        })
    }, []);

    useEffect(() => {
        let x = [...furnitureItems];
        x = x.filter(y => {
            return y.name.toLowerCase().includes(searchKey.toLocaleLowerCase())
            && orderedFurnitureItems.every(item => item.furnitureId != y.id)
        });
        setSearchList(x);
    }, [searchKey, orderedFurnitureItems])

    const addFurniture = furniture => {
        let x = {
            orderFurnitureId: 0,
            orderId: values.id,
            furnitureId: furniture.id,
            quantity: 1,
            price: furniture.price,
            name: furniture.name
        }
        setValues({
            ...values,
            orderFurnitures: [...values.orderFurnitures, x]
        })
    }

    return (
        <>
            <Paper className={classes.searchPaper}>
                <InputBase
                    className={classes.searchInput}
                    value={searchKey}
                    onChange={e => setSearchKey(e.target.value)}
                    placeholder="Pretraži nameštaj" />
                <IconButton>
                    <SearchIcon />
                </IconButton>
            </Paper>
            <List className={classes.listRoot}>
                {
                    searchList.map((item, idx) => (
                        <ListItem
                            key={idx}
                        >
                            <ListItemText
                                primary={item.name}
                                secondary={item.price + ' rsd'} />
                            <ListItemSecondaryAction>
                                <IconButton onClick={e => addFurniture(item)}>
                                    <PlusOneIcon />
                                    <ArrowForwardIosIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))
                }
            </List>
        </>
    )
}
