import fecha from 'fecha';
import filesize from 'filesize';
import getMess from './translations';

const TABLET_WIDTH = 1024;
const MOBILE_WIDTH = 640;

function formatSize(
  viewLayoutOptions, { cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }
) {
  if (typeof cellData !== 'undefined' && viewLayoutOptions.humanReadableSize) {
    return filesize(cellData);
  }

  return cellData || '—';
}

function formatDate(
  viewLayoutOptions, { cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }
) {
  if (cellData) {
    let { dateTimePattern } = viewLayoutOptions;
    return fecha.format(new Date().setTime(cellData), dateTimePattern);
  }

  return '';
}

let listViewLayout = (viewLayoutOptions) => {
  let getMessage = getMess.bind(null, viewLayoutOptions.locale);
  return [
    ({
      elementType: 'Column',
      elementProps: {
        key: "name",
        dataKey: "name",
        width: 48,
        label: getMessage('title'),
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
    }),
    ({
      elementType: 'Column',
      elementProps: {
        key: "size",
        width: 100,
        dataKey: "size",
        label: getMessage('fileSize'),
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
    }),
    (viewLayoutOptions.width > MOBILE_WIDTH) && ({
      elementType: 'Column',
      elementProps: {
        key: "modifiedTime",
        width: 100,
        dataKey: "modifiedTime",
        label: getMessage('lastModified'),
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
  ];
};

export default listViewLayout;
