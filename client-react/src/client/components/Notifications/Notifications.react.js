import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './Notifications.less';
import Notification from '../Notification';

const propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object)
};
const defaultProps = {
  notifications: []
};

export default
class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    let { notifications } = this.props;

    let notificationsElement = notifications.map((notification, i) => (
      <div key={i} className="oc-fm--notifications__item">
        <Notification {...notification} />
      </div>
    ));

    return (
      <div className="oc-fm--notifications">
        {notificationsElement}
      </div>
    );
  }
}

Notifications.propTypes = propTypes;
Notifications.defaultProps = defaultProps;
