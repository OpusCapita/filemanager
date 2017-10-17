import React, { Component, PropTypes } from 'react';
import './TreeViewItem.less';

const propTypes = {};
const defaultProps = {};

export default
class TreeViewItem extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="tree-view-item">
      </div>
    );
  }
}

TreeViewItem.propTypes = propTypes;
TreeViewItem.defaultProps = defaultProps;
