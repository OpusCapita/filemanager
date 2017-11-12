import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './FileManager.less';

const propTypes = {};
const defaultProps = {};

export default
class FileManager extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="file-manager">
      </div>
    );
  }
}

FileManager.propTypes = propTypes;
FileManager.defaultProps = defaultProps;
