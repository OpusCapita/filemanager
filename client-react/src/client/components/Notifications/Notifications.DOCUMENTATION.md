### Synopsis

Notifications is 
*Write here a short introduction and/or overview that explains **what** component is.*

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| demoProp                       | string                  | Write a description of the property                         |

### Code Example

```
<Notifications 
  notifications={_scope.state.notifications}
/>


<Notifications 
  notifications={[
    { 
      id: 'download-1',
      title: 'Downloading 3 elements',
      onHide: () => console.log('hide')
    },
    { 
      id: 'zipping-1',
      title: 'Zipping 3 elements',
      onHide: () => console.log('hide'),
      children: [{
        id: 'item-1',
        element: <div>Zipping item 1</div>
      }]
    },
    { 
      id: 'zipping-2',
      title: 'Zipping 3 elements',
      onHide: () => console.log('hide'),
      children: [{
        id: 'item-1',
        element: <div>Zipping item 1</div>
      }, {
        id: 'item-2',
        element: <div>Zipping item 1</div>
      }, {
        id: 'item-3',
        element: <div>Zipping item 1</div>
      }]
    }
  ]}
/>
```

### Component Name

Notifications

### License

Licensed by © 2017 OpusCapita

