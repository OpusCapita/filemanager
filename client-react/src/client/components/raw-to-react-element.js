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

  if (typeof rawElement['elementType'] === 'undefined') {
    return rawElement;
  }

  if (typeof rawElement.callArguments !== 'undefined') {
    return sharedComponents[rawElement.elementType](...rawElement.callArguments);
  }

  if (rawElement.elementType === 'Column') {
    let rawCellRenderer = rawElement.elementProps.cellRenderer;
    let rawHeaderRenderer = rawElement.elementProps.headerRenderer;

    let cellRenderer = rawToReactElement(rawCellRenderer);
    let headerRenderer = rawToReactElement(rawHeaderRenderer);
    let columnProps = {
      ...rawElement.elementProps,
      cellRenderer,
      headerRenderer
    };

    return React.createElement(sharedComponents[rawElement.elementType], { ...columnProps, key });
  }

  return typeof key === 'undefined' ?
    React.createElement(sharedComponents[rawElement.elementType], { ...rawElement.elementProps }) :
    React.createElement(sharedComponents[rawElement.elementType], { ...rawElement.elementProps, key });
};

export default rawToReactElement;
