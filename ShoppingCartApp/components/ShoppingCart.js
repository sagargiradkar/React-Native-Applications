import React from 'react';
import { Provider } from 'react-redux';
import store from './store'; // Import your Redux store
import ProductList from './ProductList'; // Import your connected components
import ShoppingCart from './ShoppingCart'; // Import your connected components

const App = () => {
  return (
    <Provider store={store}>
      <ProductList />
      <ShoppingCart />
    </Provider>
  );
};

export default App;
