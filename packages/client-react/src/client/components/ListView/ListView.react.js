import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './ListView.less';
import 'react-virtualized/styles.css';
// TBD individual imports from 'react-virtualized' to decrease bundle size?
// ex. import Table from 'react-virtualized/dist/commonjs/Table'
import { Table, AutoSizer, SortDirection } from 'react-virtualized';
import { ContextMenuTrigger } from "react-contextmenu";
import NoFilesFoundStub from '../NoFilesFoundStub';
import Row from './Row.react';
import ScrollOnMouseOut from '../ScrollOnMouseOut';
import { range } from 'lodash';
import nanoid from 'nanoid';
import detectIt from 'detect-it';
import rawToReactElement from '../raw-to-react-element';
import WithSelection from './withSelectionHOC';
import { isDef } from './utils';

const ROW_HEIGHT = 38;
const HEADER_HEIGHT = 38;
const SCROLL_STRENGTH = 80;
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
  selection: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
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
  selection: [],
  loading: false,
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
  state = {
    scrollToIndex: 0,
    clientHeight: 0,
    scrollTop: 0,
    scrollHeight: 0
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading !== nextProps.loading) {
      // Force recalculate scrollHeight for appropriate handle "PageUp, PageDown, Home, End", etc. keys
      this.setState({ scrollHeight: nextProps.items.length * ROW_HEIGHT });
    }
  }

  scrollToIndex = index => {
    this.setState({ scrollToIndex: index });
  }

  handleScrollTop = scrollTop => this.setState({ scrollTop });

  handleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    this.props.onScroll({ clientHeight, scrollHeight, scrollTop });
    this.setState({
      ...(isDef(clientHeight) && { clientHeight }),
      ...(isDef(scrollHeight) && { scrollHeight }),
      ...(isDef(scrollTop) && { scrollTop })
    });
  }

  handlePageUp = _ => {
    const { scrollTop } = this.state;
    const newScrollTop = scrollTop - SCROLL_STRENGTH < 0 ? 0 : scrollTop - SCROLL_STRENGTH;
    this.handleScrollTop(newScrollTop);
  }

  handlePageDown = _ => {
    const { scrollTop, scrollHeight, clientHeight } = this.state;
    const newScrollTop = scrollTop + SCROLL_STRENGTH > scrollHeight - clientHeight ?
      scrollHeight - clientHeight :
      scrollTop + SCROLL_STRENGTH;
    this.handleScrollTop(newScrollTop);
  }

  handleHome = _ => this.handleScrollTop(0);

  handleEnd = _ => {
    // Scroll to the first item
    const { clientHeight, scrollHeight } = this.state;
    const newScrollTop = scrollHeight - clientHeight;
    this.handleScrollTop(newScrollTop);
  }

  handleKeyDown = e => {
    e.preventDefault();

    this.props.onKeyDown(e);

    if (e.which === 33) { // PageUp
      this.handlePageUp();
    }

    if (e.which === 34) { // PageDown
      this.handlePageDown();
    }

    if (e.which === 36) { // Home
      this.handleHome();
    }

    if (e.which === 35) { // End
      this.handleEnd();
    }
  }

  handleSort = ({ sortBy, sortDirection }) => {
    this.props.onSort({ sortBy, sortDirection });
  }

  handleRowDoubleClick = ({ event, index, rowData }) => {
    this.props.onRowDoubleClick({ event, index, rowData });
  }

  handleSelection = ({ selection, scrollToIndex }) => {
    this.props.onSelection(selection);
    this.scrollToIndex(scrollToIndex)
  }

  render() {
    const {
      rowContextMenuId,
      filesViewContextMenuId,
      items,
      layout,
      layoutOptions,
      loading,
      onRef,
      sortBy,
      sortDirection
    } = this.props;

    const {
      clientHeight,
      scrollTop,
      scrollHeight,
      scrollToIndex
    } = this.state;

    let itemsToRender = null;
    if (loading && this.containerHeight) {
      // Generate items for "loading placeholder"
      const itemsCount = Math.floor(this.containerHeight / ROW_HEIGHT - 1);
      itemsToRender = range(itemsCount).map(_ => ({}));
    } else {
      itemsToRender = items;
    }

    return (
      <AutoSizer>
        {({ width, height }) => (this.containerHeight = height) && (

          <WithSelection
            items={itemsToRender}
            onKeyDown={this.handleKeyDown}
            onSelection={this.handleSelection}
            selection={this.props.selection}
            onRef={onRef}
          >
            {
              ({
                onRowClick,
                onRowRightClick,
                selection,
                lastSelected
              }) => (
                <div
                  className="oc-fm--list-view"
                >
                  <ScrollOnMouseOut
                    onCursorAbove={this.handleScrollTop}
                    onCursorBellow={this.handleScrollTop}
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
                        sort={this.handleSort} // eslint-disable-line
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        rowRenderer={Row({
                          selection, lastSelected, loading, contextMenuId: rowContextMenuId, hasTouch: HAS_TOUCH
                        })}
                        noRowsRenderer={NoFilesFoundStub}
                        onRowClick={onRowClick}
                        onRowRightClick={onRowRightClick}
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
              )
            }
          </WithSelection>


        )}
      </AutoSizer>
    );
  }
}

ListView.propTypes = propTypes;
ListView.defaultProps = defaultProps;
