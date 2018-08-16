import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './DropdownMenuItem.less';
import Svg from '@opuscapita/react-svg/lib/SVG';

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
    const { icon, children, ...restProps } = this.props;

    const iconElement = icon ? (
      <Svg
        className="oc-fm--dropdown-menu-item__icon"
        svg={icon.svg}
        style={{ fill: icon.fill || 'rgba(0, 0, 0, 0.72)' }}
      />
    ) : null;

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
