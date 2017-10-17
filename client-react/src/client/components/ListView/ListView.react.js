import React, { Component, PropTypes } from 'react';
import './ListView.less';

const propTypes = {};
const defaultProps = {};

export default
class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="list-view">
      </div>
    );
  }
}

ListView.propTypes = propTypes;
ListView.defaultProps = defaultProps;
