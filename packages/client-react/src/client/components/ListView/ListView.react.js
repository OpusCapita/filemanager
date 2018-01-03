import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './ListView.less';
import 'react-virtualized/styles.css';
// TBD individual imports from 'react-virtualized' to decrease bundle size?
// ex. import Table from 'react-virtualized/dist/commonjs/Table'
import { Table, AutoSizer, ColumnSizer, SortDirection } from 'react-virtualized';
import { ContextMenuTrigger } from "react-contextmenu";
import NoFilesFoundStub from '../NoFilesFoundStub';
import Row from './Row.react';
import ScrollOnMouseOut from '../ScrollOnMouseOut';
import { findIndex, range } from 'lodash';
import nanoid from 'nanoid';
import detectIt from 'detect-it';
import rawToReactElement from '../raw-to-react-element';

import {
  addToSelection,
  removeFromSelection,
  selectRange,
  selectPrev,
  selectNext,
  selectFirstItem,
  selectLastItem,
  addPrevToSelection,
  addNextToSelection,
  removeLastFromSelection,
  removeFirstFromSelection
} from './utils';

const SCROLL_STRENGTH = 80;
const ROW_HEIGHT = 38;
const HEADER_HEIGHT = 38;
const HAS_TOUCH = detectIt.deviceType === 'hasTouch';

const propTypes = {
  rowContextMenuId: PropTypes.string,
  filesViewContextMenuId: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.number,
    modifyDate: PropTypes.number
  })),
  layout: PropTypes.func,
  layoutOptions: PropTypes.object,
  loading: PropTypes.bool,
  selection: PropTypes.arrayOf(PropTypes.string),
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
  rowContextMenuId: nanoid(),
  filesViewContextMenuId: nanoid(),
  items: [],
  layout: () => [],
  layoutOptions: {},
  loading: false,
  selection: [],
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.selection.length === 1) {
      // When FileNavigator navigates to parent dir, this last selected should be rigth
      this.lastSelected = nextProps.selection[0];
    }

    if (this.props.loading !== nextProps.loading) {
      // Force recalculate scrollHeight for appropriate handle "PageUp, PageDown, Home, End", etc. keys
      this.setState({ scrollHeight: nextProps.items.length * ROW_HEIGHT });
    }
  }

  handleSelection(ids) {
    this.props.onSelection(ids);
  }

  handleRowClick = ({ event, index, rowData }) => {
    let { selection, items } = this.props;
    let { id } = rowData;
    this.lastSelected = id;

    if (event.ctrlKey || event.metaKey) { // metaKey is for handling "Command" key on MacOS
      this.rangeSelectionStartedAt = id;

      this.handleSelection(selection.indexOf(id) !== -1 ?
        removeFromSelection({ selection, id }) :
        addToSelection({ selection, id })
      );
    } else if (event.shiftKey) {
      this.rangeSelectionStartedAt = this.rangeSelectionStartedAt || (selection.length === 1 && selection[0]);
      this.handleSelection(selectRange({
        items,
        fromId: this.rangeSelectionStartedAt,
        toId: id
      }));
    } else {
      this.rangeSelectionStartedAt = null;
      this.handleSelection([id]);
    }

    this.props.onRowClick({ event, index, rowData });
  }

  handleRowRightClick = ({ event, index, rowData }) => {
    if (this.props.selection.indexOf(rowData.id) === -1) {
      this.handleSelection([rowData.id]);
    }

    this.props.onRowRightClick({ event, index, rowData });
  }

  handleRowDoubleClick = ({ event, index, rowData }) => {
    this.props.onRowDoubleClick({ event, index, rowData });
  }

  handleKeyDown = e => {
    e.preventDefault();

    // Debounce frequent events for performance reasons
    let keyDownTime = new Date().getTime();
    if (this.lastKeyDownTime && (keyDownTime - this.lastKeyDownTime < 64)) {
      return;
    }
    this.lastKeyDownTime = keyDownTime;

    let { selection, items, onKeyDown } = this.props;

    onKeyDown(e);

    if (e.which === 38 && !e.shiftKey) { // Up arrow
      if (!items.length) {
        return;
      }

      if (!selection.length) {
        let selectionData = selectLastItem({ items });
        this.lastSelected = items[selectionData.scrollToIndex].id;
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
      } else {
        let selectionData = selectPrev({ items, lastSelected: this.lastSelected });
        this.lastSelected = items[selectionData.scrollToIndex].id;
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
      }
    }

    if (e.which === 40 && !e.shiftKey) { // Down arrow
      if (!items.length) {
        return;
      }

      if (!selection.length) {
        let selectionData = selectFirstItem({ items });
        this.lastSelected = items[selectionData.scrollToIndex].id;
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
      } else {
        let selectionData = selectNext({ items, lastSelected: this.lastSelected });
        this.lastSelected = items[selectionData.scrollToIndex].id;
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
      }
    }

    if (e.which === 38 && e.shiftKey) { // Up arrow holding Shift key
      if (!items.length) {
        return;
      }

      if (!selection.length) {
        let selectionData = selectLastItem({ items });
        this.lastSelected = items[selectionData.scrollToIndex].id;
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
        return;
      }

      let fromIdIndex = findIndex(items, ({ id }) => id === this.lastSelected);
      let nextIdIndex = fromIdIndex > 0 ? fromIdIndex - 1 : 0;
      let nextId = items[nextIdIndex].id;
      let selectionDirection = selection.indexOf(nextId) === -1 ? -1 : 1;

      if (this.lastSelected === items[0].id) {
        return
      }

      let selectionData = selectionDirection === -1 ?
        addPrevToSelection({ selection, items, lastSelected: this.lastSelected }) :
        removeLastFromSelection({ selection, items });

      this.lastSelected = items[selectionData.scrollToIndex].id;
      this.handleSelection(selectionData.selection);
      this.scrollToIndex(selectionData.scrollToIndex);
    }

    if (e.which === 40 && e.shiftKey) { // Down arrow holding Shift key
      if (!items.length) {
        return;
      }

      if (!selection.length) {
        let selectionData = selectFirstItem({ items });
        this.lastSelected = items[selectionData.scrollToIndex].id;
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
        return;
      }

      let fromIdIndex = findIndex(items, ({ id }) => id === this.lastSelected);
      let nextIdIndex = fromIdIndex + 1 < items.length ? fromIdIndex + 1 : items.length - 1;
      let nextId = items[nextIdIndex].id;
      let selectionDirection = selection.indexOf(nextId) === -1 ? -1 : 1;

      if (this.lastSelected === items[items.length - 1].id) {
        return
      }

      let selectionData = selectionDirection === -1 ?
        addNextToSelection({ selection, items, lastSelected: this.lastSelected }) :
        removeFirstFromSelection({ selection, items });

      this.lastSelected = items[selectionData.scrollToIndex].id;
      this.handleSelection(selectionData.selection);
      this.scrollToIndex(selectionData.scrollToIndex);
    }

    if (e.which === 65 && (e.ctrlKey || e.metaKey)) { // Ctrl + A or Command + A
      // Select all
      let { items } = this.props;
      let allIds = items.map((o) => o.id);
      this.handleSelection(allIds);
    }

    if (e.which === 27) { // Esc
      // Clear selection
      this.handleSelection([]);
    }


    if (e.which === 33) { // PageUp
      // Scroll top
      let { clientHeight, scrollHeight, scrollTop } = this.state;
      let newScrollTop = scrollTop - SCROLL_STRENGTH < 0 ? 0 : scrollTop - SCROLL_STRENGTH;

      this.setState({ scrollTop: newScrollTop });
    }

    if (e.which === 34) { // PageDown
      // Scroll bottom
      let { clientHeight, scrollHeight, scrollTop } = this.state;
      let newScrollTop = scrollTop + SCROLL_STRENGTH > scrollHeight - clientHeight ?
        scrollHeight - clientHeight :
        scrollTop + SCROLL_STRENGTH;

      this.setState({ scrollTop: newScrollTop });
    }

    if (e.which === 36) { // Home
      // Scroll to first item
      let { items } = this.props;
      let { clientHeight, scrollHeight, scrollTop } = this.state;
      let newScrollTop = 0;
      this.setState({ scrollTop: newScrollTop });
    }

    if (e.which === 35) { // End
      // Scroll to first item
      let { items } = this.props;
      let { clientHeight, scrollHeight, scrollTop } = this.state;
      let newScrollTop = scrollHeight - clientHeight;
      this.setState({ scrollTop: newScrollTop });
    }

    this.containerRef.focus(); // XXX fix for loosing focus on key navigation
  }

  handleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    this.props.onScroll({ clientHeight, scrollHeight, scrollTop });
    this.setState({ clientHeight, scrollHeight, scrollTop });
  }

  clearSelection = () => ({
    selection: [],
    scrollToIndex: this.state.scrollToIndex
  });

  scrollToIndex = index => {
    this.setState({ scrollToIndex: index });
  }

  handleCursorAbove = scrollTop => {
    this.setState({ scrollTop });
  }

  handleCursorBellow = scrollTop => {
    this.setState({ scrollTop });
  }

  handleSort = ({ sortBy, sortDirection }) => {
    this.props.onSort({ sortBy, sortDirection });
  }

  handleRef = ref => {
    this.containerRef = ref;
    this.props.onRef(ref);
  }

  render() {
    const {
      rowContextMenuId,
      filesViewContextMenuId,
      items,
      layout,
      layoutOptions,
      loading,
      selection,
      onSelection,
      sortBy,
      sortDirection
    } = this.props;

    const {
      scrollToIndex,
      clientHeight,
      scrollHeight,
      scrollTop
    } = this.state;
    const { rangeSelectionStartedAt, lastSelected } = this;

    let itemsToRender = null;
    if (loading && this.containerHeight) {
      // Generate items for "loading placeholder"
      const itemsCount = Math.floor(this.containerHeight / ROW_HEIGHT - 1);
      itemsToRender = range(itemsCount).map((o) => ({}));
    } else {
      itemsToRender = items;
    };

    return (
      <AutoSizer>
        {({ width, height }) => (this.containerHeight = height) && (
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
              <ContextMenuTrigger id={filesViewContextMenuId} holdToDisplay={HAS_TOUCH ? 1000 : -1}>
                <Table
                  width={width}
                  height={height}
                  rowCount={itemsToRender.length}
                  rowGetter={({ index }) => itemsToRender[index]}
                  rowHeight={ROW_HEIGHT}
                  headerHeight={HEADER_HEIGHT}
                  className="oc-fm--list-view__table"
                  gridClassName="oc-fm--list-view__grid"
                  overscanRowCount={10}
                  onScroll={this.handleScroll}
                  scrollToIndex={scrollToIndex}
                  scrollTop={scrollTop}
                  sort={this.handleSort}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  rowRenderer={Row({
                    selection, lastSelected, loading, contextMenuId: rowContextMenuId, hasTouch: HAS_TOUCH
                  })}
                  noRowsRenderer={NoFilesFoundStub}
                  onRowClick={this.handleRowClick}
                  onRowRightClick={this.handleRowRightClick}
                  onRowDoubleClick={this.handleRowDoubleClick}
                >
                  {layout({ ...layoutOptions, loading, width, height }).map(
                    (rawLayoutChild, i) => rawToReactElement(rawLayoutChild, i)
                  )}
                </Table>
              </ContextMenuTrigger>
            </ScrollOnMouseOut>
            {this.props.children}
          </div>
        )}
      </AutoSizer>
    );
  }
}

ListView.propTypes = propTypes;
ListView.defaultProps = defaultProps;
