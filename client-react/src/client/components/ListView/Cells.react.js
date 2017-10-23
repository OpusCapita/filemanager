import moment from 'moment';
import filesize from 'filesize';

export const IconCell = () => ({ cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }) => {
  return (
    <div className="oc-fm--list-view__icon-cell">
      <div
        className="oc-fm--list-view__icon-cell-image"
        style={{
          backgroundImage: `url(${cellData})`
        }}
      >
      </div>
    </div>
  );
};

export const TitleCell = () => ({ cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }) => {
  return (
    <div
      className="oc-fm--list-view__cell oc-fm--list-view__cell--title"
      title={cellData}
    >
      {cellData}
    </div>
  );
};

export const SizeCell = ({ humanReadableSize, isDirectory }) => {
  return ({ cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }) => {
    let formattedSize = (typeof cellData !== 'undefined' && humanReadableSize) ? filesize(cellData) : cellData;
    return (
      <div className="oc-fm--list-view__cell">
        {formattedSize || '—'}
      </div>
    );
  };
};

export const DateTimeCell = ({ locale, dateTimePattern }) => {
  return ({ cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }) => {
    let formattedDateTime = moment().locale(locale).format(dateTimePattern);
    return (
      <div className="oc-fm--list-view__cell">
        {formattedDateTime}
      </div>
    );
  };
};

export const HeaderCell = () => ({ columnData, dataKey, disableSort, label, sortBy, sortDirection })  => {
  return (
    <div className="oc-fm--list-view__header-cell">
      {label}
    </div>
  );
};
