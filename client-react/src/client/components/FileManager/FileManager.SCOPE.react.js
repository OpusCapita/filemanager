/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';
import connectors from '../../connectors';
import FileNavigator from '../FileNavigator';

window.FileNavigator = FileNavigator;

function requireAll(requireContext) {
  return requireContext.keys().map(key => ({
    name: key.replace(/(\.less$|^\.\/)/gi, ''),
    css: requireContext(key)
  }));
}

let themes = requireAll(require.context('../themes', true, /.*\.less$/));

@showroomScopeDecorator
export default
class FileManagerScope extends Component {
  constructor(props) {
    super(props);
    this.state = {
      themeClassName: 'oc-fm--file-manager--default-theme'
    };

    this.connectors = connectors;

    window.googleDriveSignIn = this.googleDriveSignIn.bind(this);
    window.googleDriveSignOut = this.googleDriveSignOut.bind(this);
  }

  googleDriveSignIn() {
    connectors.google_drive_v2.api.signIn();
  }

  googleDriveSignOut() {
    connectors.google_drive_v2.api.signOut();
  }

  handleThemeChange = (e) => {
    let themeName = e.target.value;
    console.log('tn', themeName);
    let themeClassName = `oc-fm--file-manager--${themeName}-theme`;
    this.setState({ themeClassName });
  }

  render() {
    return (
      <div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Choose theme:</strong>
          <select onChange={this.handleThemeChange} style={{ marginLeft: '12px' }}>
            {themes.map((theme) => (
              <option key={theme.name}>{theme.name}</option>
            ))}
          </select>
        </div>

        <DragDropContextProvider backend={HTML5Backend}>
          {this._renderChildren()}
        </DragDropContextProvider>
      </div>
    );
  }
}

FileManagerScope.contextTypes = {
  i18n: PropTypes.object
};
FileManagerScope.childContextTypes = {
  i18n: PropTypes.object
};
