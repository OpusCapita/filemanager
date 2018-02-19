import React from 'react';
import './NameCell.less';
import Svg from '@opuscapita/react-svg/lib/SVG';
import LoadingCell from '../LoadingCell';

export default ({ loading, getIcon }) => (cellProps) => {
  if (loading) {
    return (<LoadingCell />);
  }

  let { svg, fill } = getIcon(cellProps.rowData);

  return (
    <div className="oc-fm--name-cell">
      <div className="oc-fm--name-cell__icon">
        <Svg
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
