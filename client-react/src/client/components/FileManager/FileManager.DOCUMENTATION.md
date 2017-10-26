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
{/*
<div style={{ height: '480px' }}>
  <FileManager
    apiRoot={'http://localhost:3020/api'}
    apiVersion="nodejs_v1"
    dateTimePattern="YYYY-MM-DD HH:mm:ss"
    initialResourceId={''}
    locale="en"
  />
</div>
*/}

{/*GOOGLE_DRIVE_EXAMPLE*/}

<div style={{ height: '480px' }}>
  <FileManager
    apiRoot={''}
    apiInitOptions={{
    }}
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

