import React, { Component, PropTypes } from 'react';
import './AddressBar.less';

const propTypes = {};
const defaultProps = {};

export default
class AddressBar extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="address-bar">
      </div>
    );
  }
}

AddressBar.propTypes = propTypes;
AddressBar.defaultProps = defaultProps;
