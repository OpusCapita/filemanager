import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './Dialog.less';

const propTypes = {
  autofocus: PropTypes.bool,
  onHide: PropTypes.func,
  className: PropTypes.string
};
const defaultProps = {
  autofocus: false,
  onHide: () => {},
  className: "oc-fm--dialog"
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
    const { autofocus } = this.props;

    return (
      <div
        ref={ref => (autofocus && ref && ref.focus())}
        className={this.props.className}
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
