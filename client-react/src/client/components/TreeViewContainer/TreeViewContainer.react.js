import React, { Component, PropTypes } from 'react';
import './TreeViewContainer.less';

const propTypes = {};
const defaultProps = {};

export default
class TreeViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="tree-view-container">
      </div>
    );
  }
}

TreeViewContainer.propTypes = propTypes;
TreeViewContainer.defaultProps = defaultProps;
