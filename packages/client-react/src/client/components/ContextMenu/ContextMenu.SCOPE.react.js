/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import React, { Component } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import { ContextMenuTrigger } from "react-contextmenu";
import ContextMenuItem from '../ContextMenuItem';

window.ContextMenuItem = ContextMenuItem;

function requireAll(requireContext) {
  return requireContext.keys().map(key => ({
    name: key.replace(/(\.svg$|^\.\/)/gi, ''),
    svg: requireContext(key)
  }));
}

let icons = requireAll(require.context('@opuscapita/svg-icons/lib', true, /.*\.svg$/));

@showroomScopeDecorator
export default
class ContextMenuScope extends Component {
  constructor(props) {
    super(props);
    this.state = { icons };
  }

  getIcon(name) {
    return this.state.icons.filter(icon => icon.name === name)[0].svg;
  }


  render() {
    return (
      <div>
        <ContextMenuTrigger id="oc-fm--contextmenu-sample">
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: '#fff',
              backgroundColor: 'rgba(0, 0, 0, 0.72)'
            }}
          >
            Right click here
          </div>
        </ContextMenuTrigger>
        {this._renderChildren()}
      </div>
    );
  }
}
