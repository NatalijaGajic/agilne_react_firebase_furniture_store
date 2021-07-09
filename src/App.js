import { Route, Switch } from 'react-router-dom';
import './App.css';
import { Container, Typography } from "@material-ui/core";
import Order from "./components/Order";
import Header from "./layouts/Header"
import Home from "./pages/Home"
import Furnitures from "./pages/Furnitures"
import FurnitureDetails from "./pages/FurnitureDetails"
import NewFurniture from "./pages/NewFurniture"
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './components/Checkout';
import { AuthProvider } from './store/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div>
      <AuthProvider>
      <Header />
      <Switch>
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/furnitures' exact>
          <Furnitures />
        </Route>
        <PrivateRoute path='/createOrder' component={Order} />
        <PrivateRoute  path='/furnitures/:id' component={FurnitureDetails} />
        <Route path='/createFurniture/:id?' exact>
          <NewFurniture />
        </Route>
        <PrivateRoute path='/cart' component={Cart} />
        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/register'>
          <Register />
        </Route>
        <PrivateRoute path='/checkout' component={Checkout} />
      </Switch>
      </AuthProvider>
    </div>
  );
}

export default App;
