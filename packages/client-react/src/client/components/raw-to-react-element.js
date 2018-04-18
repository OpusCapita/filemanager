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

  return React.createElement(sharedComponents[rawElement.elementType], {
    ...rawElement.elementProps,
    ...(typeof key !== 'undefined' && { key }),
    ...(rawElement.elementType === 'Column' && {
      cellRenderer: rawToReactElement(rawElement.elementProps.cellRenderer),
      headerRenderer: rawToReactElement(rawElement.elementProps.headerRenderer)
    })
  });
};

export default rawToReactElement;
