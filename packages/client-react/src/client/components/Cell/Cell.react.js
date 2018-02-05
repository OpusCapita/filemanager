import React from 'react';
import './Cell.less';
import LoadingCell from '../LoadingCell';

export default (viewLayoutOptions) => (cellProps) => {
  if (viewLayoutOptions.loading) {
    return (<LoadingCell />);
  }

  let data = viewLayoutOptions.getData ?
    viewLayoutOptions.getData(viewLayoutOptions, cellProps) :
    cellProps.cellData;

  return (
    <div className="oc-fm--cell">
      {data}
    </div>
  );
}
