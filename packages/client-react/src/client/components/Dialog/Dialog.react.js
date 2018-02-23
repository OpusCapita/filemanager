import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './Dialog.less';

const propTypes = {
  autofocus: PropTypes.bool,
  className: PropTypes.string,
  onHide: PropTypes.func
};
const defaultProps = {
  autofocus: false,
  className: '',
  onHide: () => {}
};

export default
class Dialog extends Component {
  handleKeyDown = (e) => {
    if (e.which === 27) { // Esc key
      e.stopPropagation();
      this.props.onHide();
    }
  };

  render() {
    let { autofocus, className } = this.props;

    return (
      <div
        ref={ref => (autofocus && ref && ref.focus())}
        className={`oc-fm--dialog ${className}`}
        onKeyDown={this.handleKeyDown}
        onClick={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
        onMouseUp={e => e.stopPropagation()}
        tabIndex="0"
      >
        {this.props.children}
      </div>
    );
  }
}

Dialog.propTypes = propTypes;
Dialog.defaultProps = defaultProps;
