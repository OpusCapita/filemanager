See [FileNavigator documentation and example](http://opuscapita-filemanager-demo-master.azurewebsites.net/?currentComponentName=FileNavigator&maxContainerWidth=100%25&showSidebar=true)

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
    <FileManager className={_scope.state.themeClassName}>
    
      {/* Use NodeJS API v1 connector */}
      <FileNavigator
        id="cusomization-area"
        api={_scope.connectors.nodeV1.api}
        apiOptions={{
          ..._scope.connectors.nodeV1.apiOptions,
          apiRoot: `${window.env.SERVER_URL}/api`,
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
      
      {/* Use Google Drive API v2 connector */}

      <FileNavigator
        id="google_drive_filemanager"
        api={_scope.connectors.googleDriveV2.api}
        apiOptions={{
          CLIENT_ID: window.env.CLIENT_ID,
          API_KEY: window.env.API_KEY,
          DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/drive/v2/rest'],
          SCOPES: 'https://www.googleapis.com/auth/drive',
          locale: 'de'
        }}
        capabilities={_scope.connectors.googleDriveV2.capabilities}
        initialResourceId="root"
        listViewLayout={_scope.connectors.googleDriveV2.listViewLayout}
        viewLayoutOptions={_scope.connectors.googleDriveV2.viewLayoutOptions}
        signInRenderer={() => (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <strong
              style={{
                marginBottom: '12px',
                textShadow: 'rgba(0, 0, 0, 0.25) 0px 2px 16px, rgba(0, 0, 0, 0.15) 0px 1px 4px'
              }}
            >
              Google Drive</strong>
            <button
              className="btn btn-primary"
              type="button"
              onClick={window.googleDriveSignIn}
              style={{
                marginBottom: '8px',
                border: 'none',
                borderRadius: '2px',
                boxShadow: '0 2px 16px rgba(0, 0, 0, 0.25), 0px 1px 4px rgba(0, 0, 0, 0.15)'
              }}
            >
              Sign in
            </button>
          </div>
        )}
      />

    </FileManager>
  </div>
</div>
```

### Component Name

FileManager

### License

Licensed by © 2017 OpusCapita

