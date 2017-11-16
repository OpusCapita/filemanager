import PropTypes from 'prop-types';
import React, { Component, Children } from 'react';
import './ContextMenu.less';
import { ContextMenu as Menu } from "react-contextmenu";

const propTypes = {
  triggerId: PropTypes.string
};
const defaultProps = {
  triggerId: ''
};

export default
class ContextMenu extends Component {
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
