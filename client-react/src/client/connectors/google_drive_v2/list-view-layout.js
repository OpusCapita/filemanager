import { NameCell, SizeCell, DateTimeCell, HeaderCell } from '../../components/ListView/Cells.react';

const TABLET_WIDTH = 1024;
const MOBILE_WIDTH = 640;

let listViewLayout = (renderOptions) => ([
  {
    width: 48,
    label: 'Title',
    dataKey: 'title',
    flexGrow: 1,
    cellRenderer: NameCell(renderOptions),
    headerRenderer: HeaderCell(renderOptions),
    disableSort: false,
    hidden: false
  },
  {
    width: 100,
    dataKey: 'size',
    label: 'File size',
    flexGrow: renderOptions.clientWidth > TABLET_WIDTH ? 1 : 0,
    cellRenderer: SizeCell(renderOptions),
    headerRenderer: HeaderCell(renderOptions),
    disableSort: true,
    hidden: false
  },
  {
    width: 100,
    dataKey: 'modifyDate',
    label: 'Last modified',
    flexGrow: 1,
    cellRenderer: DateTimeCell(renderOptions),
    headerRenderer: HeaderCell(renderOptions),
    disableSort: true,
    hidden: renderOptions.clientWidth < MOBILE_WIDTH
  }
]);

let initiallSortBy = 'title';
let initiallSortDirection = 'ASC';

export default listViewLayout;
