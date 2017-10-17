import React, { Component, PropTypes } from 'react';
import './GridViewItem.less';

const propTypes = {};
const defaultProps = {};

export default
class GridViewItem extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="grid-view-item">
      </div>
    );
  }
}

GridViewItem.propTypes = propTypes;
GridViewItem.defaultProps = defaultProps;
