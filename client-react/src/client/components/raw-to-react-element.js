import React from 'react';
import sharedComponents from './shared-components';

/*
   arguments: <ReactElement> or <{ elementType: <string>, elementProps: <object>, callArguments: <array>}>
   return: <ReactElement>
*/
let rawToReactElement = (rawElement, key) => {
  if (React.isValidElement(rawElement)) {
    return typeof key === 'undefined' ? { ...rawElement } : { ...rawElement, key };
  }

  let elementType = sharedComponents[rawElement.elementType];

  if (typeof rawElement.callArguments !== 'undefined') {
    return sharedComponents[rawElement.elementType](...rawElement.callArguments);
  }

  let rawColumn = rawElement.elementType === 'Column';

  if (rawColumn) {
    let rawCellRenderer = rawElement.elementProps.cellRenderer;
    let rawHeaderRenderer = rawElement.elementProps.headerRenderer;

    let cellRenderer = rawToReactElement(rawCellRenderer);
    let headerRenderer = rawToReactElement(rawHeaderRenderer);
    let columnProps = {
      ...rawElement.elementProps,
      cellRenderer,
      headerRenderer
    };

    return React.createElement(elementType, { ...columnProps, key });
  }

  return typeof key === 'undefined' ?
    React.createElement(elementType, { ...rawElement.elementProps }) :
    React.createElement(elementType, { ...rawElement.elementProps, key });
};

export default rawToReactElement;
