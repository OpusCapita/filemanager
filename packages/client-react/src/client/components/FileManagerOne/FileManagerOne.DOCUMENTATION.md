See [FileNavigator documentation and example](https://opuscapita-mk8s-cluster-1.westeurope.cloudapp.azure.com/filemanager/master/?currentComponentName=FileNavigator&maxContainerWidth=100%25&showSidebar=true)

This module was created for testing in IE11 FileNavigator for nodeV1 API.

**TODO - fix IE11 issues, then delete it**

### Code Example

```
<div>
  <div
    style={{ 
      height: '70vh',
      minWidth: '320px',
      flex: '1',
      padding: '12px',
      backgroundColor: '#f5f5f5'
  }}>
    <FileManagerOne className={_scope.state.themeClassName}>
    
      {/* Use NodeJS API v1 connector */}
      <FileNavigator
        id="cusomization-area"
        api={_scope.connectors.nodeV1.api}
        apiOptions={{
          ..._scope.connectors.nodeV1.apiOptions,
          apiRoot: `${window.env.SERVER_URL}`,
          locale: 'en' // 'en' / 'de'
        }}
        capabilities={_scope.connectors.nodeV1.capabilities}
        initialResourceId={_scope.state.nodejsInitId}
        listViewLayout={_scope.connectors.nodeV1.listViewLayout}
        viewLayoutOptions={{
          ..._scope.connectors.nodeV1.viewLayoutOptions,
          locale: 'en' // 'en' / 'de'
        }}
        signInRenderer={() => (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          </div>
        )}
        onLocationChange={_scope.handleNodejsLocationChange}
      />

    </FileManagerOne>
  </div>
</div>
```

### Component Name

FileManagerOne

### License

Apache License Version 2.0

