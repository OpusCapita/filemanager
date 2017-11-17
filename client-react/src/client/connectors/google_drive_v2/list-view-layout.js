import fecha from 'fecha';
import filesize from 'filesize';

const TABLET_WIDTH = 1024;
const MOBILE_WIDTH = 640;

function formatSize(
  viewLayoutOptions,  { cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }
) {
  if (typeof cellData !== 'undefined' && viewLayoutOptions.humanReadableSize) {
    return filesize(cellData);
  }

  return cellData || '—';
};

function formatDate(
  viewLayoutOptions,  { cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }
) {
  if (cellData) {
    let { locale, dateTimePattern } = viewLayoutOptions;
    return fecha.format(new Date().setTime(cellData), dateTimePattern);
  }

  return '';
};

let listViewLayout = (viewLayoutOptions) => ([
    ({
    elementType: 'Column',
    elementProps: {
      key: "title",
      dataKey: "title",
      width: 48,
      label: "Title",
      flexGrow: 1,
      cellRenderer: {
        elementType: 'NameCell',
        callArguments: [viewLayoutOptions]
      },
      headerRenderer: {
        elementType: 'HeaderCell',
        callArguments: [viewLayoutOptions]
      },
      disableSort: false
    }
  }), ({
    elementType: 'Column',
    elementProps: {
      key: "size",
      width: 100,
      dataKey: "size",
      label: "File size",
      flexGrow: viewLayoutOptions.width > TABLET_WIDTH ? 1 : 0,
      cellRenderer: {
        elementType: 'Cell',
        callArguments: [{ ...viewLayoutOptions, getData: formatSize }]
      },
      headerRenderer: {
        elementType: 'HeaderCell',
        callArguments: [viewLayoutOptions]
      },
      disableSort: true
    }
  }), (viewLayoutOptions.width > MOBILE_WIDTH) && ({
    elementType: 'Column',
    elementProps: {
      key: "modifiedTime",
      width: 100,
      dataKey: "modifiedTime",
      label: "Last modified",
      flexGrow: 1,
      cellRenderer: {
        elementType: 'Cell',
        callArguments: [{ ...viewLayoutOptions, getData: formatDate }]
      },
      headerRenderer: {
        elementType: 'HeaderCell',
        callArguments: [viewLayoutOptions]
      },
      disableSort: false
    }
  })
]);

export default listViewLayout;
