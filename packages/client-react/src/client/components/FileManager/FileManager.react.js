import PropTypes from 'prop-types';
import React, { Component, Children } from 'react';
import './FileManager.less';

const propTypes = {
  className: PropTypes.string
};
const defaultProps = {};

export default
class FileManager extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const { children, className, ...restProps } = this.props;

    return (
      <div data-test-id="filemanager" className={`oc-fm--file-manager ${className || ''}`} {...restProps}>
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
