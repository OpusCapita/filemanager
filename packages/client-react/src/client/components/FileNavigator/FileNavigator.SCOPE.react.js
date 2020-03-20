/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import React, { Component } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import connectorNodeV1 from '@opuscapita/react-filemanager-connector-node-v1';

window.connectors = {
  nodeV1: connectorNodeV1
};

@showroomScopeDecorator
export default
class FileNavigatorScope extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nodejsInitPath: '/',
      nodejsInitId: ''
    };
  }

  componentDidMount() {
    this.handleNodejsInitPathChange('');
  }

  handleNodejsLocationChange = (resourceLocation) => {
    const resourceLocationString = '/' + resourceLocation.slice(1, resourceLocation.length).map(o => o.name).join('/');
    this.setState({
      nodejsInitPath: resourceLocationString,
      nodejsInitId: resourceLocation[resourceLocation.length - 1].id
    });
  }

  handleNodejsInitPathChange = async (path) => {
    this.setState({
      nodejsInitPath: path || '/'
    });

    const apiOptions = {
      apiRoot: `${window.env.SERVER_URL}`
    };

    const nodejsInitId = await window.connectors.nodeV1.api.getIdForPath(apiOptions, path || '/');

    if (nodejsInitId) {
      this.setState({ nodejsInitId });
    }
  }

  render() {
    return (
      <div>
        {this._renderChildren()}
      </div>
    );
  }
}
