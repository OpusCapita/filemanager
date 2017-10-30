/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import React, { Component, PropTypes } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';
import connectors from '../../connectors';

@showroomScopeDecorator
export default
class FileNavigatorScope extends Component {
  constructor(props) {
    super(props);
    this.state = {};

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

  render() {
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
