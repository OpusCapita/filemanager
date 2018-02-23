import React from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import './HeaderCell.less';
import Svg from '@opuscapita/react-svg/lib/SVG';
import { SortDirection } from 'react-virtualized';

let sortASCIcon = require('@opuscapita/svg-icons/lib/arrow_drop_down.svg');
let sortDESCIcon = require('@opuscapita/svg-icons/lib/arrow_drop_up.svg');

export default () => ({
  /* eslint-disable */
  columnData,
  dataKey,
  disableSort,
  label,
  sortBy,
  sortDirection
  /* eslint-enable */
}) => {
  let sortIconSvg = sortDirection === SortDirection.ASC ? sortDESCIcon : sortASCIcon;
  let sortIconElement = dataKey === sortBy ? (
    <Svg className="oc-fm--header-cell__sort-icon" svg={sortIconSvg} />
  ) : null;

  return (
    <div className="oc-fm--header-cell">
      {label}
      {sortIconElement}
    </div>
  );
}
