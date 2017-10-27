### Synopsis

FileManager is 
*Write here a short introduction and/or overview that explains **what** component is.*

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| demoProp                       | string                  | Write a description of the property                         |

### Code Example

```
{/*NODE_JS_EXAMPLE*/}
<div style={{ height: '480px' }}>
  <FileManager
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

<div style={{ height: '480px', marginTop: '30px' }}>
  <FileManager
    apiOptions={JSON.parse(window.googleDriveApiInitOptions)}
    apiVersion="google_drive_v2"
    dateTimePattern="YYYY-MM-DD HH:mm:ss"
    initialResourceId={''}
    locale="en"
  />
</div>
```

### Component Name

FileManager

### License

Licensed by © 2017 OpusCapita

