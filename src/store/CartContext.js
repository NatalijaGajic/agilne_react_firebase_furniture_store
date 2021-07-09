import { createContext, useState } from 'react';

const CartContext = createContext({
  cartItems: [],
  totalItems: 0,
  totalPrice: (price) => {},
  addToCart: (furniture) => {},
  removeFromCart: (furnitureId) => {},
  itemIsIncart: (furnitureId) => {},
  emptyCart: () => {}
});

export function CartContextProvider(props) {
  const [cart, setCart] = useState([]);

  function addToCartHandler(furniture) {
    setCart((prevCart) => {
      return prevCart.concat(furniture);
    });
  }

  function removeFromCartHandler(furnitureId) {
    setCart(prevCart => {
      return prevCart.filter(furniture => furniture.furnitureId !== furnitureId);
    });
  }

  function itemIsInCarteHandler(furnitureId) {
    return cart.some(furniture => furniture.furnitureId === furnitureId);
  }

  function setTotalPriceHandler(price) {
    return price;
  }

  function emptyCart(){
    console.log('emptyCart')
    setCart((prevCart) => {
      return [];
    })
  }

  const context = {
    cartItems: cart,
    totalItems: cart.length,
    addToCart: addToCartHandler,
    removeFromCart: removeFromCartHandler,
    itemIsInCart: itemIsInCarteHandler,
    totalPrice: setTotalPriceHandler,
    emptyCart: emptyCart
  };

  return (
    <CartContext.Provider value={context}>
      {props.children}
    </CartContext.Provider>
  );
}

export default CartContext;
