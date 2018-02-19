import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './Notifications.less';
import Notification from '../Notification';

const propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string
};
const defaultProps = {
  notifications: [],
  className: ''
};

export default
class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    let { notifications, className } = this.props;

    let notificationsElement = notifications.map((notification, i) => {
      let props = {
        ...notification,
        children: (notification.children || []).map(o => ({ ...o.element, key: o.element.id }))
      };

      return (
        <div key={i} className="oc-fm--notifications__item">
          <Notification {...props} />
        </div>
      );
    });

    return (
      <div className={`oc-fm--notifications ${className || ''}`}>
        {notificationsElement}
      </div>
    );
  }
}

Notifications.propTypes = propTypes;
Notifications.defaultProps = defaultProps;
