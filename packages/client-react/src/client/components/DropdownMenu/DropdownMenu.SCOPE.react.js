/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/
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

  handleToggle = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    return (
      <div>
        <button onClick={this.handleToggle}>Toggle context menu</button>
        {this._renderChildren()}
      </div>
    );
  }
}
