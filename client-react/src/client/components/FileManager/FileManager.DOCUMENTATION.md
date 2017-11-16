### Synopsis

FileManager is 
*Write here a short introduction and/or overview that explains **what** component is.*

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| demoProp                       | string                  | Write a description of the property                         |

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
        api={_scope.connectors.nodejs_v1.api}
        apiOptions={{
          ..._scope.connectors.nodejs_v1.apiOptions,
          apiRoot: `${window.env.SERVER_URL}/api`
        }}
        capabilities={_scope.connectors.nodejs_v1.capabilities}
        initialResourceId={_scope.state.nodejsInitId}
        listViewLayout={_scope.connectors.nodejs_v1.listViewLayout}
        viewLayoutOptions={_scope.connectors.nodejs_v1.viewLayoutOptions}
        signInRenderer={() => (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          </div>
        )}
        onLocationChange={_scope.handleNodejsLocationChange}
      />
      
      {/* Use Google Drive API v2 connector */}
      <FileNavigator
        id="google_drive_filemanager"
        api={_scope.connectors.google_drive_v2.api}
        apiOptions={{
          CLIENT_ID: window.env.CLIENT_ID,
          API_KEY: window.env.API_KEY,
          DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/drive/v2/rest'],
          SCOPES: 'https://www.googleapis.com/auth/drive'
        }}
        capabilities={_scope.connectors.google_drive_v2.capabilities}
        initialResourceId="root"
        listViewLayout={_scope.connectors.google_drive_v2.listViewLayout}
        viewLayoutOptions={_scope.connectors.google_drive_v2.viewLayoutOptions}
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

