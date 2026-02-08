import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  user: null,
  token: null,
  cart: [],
  setUser: () => {},
  setToken: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartQuantity: () => {}, // 👈 1. Make sure this placeholder is here
});

export const useStateContext = () => useContext(StateContext);

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
  const [cart, setCart] = useState([]);

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token);
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
    }
  };

  // ✅ Add Item to Cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if item already exists
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // If exists, just update quantity
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + product.quantity } 
            : item
        );
      } else {
        // If new, add to array
        return [...prevCart, product];
      }
    });
  };

  // ✅ Remove Item
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  // ✅ Update Quantity (THE FIX IS HERE)
  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return; 

    setCart((currentCart) => {
      return currentCart.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  return (
    <StateContext.Provider value={{
      user,
      setUser,
      token,
      setToken,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity // 👈 2. IMPORTANT: THIS MUST BE HERE!
    }}>
      {children}
    </StateContext.Provider>
  );
};