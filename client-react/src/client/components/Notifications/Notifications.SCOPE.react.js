/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import React, { Component, PropTypes } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import utils from './utils';

@showroomScopeDecorator
export default
class NotificationsScope extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: []
    };

    window.notifUtils = {};
    window.notifUtils.addNotification = (id, props) =>
      this.handleNotificationsChange(utils.addNotification(this.state.notifications, id, props));

    window.notifUtils.updateNotification = (id, props) =>
      this.handleNotificationsChange(utils.updateNotification(this.state.notifications, id, props));

    window.notifUtils.removeNotification = (id, props) =>
      this.handleNotificationsChange(utils.removeNotification(this.state.notifications, id, props));
  }

  handleNotificationsChange = (notifications) => {
    this.setState({ notifications });
  }

  render() {
    return (
      <div>
        {this._renderChildren()}
      </div>
    );
  }
}

NotificationsScope.contextTypes = {
  i18n: PropTypes.object
};
NotificationsScope.childContextTypes = {
  i18n: PropTypes.object
};
