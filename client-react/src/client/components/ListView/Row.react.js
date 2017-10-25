// Copied from https://github.com/bvaughn/react-virtualized/blob/04d1221133a1c59be24c8af90ae09e46000372b5/source/Table/defaultRowRenderer.js#L1

// TODO Sure this component can be optimised using "shouldComponentUpdate"

import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

const RowDragSource = {
  canDrag(props) {
    // You can disallow drag based on props
    return true;
    return props.isReady;
  },

  isDragging(props, monitor) {
    // If your component gets unmounted while dragged
    // (like a card in Kanban board dragged between lists)
    // you can implement something like this to keep its
    // appearance dragged:
    console.log('is dragging');
    return true;
    // return monitor.getItem().id === props.id;
  },

  beginDrag(props, monitor, component) {
    // Return the data describing the dragged item
    console.log('begin drag');
    const item = { id: props.id };

    // return item;
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
      return;
    }

    // When dropped on a compatible target, do something.
    // Read the original dragged item from getItem():
    const item = monitor.getItem();

    // You may also read the drop result from the drop target
    // that handled the drop, if it returned an object from
    // its drop() method.
    const dropResult = monitor.getDropResult();

    // This is a good place to call some Flux action
    // CardActions.moveCardToList(item.id, dropResult.listId);
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

@DragSource('filemanager-resource', RowDragSource, collect)
class Row extends Component {
  render() {
    let {
      className,
      columns,
      index,
      onRowClick,
      onRowDoubleClick,
      onRowMouseOut,
      onRowMouseOver,
      onRowRightClick,
      rowData,
      style,
      selection,
      lastSelected,
      isDragging,
      connectDragSource,
      connectDragPreview
    } = this.props;

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
    let isLastSelected = lastSelected === rowData.id;
    console.log('isDragging', this.props);
    console.log('dp', connectDragPreview);
    console.log('ds', connectDragSource);
    return connectDragPreview(
      connectDragSource(
        (
      <div
        {...a11yProps}
        className={`
        ReactVirtualized__Table__row
        oc-fm--list-view__row
        ${isSelected ? 'oc-fm--list-view__row--selected' : ''}
        ${isLastSelected ? 'oc-fm--list-view__row--last-selected' : ''}
        `}
        key={rowData.id}
        role="row"
        style={style}>
        {columns}
      </div>
        )));
  }
};

export default ({ selection, lastSelected }) => (props) => (
  <Row
    {...props}
    selection={selection}
    lastSelected={lastSelected}
  />
);
