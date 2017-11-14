import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './DropdownMenuItem.less';
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
class DropdownMenuItem extends Component {
  render() {
    let { icon, children, ...restProps } = this.props;

    let iconElement = icon ? (
      <SVG
        className="oc-fm--dropdown-menu-item__icon"
        svg={icon.svg}
        style={{ fill: icon.fill || '#333' }}
      />
    ): null;

    return (
      <div className="oc-fm--dropdown-menu-item" {...restProps}>
        {iconElement}
        {children}
      </div>
    );
  }
}

DropdownMenuItem.propTypes = propTypes;
DropdownMenuItem.defaultProps = defaultProps;
