import React, { Component, PropTypes } from 'react';
import './ListView.less';
import 'react-virtualized/styles.css';
import { Table, Column, AutoSizer, ColumnSizer, SortDirection } from 'react-virtualized';
import { NameCell, SizeCell, DateTimeCell, HeaderCell } from './Cells.react';
import Row from './Row.react';
import { findIndex } from 'lodash';
const clickOutside = require('react-click-outside');

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    isDirectory: PropTypes.bool,
    iconUrl: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.string,
    lastModified: PropTypes.string
  })),
  itemsCount: PropTypes.number,
  selection: PropTypes.arrayOf(PropTypes.string),
  humanReadableSize: PropTypes.bool,
  locale: PropTypes.string,
  dateTimePattern: PropTypes.string,
  onRowClick: PropTypes.func,
  onRowRightClick: PropTypes.func,
  onRowDoubleClick: PropTypes.func,
  onSelection: PropTypes.func,
  onSort: PropTypes.func
};
const defaultProps = {
  items: [],
  itemsCount: 0,
  selection: [],
  humanReadableSize: true,
  locale: 'en',
  dateTimePattern: 'YYYY-MM-dd HH:mm:ss',
  onRowClick: () => {},
  onRowRightClick: () => {},
  onRowDoubleClick: () => {},
  onSelection: () => {},
  onSort: () => {},
  sortBy: 'title',
  sortDirection: SortDirection.ASC
};

@clickOutside
export default
class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollToIndex: 0
    };

    this.rangeSelectionStartedAt = null;
    this.lastSelected = null;
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

  selectRange(fromId, toId) {
    let fromIdIndex = findIndex(this.props.items, (o) => o.id === fromId);
    let toIdIndex = findIndex(this.props.items, (o) => o.id === toId);
    let selectionOrder = toIdIndex > fromIdIndex ? 1 : -1;
    let itemsSlice = selectionOrder === 1 ?
      this.props.items.slice(fromIdIndex, toIdIndex + 1) :
      this.props.items.slice(toIdIndex, fromIdIndex + 1);

    let selection = itemsSlice.reduce((ids, item) => ids.concat([item.id]), []);

    return selection;
  }

  handleRowClick = ({ event, index, rowData}) => {
    let { selection } = this.props;
    let { id } = rowData;
    this.lastSelected = null;

    if (event.ctrlKey || event.metaKey) { // metaKey is for handling "Command" key on MacOS
      this.rangeSelectionStartedAt = id;
      this.props.selection.indexOf(rowData.id) !== -1 ?
        this.handleSelection(this.removeFromSelection(id)) :
        this.handleSelection(this.addToSelection(id));
    } else if (event.shiftKey) {
      this.rangeSelectionStartedAt = this.rangeSelectionStartedAt || (selection.length === 1 && selection[0]);
      this.handleSelection(this.selectRange(this.rangeSelectionStartedAt, id));
    } else {
      this.rangeSelectionStartedAt = null;
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

  handleKeyDown =(e) => {
    let { selection, items } = this.props;

    if (e.which === 38 && !e.shiftKey) { // Up arrow
      e.preventDefault();

      if (!selection.length) {
        let selectionData = this.selectFirstItem();
        this.lastSelected = items[selectionData.scrollToIndex].id;
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
      } else {
        let selectionData = this.selectPrev();
        this.lastSelected = items[selectionData.scrollToIndex].id;
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
      }
    }

    if (e.which === 40 && !e.shiftKey) { // Down arrow
      e.preventDefault();

      if (!selection.length) {
        let selectionData = this.selectFirstItem();
        this.lastSelected = items[selectionData.scrollToIndex].id;
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
      } else {
        let selectionData = this.selectNext();
        this.lastSelected = items[selectionData.scrollToIndex].id;
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
      }
    }

    if (e.which === 38 && e.shiftKey) { // Up arrow holding Shift key
      e.preventDefault();
      let selectionData = this.addPrevToSelection();
      this.lastSelected = items[selectionData.scrollToIndex].id;
      this.handleSelection(selectionData.selection);
      this.scrollToIndex(selectionData.scrollToIndex);
    }

    if (e.which === 40 && e.shiftKey) { // Down arrow holding Shift key
      e.preventDefault();
      let selectionData = this.addNextToSelection();
      this.lastSelected = items[selectionData.scrollToIndex].id;
      this.handleSelection(selectionData.selection);
      this.scrollToIndex(selectionData.scrollToIndex);
    }

    this.containerRef.focus(); // XXX fix for loosing focus on key navigation
  }

  handleScroll = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleClickOutside = () => {
    let selectionData = this.clearSelection();
    this.handleSelection(selectionData.selection);
    this.scrollToIndex(selectionData.scrollToIndex);
  }

  selectFirstItem = () => {
    return {
      selection: this.props.items.length ? this.props.items[0].id : [],
      scrollToIndex: 0
    };
  }

  clearSelection = () => {
    return { selection: [], scrollToIndex: this.state.scrollToIndex };
  }

  selectNext = () => {
    let { selection, items, itemsCount } = this.props;
    let currentId = selection[selection.length - 1];
    let currentIndex = findIndex(items, (o) => o.id === currentId);
    let nextIndex = currentIndex < itemsCount - 1 ? currentIndex + 1 : currentIndex;
    let nextId = items[nextIndex].id;
    return { selection: [nextId], scrollToIndex: nextIndex };
  }

  selectPrev = () => {
    let { selection, items, itemsCount } = this.props;
    let currentId = selection[0];
    let currentIndex = findIndex(items, (o) => o.id === currentId);
    let prevIndex = currentIndex === 0 ? currentIndex : currentIndex - 1;
    let prevId = items[prevIndex].id;
    return { selection: [prevId], scrollToIndex: prevIndex };
  }

  addNextToSelection = () => {
    let { selection } = this.props;
    let nextSelectionData = this.selectNext();
    return {
      selection: selection.concat(nextSelectionData.selection),
      scrollToIndex: nextSelectionData.scrollToIndex
    };
  }

  addPrevToSelection = () => {
    let { selection } = this.props;
    let prevSelectionData = this.selectPrev();
    return {
      selection: prevSelectionData.selection.concat(selection),
      scrollToIndex: prevSelectionData.scrollToIndex
    };
  }

  removeLastFromSelection = () => {
    let { selection, items } = this.props;

    if (selection.length > 1) {
      let nextSelection = selection.slice(0, selection.length - 1);
      return {
        selection: nextSelection,
        scrollToIndex: findIndex(items, (o) => o.id === nextSelection[nextSelection.length - 1])
      };
    } else {
      return {
        selection,
        scrollToIndex: findIndex(items, (o) => o.id === selection[0])
      };
    }
  }

  removeFirstFromSelection = () => {
    let { selection, items } = this.props;

    if (selection.length > 1) {
      let nextSelection = selection.slice(1, selection.length);
      return {
        selection: nextSelection,
        scrollToIndex: findIndex(items, (o) => o.id === nextSelection[0])
      };
    } else {
      return {
        selection,
        scrollToIndex: findIndex(items, (o) => o.id === selection[0])
      };
    }
  }

  scrollToIndex = (index) => {
    this.setState({ scrollToIndex: index });
  }

  handleSort = ({ sortBy, sortDirection }) => {
    this.props.onSort({ sortBy, sortDirection });
  }

  render() {
    let {
      items,
      humanReadableSize,
      locale,
      dateTimePattern,
      selection,
      onSelection,
      sortBy,
      sortDirection
    } = this.props;

    let { scrollToIndex } = this.state;
    let { rangeSelectionStartedAt, lastSelected } = this;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <div
            className="oc-fm--list-view"
            onKeyDown={this.handleKeyDown}
            onScroll={this.handleScroll}
            tabIndex="0"
            ref={ref => (this.containerRef = ref)}
          >
            <Table
              width={width}
              height={height}
              rowCount={items.length}
              rowGetter={({ index }) => items[index]}
              rowHeight={48}
              headerHeight={48}
              className="oc-fm--list-view__table"
              gridClassName="oc-fm--list-view__grid"
              overscanRowCount={4}
              scrollToIndex={scrollToIndex}
              sort={this.handleSort}
              sortBy={sortBy}
              sortDirection={sortDirection}
              rowRenderer={Row({ selection, lastSelected })}
              onRowClick={this.handleRowClick}
              onRowRightClick={this.handleRowRightClick}
              onRowDoubleClick={this.handleRowDoubleClick}
            >
              <Column
                label='Name'
                dataKey='title'
                width={48}
                flexGrow={1}
                cellRenderer={NameCell()}
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
          </div>
        )}
      </AutoSizer>
    );
  }
}

ListView.propTypes = propTypes;
ListView.defaultProps = defaultProps;
