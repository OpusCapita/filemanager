import { Column } from 'react-virtualized';
import { NameCell, SizeCell, DateTimeCell, HeaderCell } from '../../components/ListView/Cells.react';

const TABLET_WIDTH = 1024;
const MOBILE_WIDTH = 640;

let listViewLayout = (renderOptions) => ([
  (
    <Column
      key="title"
      dataKey="title"
      width={48}
      label="Title"
      flexGrow={1}
      cellRenderer={NameCell(renderOptions)}
      headerRenderer={HeaderCell(renderOptions)}
      disableSort={false}
    />
  ), (
    <Column
      key="size"
      width={100}
      dataKey="size"
      label="File size"
      flexGrow={renderOptions.width > TABLET_WIDTH ? 1 : 0}
      cellRenderer={SizeCell(renderOptions)}
      headerRenderer={HeaderCell(renderOptions)}
      disableSort={true}
    />
  ), (renderOptions.width > MOBILE_WIDTH) && (
    <Column
      key="modifyDate"
      width={100}
      dataKey="modifyDate"
      label="Last modified"
      flexGrow={1}
      cellRenderer={DateTimeCell(renderOptions)}
      headerRenderer={HeaderCell(renderOptions)}
      disableSort={true}
    />
  )
]);

let initiallSortBy = 'title';
let initiallSortDirection = 'ASC';

export default listViewLayout;
