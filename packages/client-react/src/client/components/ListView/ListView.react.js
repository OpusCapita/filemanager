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
  handleSort = ({ sortBy, sortDirection }) => {
    this.props.onSort({ sortBy, sortDirection });
  }

  render() {
    const {
      rowContextMenuId,
      filesViewContextMenuId,
      items,
      layout,
      layoutOptions,
      loading,
      sortBy,
      sortDirection
    } = this.props;

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
            onKeyDown={this.props.onKeyDown}
            onSelection={this.props.onSelection}
            selection={this.props.selection}
            loading={loading}
            rowHeight={ROW_HEIGHT} // TBD
          >
            {
              ({
                onRowClick,
                onRowRightClick,
                onCursorAbove,
                onCursorBellow,
                onScroll,
                clientHeight,
                scrollTop,
                scrollHeight,
                scrollToIndex,
                selection,
                lastSelected
              }) => (
                <div
                  className="oc-fm--list-view"
                >
                  <ScrollOnMouseOut
                    onCursorAbove={onCursorAbove}
                    onCursorBellow={onCursorBellow}
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
                        onScroll={onScroll}
                        scrollToIndex={scrollToIndex}
                        scrollTop={scrollTop}
                        sort={this.handleSort}
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
