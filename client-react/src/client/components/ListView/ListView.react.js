// TODO move selection functions to separate file "selection-utils.js" to reduce file size

import React, { Component, PropTypes } from 'react';
import './ListView.less';
import 'react-virtualized/styles.css';
import { Table, Column, AutoSizer, ColumnSizer, SortDirection } from 'react-virtualized';
import { NameCell, SizeCell, DateTimeCell, HeaderCell, NoRowsRenderer } from './Cells.react';
import Row from './Row.react';
import ScrollOnMouseOut from '../ScrollOnMouseOut';
import { findIndex } from 'lodash';
import clickOutside from 'react-click-outside';


const tabletWidth = 1024;
const mobileWidth = 640;

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    iconUrl: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.number,
    modifyDate: PropTypes.number
  })),
  itemsCount: PropTypes.number,
  selection: PropTypes.arrayOf(PropTypes.string),
  humanReadableSize: PropTypes.bool,
  locale: PropTypes.string,
  dateTimePattern: PropTypes.string,
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string,
  onRowClick: PropTypes.func,
  onRowRightClick: PropTypes.func,
  onRowDoubleClick: PropTypes.func,
  onScroll: PropTypes.func,
  onSelection: PropTypes.func,
  onSort: PropTypes.func,
  onKeyDown: PropTypes.func,
  onRef: PropTypes.func
};
const defaultProps = {
  items: [],
  itemsCount: 0,
  selection: [],
  humanReadableSize: true,
  locale: 'en',
  dateTimePattern: 'YYYY-MM-DD HH:mm:ss',
  sortBy: 'title',
  sortDirection: SortDirection.ASC,
  onRowClick: () => {},
  onRowRightClick: () => {},
  onRowDoubleClick: () => {},
  onScroll: () => {},
  onSelection: () => {},
  onSort: () => {},
  onKeyDown: () => {},
  onRef: () => {}
};

@clickOutside
export default
class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollToIndex: 0,
      clientHeight: 0,
      scrollTop: 0,
      scrollHeight: 0
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
    let selectionDirection = toIdIndex > fromIdIndex ? 1 : -1;
    let itemsSlice = selectionDirection === 1 ?
        this.props.items.slice(fromIdIndex, toIdIndex + 1) :
        this.props.items.slice(toIdIndex, fromIdIndex + 1);

    let selection = itemsSlice.reduce((ids, item) => ids.concat([item.id]), []);

    return selection;
  }

  handleRowClick = ({ event, index, rowData}) => {
    let { selection } = this.props;
    let { id } = rowData;
    this.lastSelected = id;

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
    let { selection, items, itemsCount, onKeyDown } = this.props;
    this.props.onKeyDown(e);

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

      let fromIdIndex = findIndex(items, (o) => o.id === this.lastSelected);


      if (fromIdIndex === 0) {
        return;
      }

      let nextIdIndex = fromIdIndex > 0 ? fromIdIndex - 1 : 0;
      let nextId = items[nextIdIndex].id;
      let selectionDirection = selection.indexOf(nextId) === -1 ? -1 : 1;

      let selectionData = selectionDirection === -1 ? this.addPrevToSelection() : this.removeLastFromSelection();
      this.lastSelected = items[selectionData.scrollToIndex].id;
      this.handleSelection(selectionData.selection);
      this.scrollToIndex(selectionData.scrollToIndex);
    }

    if (e.which === 40 && e.shiftKey) { // Down arrow holding Shift key
      e.preventDefault();

      let fromIdIndex = findIndex(items, (o) => o.id === this.lastSelected);

      if (fromIdIndex === itemsCount - 1) {
        return;
      }

      let nextIdIndex = fromIdIndex + 1 < itemsCount ? fromIdIndex + 1 : itemsCount - 1;
      let nextId = items[nextIdIndex].id;
      let selectionDirection = selection.indexOf(nextId) === -1 ? -1 : 1;

      let selectionData = selectionDirection === -1 ? this.addNextToSelection() : this.removeFirstFromSelection();
      this.lastSelected = items[selectionData.scrollToIndex].id;
      this.handleSelection(selectionData.selection);
      this.scrollToIndex(selectionData.scrollToIndex);
    }

    this.containerRef.focus(); // XXX fix for loosing focus on key navigation
  }

  handleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    this.props.onScroll({ clientHeight, scrollHeight, scrollTop });
    this.setState({ clientHeight, scrollHeight, scrollTop });
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
    let currentId = this.lastSelected;
    let currentIndex = findIndex(items, (o) => o.id === currentId);
    let nextIndex = currentIndex < itemsCount - 1 ? currentIndex + 1 : currentIndex;
    let nextId = items[nextIndex].id;
    return { selection: [nextId], scrollToIndex: nextIndex };
  }

  selectPrev = () => {
    let { selection, items, itemsCount } = this.props;
    let currentId = this.lastSelected;
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

  handleCursorAbove = (scrollTop) => {
    this.setState({ scrollTop });
  }

  handleCursorBellow = (scrollTop) => {
    this.setState({ scrollTop });
  }

  handleSort = ({ sortBy, sortDirection }) => {
    this.props.onSort({ sortBy, sortDirection });
  }

  handleRef = (ref) => {
    this.containerRef = ref;
    this.props.onRef(ref);
  }

  render() {
    let {
      items,
      itemsCount,
      humanReadableSize,
      locale,
      dateTimePattern,
      selection,
      onSelection,
      sortBy,
      sortDirection
    } = this.props;

    let {
      scrollToIndex,
      clientHeight,
      scrollHeight,
      scrollTop
    } = this.state;
    let { rangeSelectionStartedAt, lastSelected } = this;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <div
            className="oc-fm--list-view"
            onKeyDown={this.handleKeyDown}
            tabIndex="0"
            ref={this.handleRef}
          >
            <ScrollOnMouseOut
              onCursorAbove={this.handleCursorAbove}
              onCursorBellow={this.handleCursorBellow}
              clientHeight={clientHeight}
              scrollHeight={scrollHeight}
              scrollTop={scrollTop}
              topCaptureOffset={40}
              bottomCaptureOffset={0}
              style={{
                width: `${width}px`,
                height: `${height}px`
              }}
            >
              <Table
                width={width}
                height={height}
                rowCount={itemsCount}
                rowGetter={({ index }) => items[index]}
                rowHeight={48}
                headerHeight={48}
                className="oc-fm--list-view__table"
                gridClassName="oc-fm--list-view__grid"
                overscanRowCount={4}
                onScroll={this.handleScroll}
                scrollToIndex={scrollToIndex}
                scrollTop={scrollTop}
                sort={this.handleSort}
                sortBy={sortBy}
                sortDirection={sortDirection}
                rowRenderer={Row({ selection, lastSelected })}
                noRowsRenderer={NoRowsRenderer()}
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
                  label='File size'
                  dataKey='size'
                  flexGrow={width > tabletWidth ? 1 : 0}
                  cellRenderer={SizeCell({ humanReadableSize })}
                  headerRenderer={HeaderCell()}
                />
                {width > mobileWidth ? (
                  <Column
                    width={100}
                    label='Last modified'
                    dataKey='modifyDate'
                    flexGrow={1}
                    cellRenderer={DateTimeCell({ locale, dateTimePattern })}
                    headerRenderer={HeaderCell()}
                    />
                ) : null}
              </Table>
            </ScrollOnMouseOut>
          </div>
        )}
      </AutoSizer>
    );
  }
}

ListView.propTypes = propTypes;
ListView.defaultProps = defaultProps;
