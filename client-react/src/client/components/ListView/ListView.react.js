// TODO move selection functions to separate file "selection-utils.js" to reduce file size
// TODO - handle shiftKey + [Home|End|PageUp|PageDown] for select many files

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import './ListView.less';
import 'react-virtualized/styles.css';
import { Table, AutoSizer, ColumnSizer, SortDirection } from 'react-virtualized';
import ContextMenu from '../ContextMenu';
import NoFilesFoundStub from '../NoFilesFoundStub';
import Row from './Row.react';
import ScrollOnMouseOut from '../ScrollOnMouseOut';
import { findIndex, range } from 'lodash';
import clickOutside from 'react-click-outside';
import nanoid from 'nanoid';

const SCROLL_STRENGTH = 80;
const ROW_HEIGHT = 48;
const HEADER_HEIGHT = 48;

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.number,
    modifyDate: PropTypes.number
  })),
  contextMenuId: PropTypes.string,
  contextMenuChildren: PropTypes.arrayOf(PropTypes.node),
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
  items: [],
  contextMenuId: nanoid(),
  contextMenuChildren: [],
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
    if (this.props.selection.indexOf(rowData.id) === -1) {
      this.handleSelection([rowData.id]);
    }

    this.props.onRowRightClick({ event, index, rowData });
  }

  handleRowDoubleClick = ({ event, index, rowData }) => {
    this.props.onRowDoubleClick({ event, index, rowData });
  }

  handleKeyDown = (e) => {
    e.preventDefault();

    // Debounce frequent events for performance reasons
    let keyDownTime = new Date().getTime();
    if (this.lastKeyDownTime && (keyDownTime - this.lastKeyDownTime < 64)) {
      return;
    }
    this.lastKeyDownTime = keyDownTime;


    let { selection, items, onKeyDown } = this.props;
    this.props.onKeyDown(e);

    if (e.which === 38 && !e.shiftKey) { // Up arrow

      if (!items.length) {
        return;
      }

      if (!selection.length) {
        let selectionData = this.selectLastItem();
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
      if (!items.length) {
        return;
      }

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
      if (!items.length) {
        return;
      }

      if (!selection.length) {
        let selectionData = this.selectLastItem();
        this.lastSelected = items[selectionData.scrollToIndex].id;
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
        return;
      }

      let fromIdIndex = findIndex(items, (o) => o.id === this.lastSelected);
      let nextIdIndex = fromIdIndex > 0 ? fromIdIndex - 1 : 0;
      let nextId = items[nextIdIndex].id;
      let selectionDirection = selection.indexOf(nextId) === -1 ? -1 : 1;

      let selectionData = selectionDirection === -1 ? this.addPrevToSelection() : this.removeLastFromSelection();
      this.lastSelected = items[selectionData.scrollToIndex].id;
      this.handleSelection(selectionData.selection);
      this.scrollToIndex(selectionData.scrollToIndex);
    }

    if (e.which === 40 && e.shiftKey) { // Down arrow holding Shift key
      if (!items.length) {
        return;
      }

      if (!selection.length) {
        let selectionData = this.selectFirstItem();
        this.lastSelected = items[selectionData.scrollToIndex].id;
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
        return;
      }

      let fromIdIndex = findIndex(items, (o) => o.id === this.lastSelected);
      let nextIdIndex = fromIdIndex + 1 < items.length ? fromIdIndex + 1 : items.length - 1;
      let nextId = items[nextIdIndex].id;
      let selectionDirection = selection.indexOf(nextId) === -1 ? -1 : 1;

      let selectionData = selectionDirection === -1 ? this.addNextToSelection() : this.removeFirstFromSelection();
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

  handleClickOutside = () => {
    let selectionData = this.clearSelection();
    this.handleSelection(selectionData.selection);
    this.scrollToIndex(selectionData.scrollToIndex);
  }

  selectFirstItem = () => ({
    selection: this.props.items.length ? [this.props.items[0].id] : [],
    scrollToIndex: 0
  });

  selectLastItem = () => ({
    selection: this.props.items.length ? [this.props.items[this.props.items.length - 1].id] : [],
    scrollToIndex: this.props.items.length - 1
  });

  clearSelection = () => ({
    selection: [],
    scrollToIndex: this.state.scrollToIndex
  });

  selectNext = () => {
    let { selection, items } = this.props;
    let currentId = this.lastSelected;
    let currentIndex = findIndex(items, (o) => o.id === currentId);
    let nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : currentIndex;
    let nextId = items[nextIndex].id;
    return { selection: [nextId], scrollToIndex: nextIndex };
  }

  selectPrev = () => {
    let { selection, items } = this.props;
    let currentId = this.lastSelected;
    let currentIndex = findIndex(items, (o) => o.id === currentId);

    if (currentIndex <= -1) {
      // Fix for fast selection updates
      return { selection, scrollToIndex: 0 };
    }

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
      contextMenuId,
      contextMenuChildren,
      layout,
      layoutOptions,
      loading,
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

    let itemsToRender = null;
    if (loading && this.containerHeight) {
      // Generate items for "loading placeholder"
      let itemsCount = Math.floor(this.containerHeight / ROW_HEIGHT - 1);
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
                rowRenderer={Row({ selection, lastSelected, loading, contextMenuId })}
                noRowsRenderer={NoFilesFoundStub}
                onRowClick={this.handleRowClick}
                onRowRightClick={this.handleRowRightClick}
                onRowDoubleClick={this.handleRowDoubleClick}
              >
                {layout({ ...layoutOptions, loading, width, height })}
              </Table>
            </ScrollOnMouseOut>
            <ContextMenu triggerId={contextMenuId}>
              {contextMenuChildren.map((contextMenuChild, i) => ({ ...contextMenuChild, key: i }))}
            </ContextMenu>
            {this.props.children}
          </div>
        )}
      </AutoSizer>
    );
  }
}

ListView.propTypes = propTypes;
ListView.defaultProps = defaultProps;
