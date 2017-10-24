import React, { Component, PropTypes } from 'react';
import './ListView.less';
import 'react-virtualized/styles.css';
import { Table, Column, AutoSizer, SortDirection } from 'react-virtualized';
import { IconCell, TitleCell, SizeCell, DateTimeCell, HeaderCell } from './Cells.react';
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
  onSelection: PropTypes.func
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
  onSelection: () => {}
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
    e.preventDefault();
    e.stopPropagation();

    let { selection } = this.props;

    if (e.which === 38 && !e.shiftKey) { // Up arrow
      if (!selection.length) {
        let selectionData = this.selectFirstItem();
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
      } else {
        let selectionData = this.selectPrev();
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
      }
    }

    if (e.which === 40 && !e.shiftKey) { // Down arrow
      if (!selection.length) {
        let selectionData = this.selectFirstItem();
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
      } else {
        let selectionData = this.selectNext();
        this.handleSelection(selectionData.selection);
        this.scrollToIndex(selectionData.scrollToIndex);
      }
    }

    if (e.which === 38 && e.shiftKey) { // Up arrow holding Shift key

    }

    if (e.which === 40 && e.shiftKey) { // Down arrow holding Shift key

    }
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

  handleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    // console.log('scroll', clientHeight, scrollHeight, scrollTop);
  }

  scrollToIndex = (index) => {
    console.log('sti', index);
    this.setState({ scrollToIndex: index });
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

    let { scrollToIndex } = this.state;

    return (
      <div
        className="oc-fm--list-view"
        onKeyDown={this.handleKeyDown}
      >
        <AutoSizer>
          {({ width, height }) => (
            <Table
              width={width}
              height={height}
              rowCount={items.length}
              rowGetter={({ index }) => items[index]}
              rowHeight={48}
              headerHeight={48}
              className="oc-fm--list-view__table"
              gridClassName="oc-fm--list-view__grid"
              onScroll={this.handleScroll}
              scrollToIndex={scrollToIndex}
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
      </div>
    );
  }
}

ListView.propTypes = propTypes;
ListView.defaultProps = defaultProps;
