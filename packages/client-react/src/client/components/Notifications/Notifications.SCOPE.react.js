/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import React, { Component } from 'react';
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

    window.notifUtils.listNotifications = () => console.dir(this.state.notifications);
  }

  handleNotificationsChange = (notifications) => {
    this.setState({ notifications });
  }

  render() {
    return (
      <div>
        <strong>Manipulate notifications:</strong>
        <pre>window.notifUtils.listNotification()</pre>
        <pre>window.notifUtils.addNotification(id, props)</pre>
        <pre>window.notifUtils.updateNotification(id, props)</pre>
        <pre>window.notifUtils.removeNotification(id)</pre>
        <strong>Demo will be updated for easier manipulations later</strong>
        <hr />
        {this._renderChildren()}
      </div>
    );
  }
}
