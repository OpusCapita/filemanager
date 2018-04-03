/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import React, { Component } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import connectorNodeV1 from '@opuscapita/react-filemanager-connector-node-v1';
import connectorGoogleDriveV2 from '@opuscapita/react-filemanager-connector-google-drive-v2';
import FileNavigator from '../FileNavigator';

window.FileNavigator = FileNavigator;

let connectors = {
  nodeV1: connectorNodeV1,
  googleDriveV2: connectorGoogleDriveV2
};

function requireAll(requireContext) {
  return requireContext.keys().map(key => ({
    name: key.replace(/(\.less$|^\.\/)/gi, ''),
    css: requireContext(key)
  }));
}

let themes = requireAll(require.context('../themes', true, /.*\.less$/));

@showroomScopeDecorator
export default
class FileManagerOneScope extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodejsInitPath: '/',
      nodejsInitId: '',
      themeClassName: 'oc-fm--file-manager--default-theme'
    };

    this.connectors = connectors;

    window.googleDriveSignIn = this.googleDriveSignIn.bind(this);
    window.googleDriveSignOut = this.googleDriveSignOut.bind(this);
  }

  componentDidMount() {
    this.handleNodejsInitPathChange('')
  }

  googleDriveSignIn() {
    connectors.googleDriveV2.api.signIn();
  }

  googleDriveSignOut() {
    connectors.googleDriveV2.api.signOut();
  }

  handleThemeChange = (e) => {
    let themeName = e.target.value;
    let themeClassName = `oc-fm--file-manager--${themeName}-theme`;
    this.setState({ themeClassName });
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
    let { nodejsInitPath } = this.state;
    let nodejsPathChooserElement = (
      <select onChange={this.handleThemeChange} style={{ marginLeft: '12px' }}>
        {themes.map((theme) => (
          <option key={theme.name}>{theme.name}</option>
        ))}
      </select>
    );

    return (
      <div>
        <div style={{ paddingBottom: '12px', borderBottom: '1px solid #f2f2f2' }}>
          <strong>Choose theme:</strong>
          {nodejsPathChooserElement}
        </div>

        {this._renderChildren()}


        <div style={{ display: 'flex', padding: '0 12px 12px', background: '#f5f5f5' }}>

          <div style={{ width: '50%', display: 'flex', paddingRight: '12px', alignItems: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                marginRight: '12px',
                borderRadius: '2px'
              }}
            >
              <strong>nodeV1 API</strong>
            </div>
            <strong style={{ marginRight: '12px' }}>Initial path:</strong>
            <input
              value={nodejsInitPath}
              onChange={(e) => this.handleNodejsInitPathChange(e.target.value)}
              style={{ padding: '0 4px', flex: '1' }}
            />
          </div>
        </div>

      </div>
    );
  }
}
