/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import DropdownMenuItem from '../DropdownMenuItem';

window.DropdownMenuItem = DropdownMenuItem;

@showroomScopeDecorator
export default
class DropdownMenuScope extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  toggle = () => {
    this.setState({ show: !this.state.show });
  }

  render() {
    return (
      <div>
        <button onClick={this.toggle}>Toggle context menu</button>
        {this._renderChildren()}
      </div>
    );
  }
}

DropdownMenuScope.contextTypes = {
  i18n: PropTypes.object
};
DropdownMenuScope.childContextTypes = {
  i18n: PropTypes.object
};
