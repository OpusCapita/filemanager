### Synopsis

ContextMenu is 
*Write here a short introduction and/or overview that explains **what** component is.*

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| demoProp                       | string                  | Write a description of the property                         |

### Code Example

```
<ContextMenu
  triggerId="oc-fm--contextmenu-sample"
>
  <ContextMenuItem data={{}} onClick={() => console.log('click')} icon={{ svg: _scope.getIcon('edit') }}>
    <span>Edit</span>
  </ContextMenuItem>

  <ContextMenuItem divider={true} />

  <ContextMenuItem data={{}} onClick={() => console.log('click')} icon={{ svg: _scope.getIcon('arrow_forward') }}>
    <span>Move to…</span>
  </ContextMenuItem>

  <ContextMenuItem data={{}} onClick={() => console.log('click')} icon={{ svg: _scope.getIcon('content_copy') }}>
    <span>Copy to…</span>
  </ContextMenuItem>
  
  <ContextMenuItem data={{}} onClick={() => console.log('click')} icon={{ svg: _scope.getIcon('title') }}>
    <span>Rename…</span>
  </ContextMenuItem>

  <ContextMenuItem data={{}} onClick={() => console.log('click')} icon={{ svg: _scope.getIcon('archive') }}>
    <span>Archive</span>
  </ContextMenuItem>

  <ContextMenuItem data={{}} onClick={() => console.log('click')} icon={{ svg: _scope.getIcon('unarchive') }}>
    <span>Unarchive</span>
  </ContextMenuItem>
  
  <ContextMenuItem divider={true} />
  
  <ContextMenuItem data={{}} onClick={() => console.log('click')} icon={{ svg: _scope.getIcon('info') }}>
    <span>View details</span>
  </ContextMenuItem>

  <ContextMenuItem data={{}} onClick={() => console.log('click')} icon={{ svg: _scope.getIcon('file_download') }}> 
    <span>Download</span>
  </ContextMenuItem>

  <ContextMenuItem divider={true} />

  <ContextMenuItem data={{}} onClick={() => console.log('click')} icon={{ svg: _scope.getIcon('delete'), fill: '#dd2515' }}>
    <span>Remove</span>
  </ContextMenuItem>
</ContextMenu>
```

### Component Name

ContextMenu

### License

Licensed by © 2017 OpusCapita

