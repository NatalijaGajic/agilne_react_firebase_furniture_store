import FurnitureList from "../components/Furniture/FurnitureList"
import { useState, useEffect } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import CategoryFilter from "../components/Furniture/CategoryFilter";
import TablePagination from "@material-ui/core/TablePagination";
import { fireDb, storage } from "../firebase";


export default function Furnitures() {

    const [loadedFurnitures, setLoadedFurnitures] = useState([]);
    const queryParam = window.location.search.split("category=")[1];
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [flag, setFlag] = useState(false)
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
      //const emptyRows = rowsPerPage - Math.min(rowsPerPage, loadedFurnitures.length - page * rowsPerPage);
    

    useEffect(() => {
        console.log('useEffect u furnitures.js')
            setFlag(false)
            createAPIEndpoint(ENDPOINTS.FURNITURES).fetchAll().then(function(snapshot){
                const array = []
                snapshot.forEach(function(child) {
                        const furniture = {
                            ...child.val()
                        }
                        array.push(furniture)
                    })
                    if(queryParam != null){
                        const furnituresByCategory = array.filter(value => value.categoryId == queryParam) 
                        setLoadedFurnitures(furnituresByCategory);
                        console.log('query params set')
                    }else{
                        setLoadedFurnitures([...array])
                    }
            })
            setFlag(true)

    }, [filter]);

    return (
        <div>
            <div className="bannerProductPage">
                <div className="banner__content">
                    <div className="container">
                        <div className="banner__text">
                            <h3 style={{ color: 'white' }}>PROIZVODI</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ margin: '20px 70px' }}>
                <CategoryFilter setFilter={setFilter}/>
                {flag && <FurnitureList furnitures={loadedFurnitures} page={page} perPage={rowsPerPage}/>}
                <div>
                    <TablePagination
                        rowsPerPageOptions={[12, 16, 20]}
                        count={loadedFurnitures.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </div>
            </div>
        </div>
    )
}
