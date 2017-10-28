import React, { Component, PropTypes } from 'react';
import './LocationBar.less';

const propTypes = {};
const defaultProps = {};

export default
class LocationBar extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="location-bar">
      </div>
    );
  }
}

LocationBar.propTypes = propTypes;
LocationBar.defaultProps = defaultProps;
