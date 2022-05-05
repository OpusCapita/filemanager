import PropTypes from 'prop-types';
import React, { Component, Children } from 'react';
import './MultiUserAccessFileManager.less';
import FileNavigator from '../FileNavigator'
import SigninDialog from '../SigninDialog'
import connectorNodeV1 from '@opuscapita/react-filemanager-connector-node-v1';

const api = connectorNodeV1.api;

const apiOptions = {
  ...connectorNodeV1.apiOptions,
  apiRoot: `${window.env.SERVER_URL}`,
  locale: 'en'
}

const propTypes = {
  className: PropTypes.string
};
const defaultProps = {};

export default
class MultiUserAccessFileManager extends Component {

  constructor(props) {
    super(props);
    this.state = { showsignin: true  };
    this.signinDialog = React.createElement(SigninDialog, { ...SigninDialog.defaultProps,
                                                              onSubmit: this.onSignin });
  }

  onSignin = async (username, password) => {
//    console.log('Username:' + username + ' Password:' + password);
    let response = await api.signIn(apiOptions, username, password);
    if (response) {
      this.setState( () => ({showsignin: false}));
    } else {
      return 'Invalid username or password.'
    }
  }

  onSignout = async () => {
    await api.signOut(apiOptions);
    this.setState( () => ({showsignin: true}));
  }

  render() {
    const { children, className, ...restProps } = this.props;
    const { showsignin } = this.state;

    return (  
      <div data-test-id="filemanager" className={`oc-fm--file-manager ${className || ''}`} {...restProps}>
        <div className="oc-fm--file-manager__navigators">
          <div key="0" className="oc-fm--file-manager__navigator">
            <FileNavigator
              id="filemanager-1"
              api={connectorNodeV1.api}
              apiOptions={apiOptions}
              capabilities={(apiOptions, actions) => ([
                ...(connectorNodeV1.capabilities(apiOptions, actions)),
                ({
                  id: 'signout-button',
                  icon: {
                    svg: '<svg  xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" focusable="false"><path d="M20.17 31.17L23 34l10-10-10-10-2.83 2.83L25.34 22H6v4h19.34l-5.17 5.17zM38 6H10c-2.21 0-4 1.79-4 4v8h4v-8h28v28H10v-8H6v8c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V10c0-2.21-1.79-4-4-4z"/></svg>'
                  },
                  label: 'Signout',
                  shouldBeAvailable: () => true,
                  availableInContexts: ['toolbar'],
                  handler: this.onSignout
                })
              ])}
              signInRenderer={ showsignin ? () => this.signinDialog : null}
              listViewLayout={connectorNodeV1.listViewLayout}
              viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
            />
          </div>
        </div>
      </div>
    );
  }
}

MultiUserAccessFileManager.propTypes = propTypes;
MultiUserAccessFileManager.defaultProps = defaultProps;
