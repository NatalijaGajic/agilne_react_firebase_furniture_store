import Card from '../../layouts/Card';
import classes from './FurnitureItem.module.css';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      '& > * + *': {
        marginTop: theme.spacing(1),
      },
      alignSelf: 'center'
    },
    root2: {
        alignSelf: 'center',
        marginBottom: '20px'
      }
  }));


function FurnitureItem(props) {

    const syle = useStyles();

    return (
        <Card>
            <div className={classes.image}>
                <Link to={'/furnitures/' + props.id}>
                    <img src={props.image} />
                </Link>
            </div>
            <div className={classes.content}>
                <Link to={'/furnitures/' + props.id}>
                    <h3>{props.name}</h3>
                </Link>
                <p>dimenzije: {props.size} cm</p>
            </div>
            <div className={classes.price}>
                <p>{props.price} RSD</p>
            </div>
        </Card>
    );
}

export default FurnitureItem;