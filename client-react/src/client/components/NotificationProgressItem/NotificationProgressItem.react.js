import React, { Component, PropTypes } from 'react';
import './NotificationProgressItem.less';
import ProgressIcon from '../ProgressIcon';

const propTypes = {};
const defaultProps = {};

export default
class NotificationProgressItem extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="oc-fm--notification-progress-item">
      </div>
    );
  }
}

NotificationProgressItem.propTypes = propTypes;
NotificationProgressItem.defaultProps = defaultProps;
