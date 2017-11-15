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

@showroomScopeDecorator
export default
class FileNavigatorScope extends Component {
  constructor(props) {
    super(props);
    this.connectors = connectors;
    window.googleDriveSignIn = this.googleDriveSignIn.bind(this);
    window.googleDriveSignOut = this.googleDriveSignOut.bind(this);
  }

  getIcon(name) {
    return this.state.icons.filter(icon => icon.name === name)[0].svg;
  }

  googleDriveSignIn() {
    connectors.google_drive_v2.api.signIn();
  }

  googleDriveSignOut() {
    connectors.google_drive_v2.api.signOut();
  }

  render() {
    if (this.nodeInitId === '') {
      return (
        <div></div>
      )
    }

    return (
      <div>
        <DragDropContextProvider backend={HTML5Backend}>
          {this._renderChildren()}
        </DragDropContextProvider>
      </div>
    );
  }
}

FileNavigatorScope.contextTypes = {
  i18n: PropTypes.object
};
FileNavigatorScope.childContextTypes = {
  i18n: PropTypes.object
};
