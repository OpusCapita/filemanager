import React from 'react';
import './HeaderCell.less';
import Svg from '@opuscapita/react-svg/lib/SVG';
import { SortDirection } from 'react-virtualized';

const sortASCIcon = require('@opuscapita/svg-icons/lib/arrow_drop_down.svg');
const sortDESCIcon = require('@opuscapita/svg-icons/lib/arrow_drop_up.svg');

export default () => ({
  /* eslint-disable react/prop-types */
  columnData,
  dataKey,
  disableSort,
  label,
  sortBy,
  sortDirection
  /* eslint-enable react/prop-types */
}) => {
  const sortIconSvg = sortDirection === SortDirection.ASC ? sortDESCIcon : sortASCIcon;
  const sortIconElement = dataKey === sortBy ? (
    <Svg className="oc-fm--header-cell__sort-icon" svg={sortIconSvg} />
  ) : null;

  return (
    <div className="oc-fm--header-cell">
      {label}
      {sortIconElement}
    </div>
  );
}
