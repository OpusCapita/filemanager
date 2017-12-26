import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './SetNameDialog.less';
import Dialog from '../Dialog';

const propTypes = {
  cancelButtonText: PropTypes.string,
  headerText: PropTypes.string,
  initialValue: PropTypes.string,
  onChange: PropTypes.func,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  onValidate: PropTypes.func,
  submitButtonText: PropTypes.string
};
const defaultProps = {
  cancelButtonText: 'Cancel',
  headerText: 'Set name',
  initialValue: '',
  onChange: () => {},
  onHide: () => {},
  onSubmit: () => {},
  onValidate: () => {},
  submitButtonText: 'Create'
};

export default
class SetNameDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue,
      validationError: null,
      valid: false
    };
  }

  handleChange = async (e) => {
    this.setState({ value: e.target.value  });
    let validationError = await this.props.onValidate(e.target.value);
    this.setState({ validationError, valid: !validationError });
  }

  handleKeyDown = async (e) => {
    if (e.which === 13) { // Enter key
      if (!this.state.validationError && this.state.value) {
        this.handleSubmit(this.state.value);
      }
    }
  }

  handleSubmitButtonClick = async (e) => {
    if (!this.state.validationError && this.state.value) {
      this.handleSubmit(this.state.value);
    }
  }

  handleSubmit = async () => {
    let validationError = await this.props.onSubmit(this.state.value);

    if (validationError) {
      this.setState({ validationError });
    }
  }

  moveCaretAtEnd = (e) => {
    let tmpValue = e.target.value;
    e.target.value = '';
    e.target.value = tmpValue;
  }

  render() {
    let { onHide, headerText, submitButtonText, cancelButtonText } = this.props;
    let { value, validationError, valid } = this.state;

    let showValidationErrorElement = typeof validationError === 'string' && validationError;
    let validationErrorElement = (
      <div
        className={`
          oc-fm--dialog__validation-error
          ${showValidationErrorElement ? '' : 'oc-fm--dialog__validation-error--hidden'}
        `}
      >
        {validationError || <span>&nbsp;</span>}
      </div>
    );

    return (
      <Dialog onHide={onHide}>
        <div className="oc-fm--dialog__content" onKeyDown={this.handleKeyDown}>
          <div className="oc-fm--dialog__header">
            {headerText}
          </div>

          <input
            ref={ref => (ref && ref.focus())}
            spellCheck={false}
            className={`
              oc-fm--dialog__input
              oc-fm--dialog__input--margin-bottom
              ${validationError ? '' : 'oc-fm--dialog__input--error'}
            `}
            value={value}
            onChange={this.handleChange}
            onFocus={this.moveCaretAtEnd}
          />

          <div className="oc-fm--dialog__horizontal-group oc-fm--dialog__horizontal-group--to-right">
            <button type="button" className="oc-fm--dialog__button oc-fm--dialog__button--default" onClick={onHide}>
              {cancelButtonText}
            </button>
            <button
              type="button"
              className={`oc-fm--dialog__button oc-fm--dialog__button--primary`}
              onClick={this.handleSubmitButtonClick}
              disabled={!valid}
            >
              {submitButtonText}
            </button>
          </div>
          {validationErrorElement}
        </div>
      </Dialog>
    );
  }
}

SetNameDialog.propTypes = propTypes;
SetNameDialog.defaultProps = defaultProps;
