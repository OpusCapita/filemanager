import React, { Component, PropTypes } from 'react';
import './GridViewContainer.less';

const propTypes = {};
const defaultProps = {};

export default
class GridViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="grid-view-container">
      </div>
    );
  }
}

GridViewContainer.propTypes = propTypes;
GridViewContainer.defaultProps = defaultProps;
