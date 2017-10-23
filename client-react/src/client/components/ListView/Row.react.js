// Copied from https://github.com/bvaughn/react-virtualized/blob/04d1221133a1c59be24c8af90ae09e46000372b5/source/Table/defaultRowRenderer.js#L1

export default ({ selection }) => ({
  className,
  columns,
  index,
  key,
  onRowClick,
  onRowDoubleClick,
  onRowMouseOut,
  onRowMouseOver,
  onRowRightClick,
  rowData,
  style
}) => {
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

  return (
    <div
      {...a11yProps}
      className={`
        ReactVirtualized__Table__row
        oc-fm--list-view__row
        ${isSelected ? 'oc-fm--list-view__row--selected' : ''}
      `}
      key={key}
      role="row"
      style={style}>
      {columns}
    </div>
  );
};
