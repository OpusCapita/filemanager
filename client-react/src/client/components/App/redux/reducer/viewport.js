const UPDATE_CURSOR_POSITION = 'fsm/viewport/UPDATE_CURSOR_POSITION';
const UPDATE_VIEWPORT_RECT = 'fsm/viewport/UPDATE_VIEWPORT_RECT';
const UPDATE_VIEWPORT_SCALE = 'fsm/viewport/UPDATE_VIEWPORT_SCALE';
const UPDATE_VIEWPORT_PAN_OFFSET = 'fsm/viewport/UPDATE_VIEWPORT_PAN_OFFSET';
const UPDATE_VIEWPORT_SHOW_GRID = 'fsm/viewport/UPDATE_SHOW_GRID';
const REGISTER_STICKY_POINT = 'fsm/viewport/REGISTER_STICKY_POINT';
const UNREGISTER_STICKY_POINT = 'fsm/viewport/UNREGISTER_STICKY_POINT';
const UPDATE_VIEWPORT_PROPERTY = 'fsm/viewport/UPDATE_VIEWPORT_PROPERTY';

const initialState = {
  cursorPosition: { x: 0, y: 0 },
  viewportRect: {},
  viewportScale: 1,
  viewportPanOffset: { x: 0, y: 0 },
  showGrid: true,
  snapDistance: 20,
  viewportSize: 10000,
  stickyPoints: { },
  lastMouseDownPoint: null,
  lastMouseUpPoint: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_CURSOR_POSITION:
      return Object.assign({}, state, { 'cursorPosition': { ...action.value } });
    case UPDATE_VIEWPORT_RECT:
      return Object.assign({}, state, { 'viewportRect': { ...action.value } });
    case UPDATE_VIEWPORT_SCALE:
      return Object.assign({}, state, { 'viewportScale': action.value });
    case UPDATE_VIEWPORT_PAN_OFFSET:
      return Object.assign({}, state, { 'viewportPanOffset': { ...action.value } });
    case UPDATE_VIEWPORT_SHOW_GRID:
      return Object.assign({}, state, { 'showGrid': action.value });
    case REGISTER_STICKY_POINT: {
      const newStickyPoints = Object.assign({}, state.stickyPoints, { [action.key]: action.value });
      return Object.assign({}, state, { 'stickyPoints': newStickyPoints });
    }
    case UNREGISTER_STICKY_POINT: {
      const newStickyPoints = Object.assign({}, state.stickyPoints, { [action.key]: undefined });
      delete newStickyPoints[action.key];
      return Object.assign({}, state, { 'stickyPoints': newStickyPoints });
    }
    case UPDATE_VIEWPORT_PROPERTY:
      return Object.assign({}, state, { [action.key]: action.value });
    default:
      return state;
  }
}

export function updateCursorPosition(value) {
  return { type: UPDATE_CURSOR_POSITION, value };
}

export function updateViewportRect(value) {
  return { type: UPDATE_VIEWPORT_RECT, value };
}

export function updateViewportScale(value) {
  return { type: UPDATE_VIEWPORT_SCALE, value };
}

export function updateViewportPanOffset(value) {
  return { type: UPDATE_VIEWPORT_PAN_OFFSET, value };
}

export function updateViewportShowGrid(value) {
  return { type: UPDATE_VIEWPORT_SHOW_GRID, value };
}

export function registerStickyPoint(key, value) {
  return { type: REGISTER_STICKY_POINT, key, value };
}

export function unregisterStickyPoint(key, value) {
  return { type: UNREGISTER_STICKY_POINT, key, value };
}

export function updateViewportProperty(key, value) {
  return { type: UPDATE_VIEWPORT_PROPERTY, key, value };
}
