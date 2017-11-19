### Synopsis

Notification is 
*Write here a short introduction and/or overview that explains **what** component is.*

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| demoProp                       | string                  | Write a description of the property                         |

### Code Example

```
<Notification 
  title="Download 2 files"
  onHide={() => console.log('hide')}
  onCancel={() => console.log('cancel')}
  progressText="Less than minute left"
  cancelButtonText="Cancel"
>
  <div>Notification item 1</div>
  <div>Notification item 2</div>
</Notification>
```

### Component Name

Notification

### License

Licensed by © 2017 OpusCapita

