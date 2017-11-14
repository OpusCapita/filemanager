import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './HeaderCell.less';
import SVG from '@opuscapita/react-svg/lib/SVG';
import { SortDirection } from 'react-virtualized';

let sortASCIcon = require('@opuscapita/svg-icons/lib/arrow_drop_down.svg');
let sortDESCIcon = require('@opuscapita/svg-icons/lib/arrow_drop_up.svg');

export default () => ({
  columnData,
  dataKey,
  disableSort,
  label,
  sortBy,
  sortDirection
}) => {
  let sortIconSvg = sortDirection === SortDirection.ASC ? sortASCIcon : sortDESCIcon;
  let sortIconElement = dataKey === sortBy ? (
    <SVG className="oc-fm--header-cell__sort-icon" svg={sortIconSvg} />
  ) : null;

  return (
    <div className="oc-fm--header-cell">
      {label}
      {sortIconElement}
    </div>
  );
}
