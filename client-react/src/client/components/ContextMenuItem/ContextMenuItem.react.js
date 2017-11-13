import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './ContextMenuItem.less';
import { MenuItem } from "react-contextmenu";
import DropdownMenuItem from '../DropdownMenuItem';

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
    let { icon, children, ...restProps } = this.props;

    return (
      <MenuItem>
        <DropdownMenuItem icon={icon} {...restProps}>
          {children}
        </DropdownMenuItem>
      </MenuItem>
    );
  }
}

ContextMenuItem.propTypes = propTypes;
ContextMenuItem.defaultProps = defaultProps;
