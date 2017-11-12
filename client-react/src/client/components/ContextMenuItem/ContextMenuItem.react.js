import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './ContextMenuItem.less';
import { MenuItem } from "react-contextmenu";
import SVG from '@opuscapita/react-svg/lib/SVG';

const propTypes = {
  icon: PropTypes.shape({
    svg: PropTypes.string,
    fill: PropTypes.string
  })
};
const defaultProps = {
  icon: null
};

export default
class ContextMenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    let { icon, ...restProps } = this.props;

    let iconElement = icon ? (
      <SVG
        className="oc-fm--context-menu-item__icon"
        svg={icon.svg}
        style={{ fill: icon.fill || '#333' }}
      />
    ): null;

    return (
      <MenuItem {...restProps}>
        <div className="oc-fm--context-menu-item">
          {iconElement}
          {this.props.children}
        </div>
      </MenuItem>
    );
  }
}

ContextMenuItem.propTypes = propTypes;
ContextMenuItem.defaultProps = defaultProps;
