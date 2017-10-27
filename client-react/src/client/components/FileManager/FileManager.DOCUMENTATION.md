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

<div style={{ display: 'flex', flexWrap: 'wrap' }}>

  {/*NODE_JS_EXAMPLE*/}
  <div style={{ height: '480px', minWidth: '320px', flex: '1', marginBottom: '15px' }}>
    <FileManager
      api={_scope.apis.nodejs_v1}
      apiOptions={{
        apiRoot: 'http://localhost:3020/api'
      }}
      apiVersion="nodejs_v1"
      dateTimePattern="YYYY-MM-DD HH:mm:ss"
      initialResourceId={''}
      locale="en"
    />
  </div>
  
  {/*GOOGLE_DRIVE_EXAMPLE*/}
  
  {/*GOOGLE_DRIVE_AUTH_OPTIONS*/}
  <span style={{ display: 'none' }}>
  {window.googleDriveApiInitOptions = JSON.stringify({
    ...window.env,
    DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/drive/v2/rest'],
    SCOPES: 'https://www.googleapis.com/auth/drive.metadata.readonly'
  }, null, 4)}
  </span>
  
  <div style={{ height: '480px', minWidth: '320px', flex: '1', marginBottom: '15px' }}>
    <FileManager
      api={_scope.apis.google_drive_v2}
      apiOptions={JSON.parse(window.googleDriveApiInitOptions)}
      apiVersion="google_drive_v2"
      dateTimePattern="YYYY-MM-DD HH:mm:ss"
      initialResourceId={''}
      locale="en"
      signInRenderer={() => (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <strong style={{ marginBottom: '12px' }}>Google Drive</strong>
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

FileManager

### License

Licensed by © 2017 OpusCapita

