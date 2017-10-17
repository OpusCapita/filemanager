import React, { Component, PropTypes } from 'react';
import './App.less';

const propTypes = {};
const defaultProps = {};

export default
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="app">
      </div>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;
