import PropTypes from 'prop-types';
import React, { Component, Children } from 'react';
import './ContextMenu.less';
import { ContextMenu as Menu } from "react-contextmenu";
import Portal from 'react-portal';

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
      <Portal isOpened={true}>
        <div className="oc-fm--context-menu">
          <Menu
            id={triggerId}
            className="oc-fm--context-menu__content"
            {...restProps}
          >
            {children}
          </Menu>
        </div>
      </Portal>
    );
  }
}

ContextMenu.propTypes = propTypes;
ContextMenu.defaultProps = defaultProps;
