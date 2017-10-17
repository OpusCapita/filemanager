import React, { Component, PropTypes } from 'react';
import './GridView.less';

const propTypes = {};
const defaultProps = {};

export default
class GridView extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="grid-view">
      </div>
    );
  }
}

GridView.propTypes = propTypes;
GridView.defaultProps = defaultProps;
