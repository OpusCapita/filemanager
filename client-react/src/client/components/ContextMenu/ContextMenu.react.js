import PropTypes from 'prop-types';
import React, { Component, Children } from 'react';
import './ContextMenu.less';
import { ContextMenu as Menu } from "react-contextmenu";
import rawToReactElement from '../raw-to-react-element';

const propTypes = {
  triggerId: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({
      elementType: PropTypes.string,
      elementProps: PropTypes.object
    })),
    PropTypes.arrayOf(PropTypes.node)
  ])
};
const defaultProps = {
  triggerId: '',
  children: []
};

export default
class ContextMenu extends Component {
  render() {
    let { children, triggerId, ...restProps } = this.props;

    let childrenElement = children.map((rawChild, i) => {
      return rawToReactElement({ ...rawChild }, i);
    });

    return (
      <div className="oc-fm--context-menu">
        <Menu
          id={triggerId}
          className="oc-fm--context-menu__content"
          {...restProps}
        >
          {childrenElement}
        </Menu>
      </div>
    );
  }
}

ContextMenu.propTypes = propTypes;
ContextMenu.defaultProps = defaultProps;
