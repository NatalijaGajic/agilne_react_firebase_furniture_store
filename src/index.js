import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CartContextProvider } from './store/CartContext';
import "bootstrap/dist/css/bootstrap.min.css"

ReactDOM.render(
    <CartContextProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </CartContextProvider>,
    document.getElementById('root'));


