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
  <MenuItem data={{}} onClick={() => console.log('click')}>
    <div className="oc-fm--context-menu__item">
      <SVG className="oc-fm--context-menu__item-icon" svg={_scope.getIcon('edit')} />
      <span>Edit</span>
    </div>
  </MenuItem>

  <MenuItem divider={true} />

  <MenuItem data={{}} onClick={() => console.log('click')}>
    <div className="oc-fm--context-menu__item">
      <SVG className="oc-fm--context-menu__item-icon" svg={_scope.getIcon('arrow_forward')} />
      <span>Move to…</span>
    </div>
  </MenuItem>

  <MenuItem data={{}} onClick={() => console.log('click')}>
    <div className="oc-fm--context-menu__item">
      <SVG className="oc-fm--context-menu__item-icon" svg={_scope.getIcon('content_copy')} />
      <span>Copy to…</span>
    </div>
  </MenuItem>
  
  <MenuItem data={{}} onClick={() => console.log('click')}>
    <div className="oc-fm--context-menu__item">
      <SVG className="oc-fm--context-menu__item-icon" svg={_scope.getIcon('title')} />
      <span>Rename…</span>
    </div>
  </MenuItem>

  <MenuItem data={{}} onClick={() => console.log('click')}>
    <div className="oc-fm--context-menu__item">
      <SVG className="oc-fm--context-menu__item-icon" svg={_scope.getIcon('archive')} />
      <span>Archive</span>
    </div>
  </MenuItem>

  <MenuItem data={{}} onClick={() => console.log('click')}>
    <div className="oc-fm--context-menu__item oc-fm--context-menu__item--disabled">
      <SVG className="oc-fm--context-menu__item-icon" svg={_scope.getIcon('unarchive')} />
      <span>Unarchive</span>
    </div>
  </MenuItem>
  
  <MenuItem divider={true} />
  
  <MenuItem data={{}} onClick={() => console.log('click')}>
    <div className="oc-fm--context-menu__item">
      <SVG className="oc-fm--context-menu__item-icon" svg={_scope.getIcon('info')} />
      <span>View details</span>
    </div>
  </MenuItem>

  <MenuItem data={{}} onClick={() => console.log('click')}> 
    <div className="oc-fm--context-menu__item">
      <SVG className="oc-fm--context-menu__item-icon" svg={_scope.getIcon('file_download')} />
      <span>Download</span>
    </div>
  </MenuItem>

  <MenuItem divider={true} />

  <MenuItem data={{}} onClick={() => console.log('click')}>
    <div className="oc-fm--context-menu__item">
      <SVG className="oc-fm--context-menu__item-icon" svg={_scope.getIcon('delete')} />
      <span>Remove</span>
    </div>
  </MenuItem>
</ContextMenu>
```

### Component Name

ContextMenu

### License

Licensed by © 2017 OpusCapita

