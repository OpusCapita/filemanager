import React, { Component, PropTypes } from 'react';
import './NameCell.less';
import LoadingCell from '../LoadingCell';

export default ({ loading, getIcon }) => (cellProps) => {
  if (loading) {
    return (<LoadingCell />);
  }

  let { svg, fill } = getIcon(cellProps.rowData);

  return (
    <div  className="oc-fm--name-cell">
      <div className="oc-fm--name-cell__icon">
        <SVG
          className="oc-fm--name-cell__icon-image"
          svg={svg}
          style={{ fill }}
        />
      </div>
      <div
        className="oc-fm--name-cell__title"
        title={cellProps.cellData || ''}
      >
        {cellProps.cellData || ''}
      </div>
    </div>
  );
}
