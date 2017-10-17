import React, { Component, PropTypes } from 'react';
import './TreeView.less';

const propTypes = {};
const defaultProps = {};

export default
class TreeView extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="tree-view">
      </div>
    );
  }
}

TreeView.propTypes = propTypes;
TreeView.defaultProps = defaultProps;
