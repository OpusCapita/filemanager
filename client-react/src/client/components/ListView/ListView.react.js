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

const SizeCell = ({ humanReadableSize }) => {
  return ({ cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }) => {
    let formattedSize = humanReadableSize ? filesize(cellData) : cellData;
    return (
      <div className="oc-fm--list-view__cell">
        {formattedSize}
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

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
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
            className="oc-fm--list-view"
            gridClassName="oc-fm--list-view__grid"
            rowClassName="oc-fm--list-view__row"
          >
            <Column
              label='Icon'
              dataKey='iconUrl'
              width={48}
              cellRenderer={IconCell()}
            />
            <Column
              label='Title'
              dataKey='title'
              width={200}
              flexGrow={1}
              cellRenderer={TitleCell()}
            />
            <Column
              width={100}
              label='Size'
              dataKey='size'
              flexGrow={1}
              cellRenderer={SizeCell({ humanReadableSize })}
            />
            <Column
              width={100}
              label='Last modified'
              dataKey='lastModified'
              flexGrow={1}
              cellRenderer={DateTimeCell({ locale, dateTimePattern })}
            />
          </Table>
        )}
      </AutoSizer>
    );
  }
}

ListView.propTypes = propTypes;
ListView.defaultProps = defaultProps;
