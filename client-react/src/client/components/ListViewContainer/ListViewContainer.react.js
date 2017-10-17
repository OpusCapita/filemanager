import React, { Component, PropTypes } from 'react';
import './ListViewContainer.less';

const propTypes = {};
const defaultProps = {};

export default
class ListViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="list-view-container">
      </div>
    );
  }
}

ListViewContainer.propTypes = propTypes;
ListViewContainer.defaultProps = defaultProps;
