import moment from 'moment';
import filesize from 'filesize';
import SVG from '@opuscapita/react-svg/lib/SVG';
import { SortDirection } from 'react-virtualized';
import { getIcon } from './icons';

let nothingToShowIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/add_to_photos.svg');
let sortASCIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/arrow_drop_down.svg');
let sortDESCIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/arrow_drop_up.svg');

export const NameCell = () => ({ cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }) => {
  let { svg, fill } = getIcon(rowData);
  return (
    <div  className="oc-fm--list-view__cell oc-fm--list-view__name-cell">
      <div className="oc-fm--list-view__name-cell-icon">
        <SVG
          className="oc-fm--list-view__name-cell-icon-image"
          svg={svg}
          style={{ fill }}
        />
      </div>
      <div
        className="oc-fm--list-view__cell oc-fm--list-view__name-cell-title"
        title={cellData || ''}
      >
        {cellData || ''}
      </div>
    </div>
  );
};

export const SizeCell = ({ humanReadableSize, isDirectory }) => {
  return ({ cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }) => {
    let formattedSize = (typeof cellData !== 'undefined' && humanReadableSize) ?
      filesize(cellData) :
      (cellData || '');

    return (
      <div className="oc-fm--list-view__cell">
        {formattedSize || '—'}
      </div>
    );
  };
};

export const DateTimeCell = ({ locale, dateTimePattern }) => {
  return ({ cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }) => {
    let formattedDateTime = cellData ?
      moment(new Date().setTime(cellData)).locale(locale).format(dateTimePattern) :
      '';

    return (
      <div className="oc-fm--list-view__cell">
        {formattedDateTime}
      </div>
    );
  };
};

export const HeaderCell = () => ({ columnData, dataKey, disableSort, label, sortBy, sortDirection })  => {
  let sortIconSvg = sortDirection === SortDirection.ASC ? sortASCIcon : sortDESCIcon;
  let sortIconElement = dataKey === sortBy ? (
    <SVG svg={sortIconSvg} />
  ) : null;

  return (
    <div className="oc-fm--list-view__header-cell">
      {label}
      {sortIconElement}
    </div>
  );
};

export const NoRowsRenderer = () => () => (
  <div className="oc-fm--list-view__no-rows">
    <SVG
      className="oc-fm--list-view__no-rows-icon"
      svg={nothingToShowIcon}
    />
    <div className="oc-fm--list-view__no-rows-title">
      Nothing to show
    </div>
    <div className="oc-fm--list-view__no-rows-sub-title">
      Drop files here or use "New" button
    </div>
  </div>
);
