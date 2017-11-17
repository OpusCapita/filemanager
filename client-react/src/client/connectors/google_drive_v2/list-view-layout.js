import { Column } from 'react-virtualized';
import HeaderCell from '../../components/HeaderCell';
import Cell from '../../components/Cell';
import NameCell from '../../components/NameCell';

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
  (
    <Column
      key="title"
      dataKey="title"
      width={48}
      label="Title"
      flexGrow={1}
      cellRenderer={NameCell(viewLayoutOptions)}
      headerRenderer={HeaderCell(viewLayoutOptions)}
      disableSort={false}
    />
  ), (
    <Column
      key="size"
      width={100}
      dataKey="size"
      label="File size"
      flexGrow={viewLayoutOptions.width > TABLET_WIDTH ? 1 : 0}
      cellRenderer={Cell({ ...viewLayoutOptions, getData: formatSize })}
      headerRenderer={HeaderCell(viewLayoutOptions)}
      disableSort={true}
    />
  ), (viewLayoutOptions.width > MOBILE_WIDTH) && (
    <Column
      key="modifyDate"
      width={100}
      dataKey="modifiedDate"
      label="Last modified"
      flexGrow={1}
      cellRenderer={Cell({ ...viewLayoutOptions, getData: formatDate })}
      headerRenderer={HeaderCell(viewLayoutOptions)}
      disableSort={false}
    />
  )
]);

export default listViewLayout;
