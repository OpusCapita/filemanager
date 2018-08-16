import React from 'react';
import sharedComponents from './shared-components';

/*
   arguments: <ReactElement> or <{ elementType: <string>, elementProps: <object>, callArguments: <array>}>
   return: <ReactElement>
*/
const rawToReactElement = (rawElement, key) => {
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
    const rawCellRenderer = rawElement.elementProps.cellRenderer;
    const rawHeaderRenderer = rawElement.elementProps.headerRenderer;

    const cellRenderer = rawToReactElement(rawCellRenderer);
    const headerRenderer = rawToReactElement(rawHeaderRenderer);
    const columnProps = {
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
