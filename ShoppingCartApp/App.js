import React from 'react';
import { Provider } from 'react-redux';
import store from './store'; // Import your Redux store
import ProductList from './components/ProductList'; // Import your connected components
import ShoppingCart from './components/ShoppingCart'; // Import your connected components

const App = () => {
  return (
    <Provider store={store}>
      <ProductList />
      <ShoppingCart />
    </Provider>
  );
};

export default App;
