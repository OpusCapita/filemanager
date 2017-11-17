/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
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
      nodejsInitPath: '/',
      nodejsInitId: '',
      themeClassName: 'oc-fm--file-manager--default-theme'
    };

    this.connectors = connectors;

    window.googleDriveSignIn = this.googleDriveSignIn.bind(this);
    window.googleDriveSignOut = this.googleDriveSignOut.bind(this);
  }

  async componentDidMount() {
    await this.handleNodejsInitPathChange('');
  }

  googleDriveSignIn() {
    connectors.google_drive_v2.api.signIn();
  }

  googleDriveSignOut() {
    connectors.google_drive_v2.api.signOut();
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

    let nodejsInitId = await connectors.nodejs_v1.api.getIdForPath(apiOptions, path || '/');
    if (nodejsInitId) {
      this.setState({ nodejsInitId });
    }
  }

  render() {
    let { nodejsInitPath, nodejsInitId } = this.state;
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
              <strong>nodejs_v1 API</strong>
            </div>
            <strong style={{ marginRight: '12px' }}>Initial path:</strong>
            <input
              value={nodejsInitPath}
              onChange={(e) => this.handleNodejsInitPathChange(e.target.value)}
              style={{ padding: '0 4px', flex: '1' }}
            />
          </div>

          <div style={{ width: '50%', display: 'flex', paddingRight: '12px', alignItems: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                marginRight: '12px',
                borderRadius: '2px'
              }}
            >
              <strong>google_drive_v2 API</strong>
            </div>
            <div
              style={{ display: 'inline-flex', justifyContent: 'flex-end', alignItems: 'center' }}
            >
              <button type="button" onClick={window.googleDriveSignIn} style={{ marginRight: '8px' }}>
                Sign in
              </button>
              <button type="button" onClick={window.googleDriveSignOut}>
                Sign out
              </button>
            </div>
          </div>

        </div>

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
