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
  <div style={{ height: '480px', minWidth: '320px', flex: '1', padding: '4px' }}>
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
  
  <div style={{ height: '480px', minWidth: '320px', flex: '1', padding: '4px' }}>
    <FileManager
      api={_scope.apis.google_drive_v2}
      apiOptions={JSON.parse(window.googleDriveApiInitOptions)}
      apiVersion="google_drive_v2"
      dateTimePattern="YYYY-MM-DD HH:mm:ss"
      initialResourceId={''}
      locale="en"
    />
  </div>

</div>

<div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
  <button type="button" onClick={_scope.googleDriveSignIn} style={{ marginRight: '8px' }}>
    SignIn Google Drive
  </button>
  <button type="button" onClick={_scope.googleDriveSignOut}>
    SignOut Google Drive
  </button>
</div>

</div>
```

### Component Name

FileManager

### License

Licensed by © 2017 OpusCapita

