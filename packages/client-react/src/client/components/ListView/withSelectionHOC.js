import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';

import {
  isDef,
  noop,
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

export default class WithSelection extends PureComponent {
  static propTypes = {
    onSelection: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowRightClick: PropTypes.func,
    onRef: PropTypes.func,
    onKeyDown: PropTypes.func,
    onScroll: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.object),
    idPropName: PropTypes.string,
    selection: PropTypes.array,
    loading: PropTypes.bool,
    rowHeight: PropTypes.number
  }

  static defaultProps = {
    onSelection: noop,
    onRowClick: noop,
    onRowRightClick: noop,
    onRef: noop,
    onScroll: noop,
    items: [],
    idPropName: 'id',
    selection: [],
    loading: false
  }

  state = {
    scrollToIndex: 0,
    clientHeight: 0,
    scrollTop: 0,
    scrollHeight: 0
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selection.length === 1) {
      // When FileNavigator navigates to parent dir, this last selected should be rigth
      this.lastSelected = nextProps.selection[0];
    }

    if (this.props.loading !== nextProps.loading) {
      // Force recalculate scrollHeight for appropriate handle "PageUp, PageDown, Home, End", etc. keys
      this.setState({ scrollHeight: nextProps.items.length * this.props.rowHeight });
    }
  }

  handleSelection = ids => this.props.onSelection(ids);

  handleSelectEvent = ({ selection, scrollToIndex }) => {
    const { items, idPropName } = this.props;
    this.lastSelected = items[scrollToIndex][idPropName];
    this.handleSelection(selection);
    this.scrollToIndex(scrollToIndex);
  }

  handleRowClick = ({ event, rowData, ...args }) => {
    const { items, idPropName, selection } = this.props;
    const id = rowData[idPropName];
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

    this.props.onRowClick({ event, rowData, ...args });
  }

  handleRowRightClick = ({ rowData, ...args }) => {
    const { idPropName, selection } = this.props;
    if (selection.indexOf(rowData[idPropName]) === -1) {
      this.handleSelection([rowData[idPropName]]);
    }

    this.props.onRowRightClick({ rowData, ...args });
  }

  handleKeyDown = e => {
    e.preventDefault();

    const { items, onKeyDown, idPropName, selection } = this.props;

    // Debounce frequent events for performance reasons
    const keyDownTime = new Date().getTime();
    if (this.lastKeyDownTime && (keyDownTime - this.lastKeyDownTime < 64)) {
      return;
    }
    this.lastKeyDownTime = keyDownTime;

    if (onKeyDown) {
      onKeyDown(e)
    }

    if (e.which === 38 && !e.shiftKey) { // Up arrow
      if (!items.length) {
        return
      }

      if (!selection.length) {
        this.handleSelectEvent(selectLastItem({ items }));
      } else {
        this.handleSelectEvent(selectPrev({ items, lastSelected: this.lastSelected }));
      }
    }

    if (e.which === 40 && !e.shiftKey) { // Down arrow
      if (!items.length) {
        return;
      }

      if (!selection.length) {
        this.handleSelectEvent(selectFirstItem({ items }))
      } else {
        this.handleSelectEvent(selectNext({ items, lastSelected: this.lastSelected }))
      }
    }

    if (e.which === 38 && e.shiftKey) { // Up arrow holding Shift key
      if (!items.length) {
        return;
      }

      if (!selection.length) {
        this.handleSelectEvent(selectLastItem({ items }))
        return;
      }

      const fromIdIndex = findIndex(items, item => item[idPropName] === this.lastSelected);
      const nextIdIndex = fromIdIndex > 0 ? fromIdIndex - 1 : 0;
      const nextId = items[nextIdIndex][idPropName];
      const selectionDirection = selection.indexOf(nextId) === -1 ? -1 : 1;

      if (this.lastSelected === items[0][idPropName]) {
        return
      }

      const selectionData = selectionDirection === -1 ?
        addPrevToSelection({ selection, items, lastSelected: this.lastSelected }) :
        removeLastFromSelection({ selection, items });

      this.handleSelectEvent(selectionData);
    }

    if (e.which === 40 && e.shiftKey) { // Down arrow holding Shift key
      if (!items.length) {
        return
      }

      if (!selection.length) {
        this.handleSelectEvent(selectFirstItem({ items }));
        return
      }

      const fromIdIndex = findIndex(items, item => item[idPropName] === this.lastSelected);
      const nextIdIndex = fromIdIndex + 1 < items.length ? fromIdIndex + 1 : items.length - 1;
      const nextId = items[nextIdIndex][idPropName];
      const selectionDirection = selection.indexOf(nextId) === -1 ? -1 : 1;

      if (this.lastSelected === items[items.length - 1][idPropName]) {
        return
      }

      let selectionData = selectionDirection === -1 ?
        addNextToSelection({ selection, items, lastSelected: this.lastSelected }) :
        removeFirstFromSelection({ selection, items });

      this.handleSelectEvent(selectionData)
    }

    if (e.which === 65 && (e.ctrlKey || e.metaKey)) { // Ctrl + A or Command + A
      // Select all
      let allIds = items.map(item => item[idPropName]);
      this.handleSelection(allIds);
    }

    if (e.which === 27) { // Esc
      // Clear selection
      this.handleSelection([]);
    }


    if (e.which === 33) { // PageUp
      // Scroll top
      const { scrollTop } = this.state;
      const newScrollTop = scrollTop - SCROLL_STRENGTH < 0 ? 0 : scrollTop - SCROLL_STRENGTH;

      this.setState({ scrollTop: newScrollTop });
    }

    if (e.which === 34) { // PageDown
      // Scroll bottom
      const { scrollTop, scrollHeight, clientHeight } = this.state;
      const newScrollTop = scrollTop + SCROLL_STRENGTH > scrollHeight - clientHeight ?
        scrollHeight - clientHeight :
        scrollTop + SCROLL_STRENGTH;

      this.setState({ scrollTop: newScrollTop });
    }

    if (e.which === 36) { // Home
      // Scroll to first item
      this.setState({ scrollTop: 0 });
    }

    if (e.which === 35) { // End
      // Scroll to first item
      const { clientHeight, scrollHeight } = this.state;
      const newScrollTop = scrollHeight - clientHeight;
      this.setState({ scrollTop: newScrollTop });
    }

    if (this.containerRef) {
      this.containerRef.focus(); // XXX fix for loosing focus on key navigation
    }
  }

  // ref to wrapped container
  handleRef = ref => {
    this.containerRef = ref;
    this.props.onRef(ref);
  }

  handleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    this.props.onScroll({ clientHeight, scrollHeight, scrollTop });
    this.setState({
      ...(isDef(clientHeight) && { clientHeight }),
      ...(isDef(scrollHeight) && { scrollHeight }),
      ...(isDef(scrollTop) && { scrollTop })
    });
  }

  scrollToIndex = index => {
    this.setState({ scrollToIndex: index });
  }

  handleCursorAbove = scrollTop => {
    this.setState({ scrollTop });
  }

  handleCursorBellow = scrollTop => {
    this.setState({ scrollTop });
  }

  render() {
    const { children, selection } = this.props;

    const {
      clientHeight,
      scrollTop,
      scrollHeight,
      scrollToIndex
    } = this.state;

    return (
      <div
        onKeyDown={this.handleKeyDown}
        tabIndex="0"
        ref={this.handleRef}
      >
        {children({
          selection,
          onRowClick: this.handleRowClick,
          onRowRightClick: this.handleRowRightClick,
          onScroll: this.handleScroll,
          onCursorAbove: this.handleCursorAbove,
          onCursorBelow: this.handleCursorBellow,
          clientHeight,
          scrollTop,
          scrollHeight,
          scrollToIndex,
          lastSelected: this.lastSelected
        })}
      </div>
    )
  }
}
