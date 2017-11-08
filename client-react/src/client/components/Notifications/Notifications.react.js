import React, { Component, PropTypes } from 'react';
import './Notifications.less';

const propTypes = {};
const defaultProps = {};

export default
class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="notifications">
      </div>
    );
  }
}

Notifications.propTypes = propTypes;
Notifications.defaultProps = defaultProps;
