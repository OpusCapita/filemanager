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

    this.state = {
      nodejsInitPath: '/',
      nodejsInitId: ''
    };
  }

  async componentDidMount() {
    await this.handleNodejsInitPathChange('');
  }

  handleNodejsLocationChange = (resourceLocation) => {
    let resourceLocationString = '/' + resourceLocation.slice(1, resourceLocation.length).map(o => o.name).join('/');
    this.setState({
      nodejsInitPath: resourceLocationString,
      nodejsInitId: resourceLocation[resourceLocation.length - 1].id
    });
  }

  handleNodejsInitPathChange = async (path) => {
    this.setState({
      nodejsInitPath: path || '/'
    });

    let apiOptions = {
      apiRoot: `${window.env.SERVER_URL}/api`
    };

    let nodejsInitId = await connectors.nodejs_v1.api.getIdForPath(apiOptions, path || '/');
    if (nodejsInitId) {
      this.setState({ nodejsInitId });
    }
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
