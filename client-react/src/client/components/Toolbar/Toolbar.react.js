import React, { Component, PropTypes } from 'react';
import './Toolbar.less';

const propTypes = {};
const defaultProps = {};

export default
class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="toolbar">
      </div>
    );
  }
}

Toolbar.propTypes = propTypes;
Toolbar.defaultProps = defaultProps;
