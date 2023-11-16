import { connect } from 'react-redux';
import { addToCart } from './actions';

const ProductList = ({ products, addToCart }) => {
  // Your component code here
};

const mapStateToProps = (state) => ({
  products: state.products,
});

export default connect(mapStateToProps, { addToCart })(ProductList);
