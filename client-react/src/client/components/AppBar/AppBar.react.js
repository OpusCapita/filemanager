import React, { Component, PropTypes } from 'react';
import './AppBar.less';

const propTypes = {};
const defaultProps = {};

export default
class AppBar extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="app-bar">
      </div>
    );
  }
}

AppBar.propTypes = propTypes;
AppBar.defaultProps = defaultProps;
