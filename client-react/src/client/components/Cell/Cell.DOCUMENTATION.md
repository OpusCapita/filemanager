### Synopsis

Cell is 
*Write here a short introduction and/or overview that explains **what** component is.*

### Props Reference

| Name                           | Type                    | Description                                                 |
| ------------------------------ | :---------------------- | ----------------------------------------------------------- |
| demoProp                       | string                  | Write a description of the property                         |

### Code Example

```
{React.createElement(Cell({
 loading: false,
 getData: ({}, cellProps) => `${cellProps.cellData} world!`
 }), { cellData: 'Hello' })}
```

### Component Name

Cell

### License

Licensed by © 2017 OpusCapita

