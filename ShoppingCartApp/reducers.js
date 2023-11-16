const initialState = {
    products: [
      { id: 1, name: 'Product 1', price: 10 },
      { id: 2, name: 'Product 2', price: 20 },
      { id: 3, name: 'Product 3', price: 30 },
    ],
    cart: [],
  };
  
  const cartReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_TO_CART':
        // Handle adding a product to the cart
        return {
          ...state,
          cart: [...state.cart, action.payload],
        };
      case 'REMOVE_FROM_CART':
        // Handle removing a product from the cart
        return {
          ...state,
          cart: state.cart.filter((product) => product.id !== action.payload),
        };
      default:
        return state;
    }
  };
  
  export default cartReducer;
  