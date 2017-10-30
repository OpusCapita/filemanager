import React, { Component, PropTypes } from 'react';
import './Cell.less';
import LoadingCell from '../LoadingCell';

export default (viewLayoutOptions) => (cellProps) => {
  if (viewLayoutOptions.loading) {
    return (<LoadingCell />);
  }

  return (
    <div className="oc-fm--cell">
      {viewLayoutOptions.getData(viewLayoutOptions, cellProps)}
    </div>
  );
}
