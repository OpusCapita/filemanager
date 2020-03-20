// Copied from https://github.com/bvaughn/react-virtualized/blob/04d1221133a1c59be24c8af90ae09e46000372b5/source/Table/defaultRowRenderer.js#L1

// TODO Make sure this component can be optimised using "shouldComponentUpdate"

import React, { Component } from 'react';
import { ContextMenuTrigger } from "react-contextmenu";

class Row extends Component {
  render() {
    /* eslint-disable  react/prop-types */
    const {
      className, // eslint-disable-line no-unused-vars
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
      contextMenuId,
      hasTouch
    } = this.props;
    /* eslint-enable react/prop-types */

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

    const isSelected = selection.indexOf(rowData.id) !== -1;
    const isLastSelected = lastSelected === rowData.id;

    return (
      <ContextMenuTrigger id={contextMenuId} holdToDisplay={hasTouch ? 1000 : -1}>
        <div
          {...a11yProps}
          className={`
              ReactVirtualized__Table__row
              oc-fm--list-view__row
              ${(! loading && isSelected) ? 'oc-fm--list-view__row--selected' : ''}
              ${(!loading && isLastSelected) ? 'oc-fm--list-view__row--last-selected' : ''}
              ${loading ? 'oc-fm--list-view__row--loading' : ''}
            `}
          key={rowData.id}
          role="row"
          style={style}
        >
          {columns}
        </div>
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
