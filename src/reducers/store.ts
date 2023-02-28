import { applyMiddleware, createStore as createReduxStore } from 'redux';
import rootReducer from './rootReducer';

const store = createReduxStore(rootReducer, applyMiddleware());

export default store;
