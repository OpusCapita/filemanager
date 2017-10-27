import React, { Component, PropTypes, Children } from 'react';
import './ContextMenu.less';
import { ContextMenu as Menu, MenuItem } from "react-contextmenu";

const propTypes = {
  triggerId: PropTypes.string
};
const defaultProps = {
  triggerId: ''
};

export default
class ContextMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    let { children, triggerId, ...restProps } = this.props;
    return (
      <div className="oc-fm--context-menu">
        <Menu
          id={triggerId}
          className="oc-fm--context-menu__content"
          {...restProps}
        >
          {children}
        </Menu>
      </div>
    );
  }
}

ContextMenu.propTypes = propTypes;
ContextMenu.defaultProps = defaultProps;
