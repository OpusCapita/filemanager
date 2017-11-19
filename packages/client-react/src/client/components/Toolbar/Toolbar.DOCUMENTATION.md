### Synopsis

Toolbar is 
*Write here a short introduction and/or overview that explains **what** component is.*

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| demoProp                       | string                  | Write a description of the property                         |

### Code Example

```
<Toolbar 
  items={[
    { icon: { svg: _scope.getIcon('create_new_folder')}, label: 'Create folder' },
    { icon: { svg: _scope.getIcon('title')}, label: 'Rename' },
    { icon: { svg: _scope.getIcon('file_download')}, label: 'Download' },
    { icon: { svg: _scope.getIcon('delete')}, label: 'Remove', disabled: true }
  ]}
  newButtonItems={[
    { icon: { svg: _scope.getIcon('create_new_folder')}, label: 'Create folder', disabled: true },
    { icon: { svg: _scope.getIcon('title')}, label: 'Rename' },
    { icon: { svg: _scope.getIcon('file_download')}, label: 'Download' },
    { icon: { svg: _scope.getIcon('delete')}, label: 'Remove' }
  ]}
/>
```

### Component Name

Toolbar

### License

Licensed by © 2017 OpusCapita

