import { useState } from 'react';
import { useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import classes from './Navbar.module.css';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PersonIcon from '@material-ui/icons/Person'
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import { getRole, getToken, removeUserSession } from '../api/common';
import { createAPIEndpoint, ENDPOINTS } from "../api";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CartContext from './../store/CartContext'
import {useAuth} from '../store/AuthContext'

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -4,
    top: 5,
    border: `1px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    color: '#2abafd'
  },
}))(Badge);

function Navbar() {
  const {currentUser, setCurrentUser, logout} = useAuth();
  const token = getToken();
  const cartCtx = useContext(CartContext);
  const history = useHistory();
  const [role, setRole] = useState();

  useEffect(() => {
    if (currentUser && currentUser.email == 'admin@gmail.com') {
        setRole('admin')
        console.log(role)
    }
    else {
      setRole('')
    }
  }, [currentUser])
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  async function handleSubmit(e) {
    e.preventDefault();  
      try {
        await logout()
        history.push("/login")
      } catch {
        console.log("Failed to log out")
      }
      
    
}

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link to='/'><img src="https://images.vexels.com/media/users/3/215432/isolated/preview/31b33333ec461a697f3c96aeb2623cb5-back-view-sofa-flat-furniture-by-vexels.png" width="90" height="80" alt="Logo" /></Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link to='/furnitures'>Proizvodi</Link>
          </li>
        </ul>
      </nav>
      <nav>
        <ul>
          <li>
            {role == 'admin' &&
              <div style={{marginRight: '20px'}}>
                <p className={classes.dropdown} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                  Radnik
                </p>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}><Link to='/createOrder'>Porudžbina</Link></MenuItem>
                  <MenuItem onClick={handleClose}><Link to='/createFurniture'>Nameštaj</Link></MenuItem>
                </Menu>
              </div>
            }
          </li>
          <div onClick={handleSubmit}>
          <li>
            { !currentUser && <Link to='/login'>
              Prijavi se
            </Link> }
              {currentUser && <Link to='/login'>
                Odjavi se
            </Link>
              }
              <IconButton aria-label="cart">
              <PersonIcon style={{ color: '#2abafd' }} />
            </IconButton>
          </li>
          </div>
          <li>
            <Link to='/cart'>
            <IconButton aria-label="cart">
              <StyledBadge badgeContent={cartCtx.totalItems} color='secondary'>
                <ShoppingCartIcon style={{ color: '#2abafd' }} />
              </StyledBadge>
            </IconButton>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;