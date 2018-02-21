import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './ContextMenu.less';
import { ContextMenu as Menu } from "react-contextmenu";
import ContextMenuItem from '../ContextMenuItem';

const propTypes = {
  triggerId: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.shape({
      svg: PropTypes.string,
      fill: PropTypes.string
    }),
    label: PropTypes.string,
    onClick: PropTypes.func
  }))
};
const defaultProps = {
  triggerId: '',
  items: []
};

export default
class ContextMenu extends Component {
  render() {
    let { items, triggerId, ...restProps } = this.props;

    let childrenElement = items.map((item, i) => (
      <ContextMenuItem
        key={i}
        onClick={item.onClick || (() => {})}
        icon={item.icon}
      >
        <span>{item.label}</span>
      </ContextMenuItem>
    ));

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
