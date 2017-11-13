### Synopsis

DropdownMenu is 
*Write here a short introduction and/or overview that explains **what** component is.*

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| demoProp                       | string                  | Write a description of the property                         |

### Code Example

```
<div style={{ position: 'relative' }}>
  <DropdownMenu 
    show={_scope.state.show}
    onHide={_scope.toggle}
  >
  
    <DropdownMenuItem
      icon={{
        svg: `<svg viewBox="0 0 120 120" version="1.1">
          <circle cx="60" cy="60" r="50"/>
        </svg>`, 
        fill: '#333' 
      }}
    >
      <span>Circle</span>
    </DropdownMenuItem>
    
    <DropdownMenuItem
      icon={{
        svg: `<svg viewBox="0 0 120 120" version="1.1">
          <circle cx="60" cy="60" r="50"/>
        </svg>`, 
        fill: '#333' 
      }}
    >
      <span>Circle</span>
    </DropdownMenuItem>
    
    <DropdownMenuItem
      icon={{
        svg: `<svg viewBox="0 0 120 120" version="1.1">
          <circle cx="60" cy="60" r="50"/>
        </svg>`, 
        fill: '#333' 
      }}
    >
      <span>Circle</span>
    </DropdownMenuItem>
  
  </DropdownMenu>
</div>
```

### Component Name

DropdownMenu

### License

Licensed by © 2017 OpusCapita

