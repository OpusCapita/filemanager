### Synopsis

FileNavigator is
*Write here a short introduction and/or overview that explains **what** component is.*

### Props Reference

| Name                           | Type                    | Description                                                                                    |
| ------------------------------ | :---------------------- | -----------------------------------------------------------                                    |
| api                            | object                  |                                                                                                |
| apiOptions                     | object                  |                                                                                                |
| capabilities                   | func                    |                                                                                                |
| initialResourceId              | string                  |                                                                                                |
| listViewLayout                 | func                    |                                                                                                |
| viewLayoutOptions              |                         |                                                                                                |
| onClickOutside                 | func                    | `({ fileNavigator }) => ...`                                                                   |
| onResourceChange               | func                    | `resource => ...`                                                                              |
| onResourceChildrenChange       | func                    | `resourceChildren => ...`                                                                      |
| onResourceLocationChange       | func                    | `resourceLocation => ...`                                                                      |
| onSelectionChange              | func                    | `selection` => ...` You can use `onSelectionChange` it in pair with `onResourceChildrenChange` |
| onResourceItemClick            | func                    | `({ event, number, rowData }) => ...`                                                          |
| onResourceItemDoubleClick      | func                    | `({ event, number, rowData }) => ...`                                                          |
| onResourceItemRightClick       | func                    | `({ event, number, rowData }) => ...`                                                          |

### Connectors

Connector is a bridge between server API and `@opuscapita/react-filemanager`.

> NOTE: Filemanager Connector API and related props are not documented while API isn't stabilized.

**Available connectors:**

[connector-node-v1 source](https://github.com/OpusCapita/filemanager/tree/master/packages/connector-node-v1)
[connector-google-drive-v2 source](https://github.com/OpusCapita/filemanager/tree/master/packages/connector-google-drive-v2)

You can write you own custom connectors (documentation on how to do it will appear later).

### Types

#### Resource

`resource` is a current directory resource definition.

`resource` object schema can be various. It depends on **connector** implementation.

Resource example for **connector-node-v1**:

```
{
    "capabilities": {
        "canListChildren": true,
        "canAddChildren": true,
        "canRemoveChildren": true,
        "canDelete": false,
        "canRename": false,
        "canCopy": false,
        "canEdit": false,
        "canDownload": false
    },
    "createdTime": 1515854279676,
    "id": "Lw",
    "modifiedTime": 1515854279660,
    "name": "Customization area",
    "type": "dir",
    "parentId": null
}
```

#### Resource children

`resourceChildren` is an array of `resource`s.

In **FileNavigator** its a files and folders list of current `resource`.

#### Resource location

`resourceLocation` is an array of `resources`s.

Its an array of current `resource` ancestors (parents).

For **Massive Attack** folder in **Customization area => Music => Massive Attack** folders hierarchy `resourceLocation` can have such stucture:

```
[
    {
        "capabilities": { ... },
        "createdTime": 1515858963105,
        "id": "Lw",
        "modifiedTime": 1515858963105,
        "name": "Customization area",
        "type": "dir",
        "parentId": null
    },
    {
        "capabilities": { ... },
        "createdTime": 1515858970729,
        "id": "L011c2lj",
        "modifiedTime": 1515858970729,
        "name": "Music",
        "type": "dir",
        "parentId": "Lw"
    },
    {
        "capabilities": { ... },
        "createdTime": 1515858970729,
        "id": "L011c2ljL01hc3NpdmUgQXR0YWNr",
        "modifiedTime": 1515858970729,
        "name": "Massive Attack",
        "type": "dir",
        "parentId": "L011c2lj"
    }
]
```

#### Selection

`selection` is an array of selected resource `id`s.

`selection` example:

```
["L0ltYWdlcw","L01pc2M","L011c2lj","L1NvdW5k","L1ZpZGVv"]
```

### Code Example

```
<div>
  {/*NODE_JS_EXAMPLE*/}

  <div style={{ height: '70vh', minWidth: '320px', flex: '1', marginBottom: '15px' }}>
    <FileNavigator
      api={window.connectors.nodeV1.api}
      apiOptions={{
        ...window.connectors.nodeV1.apiOptions,
        apiRoot: `${window.env.SERVER_URL}`,
        locale: 'en'
      }}
      capabilities={(apiOptions, actions) => ([
        ...(window.connectors.nodeV1.capabilities(apiOptions, actions)),
        ({
          id: 'custom-button',
          icon: {
            svg: '<svg viewBox="0 0 120 120" version="1.1"><circle cx="60" cy="60" r="50"></circle></svg>'
          },
          label: 'Custom Button',
          shouldBeAvailable: () => true,
          availableInContexts: ['toolbar'],
          handler: () => alert('Custom button click')
        })
      ])}
      initialResourceId={_scope.state.nodeInitId}
      listViewLayout={window.connectors.nodeV1.listViewLayout}
      viewLayoutOptions={window.connectors.nodeV1.viewLayoutOptions}
      onResourceChange={
        resource => console.log('onResourceChange', resource)
      }
      onResourceChildrenChange={
        resourceChildren => console.log('onResourceChildrenChange', resourceChildren)
      }
      onResourceLocationChange={
        resourceLocation => console.log('onResourceLocationChange', resourceLocation)
      }
      onSelectionChange={
        selection => console.log('onSelectionChange', selection)
      }
      onResourceItemClick={
        ({ event, number, rowData }) => console.log('onResourceItemClick', event, number, rowData)
      }
      onResourceItemDoubleClick={
        ({ event, number, rowData }) => console.log('onResourceItemDoubleClick', event, number, rowData)
      }
      onResourceItemRightClick={
        ({ event, number, rowData }) => console.log('onResourceItemRightClick', event, number, rowData)
      }
    />
  </div>
</div>
```

### Component Name

FileNavigator

### License

Apache License Version 2.0
