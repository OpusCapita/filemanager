import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './Toolbar.less';

const propTypes = {
  items: PropTypes.array,
  newButtonItems: PropTypes.array

};
const defaultProps = {
  items: [],
  newButtonItems: []
};

export default
class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="oc-fm--toolbar">
      </div>
    );
  }
}

Toolbar.propTypes = propTypes;
Toolbar.defaultProps = defaultProps;
