import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import createMiddleware from './clientMiddleware';
import reducer from './reducer';

const logger = createLogger({
  predicate: (a, action) => {
    // const pass = (
    //   action.type === ''
    // );
    // if(pass) {
    //   return false;
    // }
    return true;
  },
  duration: true,
  level: 'warn',
  // diff: true
  // ...options
});

export default function createStore(client, data) {
  const middleware = [createMiddleware(client), thunk];
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = _createStore(
    reducer,
    data || undefined,
    composeEnhancers(applyMiddleware(...middleware))
  );

  return store;
}
