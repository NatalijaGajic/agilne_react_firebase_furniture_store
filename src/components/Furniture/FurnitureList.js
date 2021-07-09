import {useEffect, useState} from 'react'
import FurnitureItem from './FurnitureItem';
import classes from './FurnitureList.module.css';
import { Grid } from '@material-ui/core';

export default function FurnitureList({furnitures, page, perPage}) {
    const startIndex = (page) * perPage;
    const selectedFurnitures = furnitures.slice(startIndex, startIndex + perPage);
    const [data, setData] = useState(furnitures)

    useEffect(() => {
      setData(furnitures)
    }, [furnitures])
    //izkomentarisi molim teee
    //ajdee

    return (
    <Grid container>
    <div className={classes.list}>
      {selectedFurnitures.map((data) => (
        <FurnitureItem
          key={data.id}
          id={data.id}
          name={data.name}
          size={data.size}
          price={data.price}
          color={data.color}
          inStock={data.inStock}
          image={data.image}
          description={data.description}
          stockQuantity={data.stockQuantity}
          supplierId={data.supplierId}
          categoryId={data.categoryId}
          modelId={data.modelId}
          materialId={data.mate}
        />
      ))}
    </div>
    </Grid>
  );
}
