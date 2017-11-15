import PropTypes from 'prop-types';
import React, { Component, Children } from 'react';
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
    let { children, className } = this.props;

    return (
      <div className={`oc-fm--file-manager ${className || ''}`}>
        <div className="oc-fm--file-manager__navigators">
          {Children.toArray(children).map((child, i) => (
            <div key={i} className="oc-fm--file-manager__navigator">
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

FileManager.propTypes = propTypes;
FileManager.defaultProps = defaultProps;
