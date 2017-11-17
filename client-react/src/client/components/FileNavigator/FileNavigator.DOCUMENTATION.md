### Synopsis

FileNavigator is
*Write here a short introduction and/or overview that explains **what** component is.*

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| demoProp                       | string                  | Write a description of the property                         |

### Code Example

```
<div>
  {/*NODE_JS_EXAMPLE*/}
  
  <div style={{ height: '70vh', minWidth: '320px', flex: '1', marginBottom: '15px' }}>
    <FileNavigator
      api={_scope.connectors.nodejs_v1.api}
      apiOptions={{
        ..._scope.connectors.nodejs_v1.apiOptions,
        apiRoot: `${window.env.SERVER_URL}/api`
      }}
      capabilities={_scope.connectors.nodejs_v1.capabilities}
      initialResourceId={_scope.state.nodeInitId}
      listViewLayout={_scope.connectors.nodejs_v1.listViewLayout}
      viewLayoutOptions={_scope.connectors.nodejs_v1.viewLayoutOptions}
    />
  </div>
</div>
```

### Component Name

FileNavigator

### License

Licensed by © 2017 OpusCapita

