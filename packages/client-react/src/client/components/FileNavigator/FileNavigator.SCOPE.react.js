/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import React, { Component } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';
import connectorNodeV1 from '@opuscapita/react-filemanager-connector-node-v1';

let connectors = {
  nodeV1: connectorNodeV1
};

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

  componentDidMount() {
    this.handleNodejsInitPathChange('')
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

    let nodejsInitId = await connectors.nodeV1.api.getIdForPath(apiOptions, path || '/');

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
