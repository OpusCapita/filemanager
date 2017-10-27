### Synopsis

ListView is a part of FileManger. Built using [react-virtualized](https://github.com/bvaughn/react-virtualized/blob/master/docs/Table.md) `Table` component.

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| items                          | array                   | [{ id, isDirectory, iconUrl, title, size, modifyDate } ...] |
| itemsCount                     | number                  | Items total count                                           |
| selection                      | array                   | [id1, id2, id3, ...]                                        |
| humanReadableSize              | bool                    | Convert bytes to KB, MB, GB, etc.                           |
| locale                         | string                  | Used with `momentjs` for `modifyDate` column, etc.          |
| dateTimePattern                | string                  | Used with `momentjs` for `modifyDate` column, etc.          |
| sortBy                         | string                  | Column key                                                  |
| sortDirection                  | string                  | "ASC" or "DESC"                                             |
| onRowClick                     | func                    | ({ event, index, rowData}) => {}                            |
| onRowRightClick                | func                    | ({ event, index, rowData}) => {}                            |
| onRowDoubleClick               | func                    | ({ event, index, rowData}) => {}                            |
| onScroll                       | func                    | ({ clientHeight, scrollHeight, scrollTop }) => {}           |
| onSelection                    | func                    | ([id1, id2, id3, ...]) => {}                                |
| onSort                         | func                    | ({ sortBy, sortDirection }) => {}                           |
| onKeyDown                      | func                    | (e) => {}                                                   |
| onRef                          | func                    | (ref) => {}                                                 |

### Code Example

```
<div style={{ height: '480px', border: '1px solid #eee' }}>
  <ListView
    onRowClick={(data) => console.log('click', data)}
    onRowRightClick={(data) => console.log('right click', data)}
    onRowDoubleClick={(data) => console.log('double click', data)}
    onSelection={_scope.handleSelection}
    onSort={_scope.handleSort}
    selection={_scope.state.selection}
    sortBy={_scope.state.sortBy}
    sortDirection={_scope.state.sortDirection}
    itemsCount={13}
    items={[
      { 
        id: 'directory-1-id',
        iconUrl: 'https://rawgit.com/OpusCapita/svg-icons/master/svg/folder.svg',
        isDirectory: true,
        title: 'Important documents',
        modifyDate: 1508755456126,
      },
      { 
        id: 'directory-2-id',
        iconUrl: 'https://rawgit.com/OpusCapita/svg-icons/master/svg/folder.svg',
        isDirectory: true,  
        title: 'Very long directory name Very long directory name',
        modifyDate: 1508755456126,
      },
      { 
        id: 'excel-document-1-id',
        iconUrl: 'https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/svg/excel_16x1.svg',
        title: 'excel-document-1.xls',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'excel-document-2-id',
        iconUrl: 'https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/svg/excel_16x1.svg',
        title: 'excel-document-2.xls',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'word-document-1-id',
        iconUrl: 'https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/svg/word_16x1.svg',
        title: 'word-document-1.docx',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'word-document-2-id',
        iconUrl: 'https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/svg/word_16x1.svg',
        title: 'word-document-2.docx',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'image-1-id',
        iconUrl: 'https://cdn.rawgit.com/OpusCapita/svg-icons/master/svg/image.svg',
        title: 'image-1.jpg',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'image-2-id',
        iconUrl: 'https://cdn.rawgit.com/OpusCapita/svg-icons/master/svg/image.svg',
        title: 'image-2.jpg',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'image-3-id',
        iconUrl: 'https://cdn.rawgit.com/OpusCapita/svg-icons/master/svg/image.svg',
        title: 'image-3.jpg',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'image-4-id',
        iconUrl: 'https://cdn.rawgit.com/OpusCapita/svg-icons/master/svg/image.svg',
        title: 'image-4.jpg',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'text-document-1-id',
        iconUrl: 'https://cdn.rawgit.com/OpusCapita/svg-icons/master/svg/insert_drive_file.svg',
        title: 'text-document-1.txt',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'text-document-2-id',
        iconUrl: 'https://cdn.rawgit.com/OpusCapita/svg-icons/master/svg/insert_drive_file.svg',
        title: 'text-document-2.txt',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'text-document-3-id',
        iconUrl: 'https://cdn.rawgit.com/OpusCapita/svg-icons/master/svg/insert_drive_file.svg',
        title: 'text-document-3.txt',
        size: 100500,
        modifyDate: 1508755456126,
      }
    ]}
  />
</div>
```

### Component Name

ListView

### License

Licensed by © 2017 OpusCapita

