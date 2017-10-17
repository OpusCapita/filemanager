import { combineReducers } from 'redux';
import viewport from './viewport';
import layout from './layout';
import fsm from './fsm';
import stateNodes from './state-nodes';
import selectedItem from './selected-item';
import transitions from './transitions';
import transitionsMeta from './transitions-meta';

export default combineReducers({
  fsm,
  viewport,
  layout,
  stateNodes,
  selectedItem,
  transitions,
  transitionsMeta
});
