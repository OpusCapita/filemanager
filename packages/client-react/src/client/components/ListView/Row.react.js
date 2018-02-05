// Copied from https://github.com/bvaughn/react-virtualized/blob/04d1221133a1c59be24c8af90ae09e46000372b5/source/Table/defaultRowRenderer.js#L1

// TODO Sure this component can be optimised using "shouldComponentUpdate"

import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { ContextMenuTrigger } from "react-contextmenu";

const RowDragSource = {
  canDrag(props) {
    // You can disallow drag based on props
    return true;
    // return props.isReady;
  },

  isDragging(props, monitor) {
    // console.log('is dragging');
    // console.log('item', monitor.getItem());
    return monitor.getItem().id === props.rowData.id;
  },

  beginDrag(props, monitor, component) {
    const item = { id: props.rowData.id };
    return item;
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }

    const item = monitor.getItem(); // eslint-disable-line
    const dropResult = monitor.getDropResult(); // eslint-disable-line
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
    /* eslint-disable */
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
      loading,
      isDragging,
      connectDragSource,
      connectDragPreview,
      contextMenuId,
      hasTouch
    } = this.props;
    /* eslint-enable */

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
        a11yProps.onClick = event => onRowClick({ event, index, rowData });
      }
      if (onRowDoubleClick) {
        a11yProps.onDoubleClick = event =>
          onRowDoubleClick({ event, index, rowData });
      }
      if (onRowMouseOut) {
        a11yProps.onMouseOut = event => onRowMouseOut({ event, index, rowData });
      }
      if (onRowMouseOver) {
        a11yProps.onMouseOver = event => onRowMouseOver({ event, index, rowData });
      }
      if (onRowRightClick) {
        a11yProps.onContextMenu = event =>
          onRowRightClick({ event, index, rowData });
      }
    }

    let isSelected = selection.indexOf(rowData.id) !== -1;
    let isLastSelected = lastSelected === rowData.id;

    return (
      <ContextMenuTrigger id={contextMenuId} holdToDisplay={hasTouch ? 1000 : -1}>
        {connectDragPreview(connectDragSource((
          <div
            {...a11yProps}
            className={`
              ReactVirtualized__Table__row
              oc-fm--list-view__row
              ${(! loading && isSelected) ? 'oc-fm--list-view__row--selected' : ''}
              ${(!loading && isLastSelected) ? 'oc-fm--list-view__row--last-selected' : ''}
              ${(!loading && isDragging) ? 'oc-fm--list-view__row--dragging' : ''}
              ${loading ? 'oc-fm--list-view__row--loading' : ''}
            `}
            key={rowData.id}
            role="row"
            style={style}
          >
            {columns}
          </div>
        )))}
      </ContextMenuTrigger>
    );
  }
}

export default ({ selection, lastSelected, loading, contextMenuId }) => (props) => (
  <Row
    {...props}
    selection={selection}
    lastSelected={lastSelected}
    loading={loading}
    contextMenuId={contextMenuId}
  />
);
