import React, { Component, PropTypes } from 'react';
import './ListView.less';
import 'react-virtualized/styles.css';
import { Table, Column, AutoSizer, SortDirection } from 'react-virtualized';
import filesize from 'filesize';
import moment from 'moment';

const IconCell = () => ({ cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }) => {
  return (
    <div
      className="oc-fm--list-view__icon-cell"
      style={{
        backgroundImage: `url(${cellData})`
      }}
    >
    </div>
  );
};

const TitleCell = () => ({ cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }) => {
  return (
    <div
      className="oc-fm--list-view__cell"
      title={cellData}
    >
      {cellData}
    </div>
  );
};

const SizeCell = ({ humanReadableSize, isDirectory }) => {
  return ({ cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }) => {
    let formattedSize = (typeof cellData !== 'undefined' && humanReadableSize) ? filesize(cellData) : cellData;
    return (
      <div className="oc-fm--list-view__cell">
        {formattedSize || '—'}
      </div>
    );
  };
};

const DateTimeCell = ({ locale, dateTimePattern }) => {
  return ({ cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }) => {
    let formattedDateTime = moment().locale(locale).format(dateTimePattern);
    return (
      <div className="oc-fm--list-view__cell">
        {formattedDateTime}
      </div>
    );
  };
};

const HeaderCell = () => ({ columnData, dataKey, disableSort, label, sortBy, sortDirection })  => {
  return (
    <div className="oc-fm--list-view__header-cell">
      {label}
    </div>
  );
};

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    isDirectory: PropTypes.bool,
    iconUrl: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.string,
    lastModified: PropTypes.string
  })),
  humanReadableSize: PropTypes.bool,
  locale: PropTypes.string,
  dateTimePattern: PropTypes.string
};
const defaultProps = {
  items: [],
  humanReadableSize: true,
  locale: 'en',
  dateTimePattern: 'YYYY-MM-dd HH:mm:ss'
};

export default
class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    let {
      items,
      humanReadableSize,
      locale,
      dateTimePattern
    } = this.props;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <Table
            width={width}
            height={height}
            rowCount={items.length}
            rowGetter={({ index }) => items[index]}
            rowHeight={40}
            headerHeight={40}
            className="oc-fm--list-view"
            gridClassName="oc-fm--list-view__grid"
            rowClassName="oc-fm--list-view__row"
          >
            <Column
              label='Icon'
              dataKey='iconUrl'
              width={48}
              cellRenderer={IconCell()}
              headerRenderer={HeaderCell()}
            />
            <Column
              label='Title'
              dataKey='title'
              width={200}
              flexGrow={1}
              cellRenderer={TitleCell()}
              headerRenderer={HeaderCell()}
            />
            <Column
              width={100}
              label='Size'
              dataKey='size'
              flexGrow={1}
              cellRenderer={SizeCell({ humanReadableSize })}
              headerRenderer={HeaderCell()}
            />
            <Column
              width={100}
              label='Last modified'
              dataKey='lastModified'
              flexGrow={1}
              cellRenderer={DateTimeCell({ locale, dateTimePattern })}
              headerRenderer={HeaderCell()}
            />
          </Table>
        )}
      </AutoSizer>
    );
  }
}

ListView.propTypes = propTypes;
ListView.defaultProps = defaultProps;
