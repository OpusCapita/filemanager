import React, { Component, PropTypes } from 'react';
import './ContextMenu.less';

const propTypes = {};
const defaultProps = {};

export default
class ContextMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="context-menu">
      </div>
    );
  }
}

ContextMenu.propTypes = propTypes;
ContextMenu.defaultProps = defaultProps;
