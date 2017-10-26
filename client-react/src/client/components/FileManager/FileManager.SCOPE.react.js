/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import React, { Component, PropTypes } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';

@showroomScopeDecorator
export default
class FileManagerScope extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

FileManagerScope.contextTypes = {
  i18n: PropTypes.object
};
FileManagerScope.childContextTypes = {
  i18n: PropTypes.object
};
