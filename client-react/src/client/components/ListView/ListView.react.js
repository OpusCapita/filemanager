import React, { Component, PropTypes } from 'react';
import './ListView.less';
import 'react-virtualized/styles.css';
import { Table, Column, AutoSizer, SortDirection } from 'react-virtualized';
import filesize from 'filesize';
import moment from 'moment';

const IconCell = () => ({ cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }) => {
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

const TitleCell = () => ({ cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }) => {
  return (
    <div
      className="oc-fm--list-view__cell oc-fm--list-view__cell--title"
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

const Row = ({ selection }) => ({
  // Copied from https://github.com/bvaughn/react-virtualized/blob/04d1221133a1c59be24c8af90ae09e46000372b5/source/Table/defaultRowRenderer.js#L1
  className,
  columns,
  index,
  key,
  onRowClick,
  onRowDoubleClick,
  onRowMouseOut,
  onRowMouseOver,
  onRowRightClick,
  rowData,
  style
}) => {
  const a11yProps = {};

  if (
    onRowClick ||
      onRowDoubleClick ||
      onRowMouseOut ||
      onRowMouseOver ||
      onRowRightClick
  ) {
    a11yProps['aria-label'] = 'row';
    a11yProps.tabIndex = 0;

    if (onRowClick) {
      a11yProps.onClick = event => onRowClick({event, index, rowData});
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = event =>
        onRowDoubleClick({event, index, rowData});
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = event => onRowMouseOut({event, index, rowData});
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = event => onRowMouseOver({event, index, rowData});
    }
    if (onRowRightClick) {
      a11yProps.onContextMenu = event =>
        onRowRightClick({event, index, rowData});
    }
  }

  let isSelected = selection.indexOf(rowData.id) !== -1;

  return (
    <div
      {...a11yProps}
      className={`
        ReactVirtualized__Table__row
        oc-fm--list-view__row
        ${isSelected ? 'oc-fm--list-view__row--selected' : ''}
      `}
      key={key}
      role="row"
      style={style}>
      {columns}
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
  selection: PropTypes.arrayOf(PropTypes.string),
  humanReadableSize: PropTypes.bool,
  locale: PropTypes.string,
  dateTimePattern: PropTypes.string,
  onRowClick: PropTypes.func,
  onRowRightClick: PropTypes.func,
  onRowDoubleClick: PropTypes.func,
  onSelection: PropTypes.func,
};
const defaultProps = {
  items: [],
  selection: [],
  humanReadableSize: true,
  locale: 'en',
  dateTimePattern: 'YYYY-MM-dd HH:mm:ss',
  onRowClick: () => {},
  onRowRightClick: () => {},
  onRowDoubleClick: () => {},
  onSelection: () => {}
};

export default
class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSelection(ids) {
    this.props.onSelection(ids);
  }

  addToSelection(id) {
    let index = this.props.selection.indexOf(id);
    return index === -1 ? this.props.selection.concat([id]) : this.props.selection;
  }

  removeFromSelection(id) {
    let index = this.props.selection.indexOf(id);
    return index === -1 ?
      this.props.selection :
      [].
        concat(this.props.selection.slice(0, index)).
        concat(this.props.selection.slice(index + 1, this.props.selection.length));
  }

  handleRowClick = ({ event, index, rowData}) => {
    let { selection } = this.props;
    let { id } = rowData;

    if (event.ctrlKey || event.metaKey) { // metaKey is for handling "Command" key on MacOS
      this.props.selection.indexOf(rowData.id) !== -1 ?
        this.handleSelection(this.removeFromSelection(id)) :
        this.handleSelection(this.addToSelection(id));
    } else {
      this.handleSelection([rowData.id]);
    };

    this.props.onRowClick({ event, index, rowData });
  }

  handleRowRightClick = ({ event, index, rowData}) => {
    this.props.onRowRightClick({ event, index, rowData });
  }

  handleRowDoubleClick = ({ event, index, rowData }) => {
    this.props.onRowDoubleClick({ event, index, rowData });
  }

  handleKeyDown() {

  }

  render() {
    let {
      items,
      humanReadableSize,
      locale,
      dateTimePattern,
      selection,
      onSelection
    } = this.props;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <Table
            width={width}
            height={height}
            rowCount={items.length}
            rowGetter={({ index }) => items[index]}
            rowHeight={48}
            headerHeight={36}
            className="oc-fm--list-view"
            gridClassName="oc-fm--list-view__grid"
            rowRenderer={Row({ selection })}
            onRowClick={this.handleRowClick}
            onRowRightClick={this.handleRowRightClick}
            onRowDoubleClick={this.handleRowDoubleClick}
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
