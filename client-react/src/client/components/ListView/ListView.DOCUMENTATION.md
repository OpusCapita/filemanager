### Synopsis

ListView is a part of FileManger. Built using [react-virtualized](https://github.com/bvaughn/react-virtualized/blob/master/docs/Table.md) `Table` component.

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| items                          | array                   | [{ id, isDirectory, title, size, modifyDate } ...]          |
| selection                      | array                   | [id1, id2, id3, ...]                                        |
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
    loading={false}
    selection={_scope.state.selection}
    sortBy={_scope.state.sortBy}
    sortDirection={_scope.state.sortDirection}
    layoutOptions={{
      locale: 'en',
      dateTimePattern: 'YYYY-MM-DD HH:mm:ss',
      humanReadableSize: true,
      getIcon: () => ({ 
        svg: `<svg viewBox="0 0 120 120" version="1.1">
        <circle cx="60" cy="60" r="50"/>
        </svg>`, 
        fill: 'rgba(0, 0, 0, 0.72)' 
      })
    }}
    layout={(viewLayoutOptions) => ([
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
          flexGrow={viewLayoutOptions.width > 1024 ? 1 : 0}
          cellRenderer={Cell(viewLayoutOptions)}
          headerRenderer={HeaderCell(viewLayoutOptions)}
          disableSort={true}
        />
      ), (viewLayoutOptions.width > 320) && (
        <Column
          key="modifyDate"
          width={100}
          dataKey="modifyDate"
          label="Last modified"
          flexGrow={1}
          cellRenderer={Cell(viewLayoutOptions)}
          headerRenderer={HeaderCell(viewLayoutOptions)}
          disableSort={true}
        />
      )
    ])}
    items={[
      { 
        id: 'directory-1-id',
        isDirectory: true,
        title: 'Important documents',
        modifyDate: 1508755456126,
      },
      { 
        id: 'directory-2-id',
        isDirectory: true,  
        title: 'Very long directory name Very long directory name',
        modifyDate: 1508755456126,
      },
      { 
        id: 'excel-document-1-id',
        title: 'excel-document-1.xls',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'excel-document-2-id',
        title: 'excel-document-2.xls',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'word-document-1-id',
        title: 'word-document-1.docx',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'word-document-2-id',
        title: 'word-document-2.docx',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'image-1-id',
        title: 'image-1.jpg',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'image-2-id',
        title: 'image-2.jpg',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'image-3-id',
        title: 'image-3.jpg',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'image-4-id',
        title: 'image-4.jpg',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'text-document-1-id',
        title: 'text-document-1.txt',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'text-document-2-id',
        title: 'text-document-2.txt',
        size: 100500,
        modifyDate: 1508755456126,
      },
      { 
        id: 'text-document-3-id',
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

