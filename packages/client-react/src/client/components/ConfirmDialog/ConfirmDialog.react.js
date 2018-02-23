import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Dialog from '../Dialog';

const propTypes = {
  className: PropTypes.string,
  headerText: PropTypes.string,
  messageText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func
};
const defaultProps = {
  className: '',
  headerText: 'Do you really want to remove the file?',
  messageText: 'Message',
  cancelButtonText: 'Cancel',
  submitButtonText: 'OK',
  autofocus: false,
  onHide: () => {},
  onSubmit: () => {}
};

export default
class ConfirmDialog extends Component {
  handleKeyDown = async (e) => {
    if (e.which === 13) { // Enter key
      this.handleSubmit();
    }
  };

  handleCancel = async () => {
    this.props.onHide();
  };

  handleSubmit = async () => {
    this.props.onSubmit();
  };

  render() {
    let { className, onHide, headerText, messageText, submitButtonText, cancelButtonText } = this.props;

    return (
      <Dialog
        onHide={onHide}
        autofocus={true}
        className={`oc-fm--confirm-dialog ${className}`}
        onKeyDown={this.handleKeyDown}
      >
        <div className="oc-fm--dialog__content">
          <div className="oc-fm--dialog__header">
            {headerText}
          </div>

          {messageText && (
            <div className="oc-fm--dialog__message">{messageText}</div>
          )}

          <div className="oc-fm--dialog__horizontal-group oc-fm--dialog__horizontal-group--to-right">
            <button
              type="button"
              className={`
                oc-fm--dialog__button
                oc-fm--dialog__button--default
                oc-fm--confirm-dialog__cancel-button
              `}
              onClick={this.handleCancel}
            >
              {cancelButtonText}
            </button>
            <button
              type="button"
              className={`
                oc-fm--dialog__button
                oc-fm--dialog__button--primary
                oc-fm--confirm-dialog__submit-button
              `}
              onClick={this.handleSubmit}
            >
              {submitButtonText}
            </button>
          </div>
        </div>
      </Dialog>
    );
  }
}

ConfirmDialog.propTypes = propTypes;
ConfirmDialog.defaultProps = defaultProps;
