import React, { Component, PropTypes } from 'react';
import './AddressBarContainer.less';

const propTypes = {};
const defaultProps = {};

export default
class AddressBarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="address-bar-container">
      </div>
    );
  }
}

AddressBarContainer.propTypes = propTypes;
AddressBarContainer.defaultProps = defaultProps;
