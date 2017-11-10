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

<div style={{ display: 'flex', flexWrap: 'wrap' }}>

  {/*NODE_JS_EXAMPLE*/}
  
  <div style={{ height: '70vh', minWidth: '320px', flex: '1', marginBottom: '15px' }}>
    <FileNavigator
      api={_scope.connectors.nodejs_v1.api}
      apiOptions={{
        apiRoot: `${window.env.SERVER_URL}/api`
      }}
      capabilities={_scope.connectors.nodejs_v1.capabilities}
      initialResourceId={'XA'}
      listViewLayout={_scope.connectors.nodejs_v1.listViewLayout}
      viewLayoutOptions={_scope.connectors.nodejs_v1.viewLayoutOptions}
      signInRenderer={() => (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        </div>
      )}
    />
  </div>
  

  {/*GOOGLE_DRIVE_EXAMPLE*/}
  
  <div style={{ height: '70vh', minWidth: '320px', flex: '1', marginBottom: '15px' }}>
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
  </div>

</div>
  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
    <strong style={{ marginRight: '8px' }}>Google Drive</strong>
    <button type="button" onClick={window.googleDriveSignIn} style={{ marginRight: '8px' }}>
      Sign in
    </button>
    <button type="button" onClick={window.googleDriveSignOut}>
      Sign out
    </button>
  </div>
</div>
```

### Component Name

FileNavigator

### License

Licensed by © 2017 OpusCapita

