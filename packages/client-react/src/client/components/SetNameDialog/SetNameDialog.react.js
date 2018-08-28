import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './SetNameDialog.less';
import Dialog from '../Dialog';

const propTypes = {
  cancelButtonText: PropTypes.string,
  headerText: PropTypes.string,
  messageText: PropTypes.string,
  inputLabelText: PropTypes.string,
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
  messageText: '',
  inputLabelText: '',
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

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  handleChange = async (e) => {
    this.setState({ value: e.target.value });
    const validationError = await this.props.onValidate(e.target.value);
    if (this._isMounted) {
      this.setState({ validationError, valid: !validationError });
    }
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
    const validationError = await this.props.onSubmit(this.state.value);

    if (validationError && this._isMounted) {
      this.setState({ validationError });
    }
  }

  handleFocus = (e) => {
    // Move caret to the end
    const tmpValue = e.target.value;
    e.target.value = ''; // eslint-disable-line no-param-reassign
    e.target.value = tmpValue; // eslint-disable-line no-param-reassign
  }

  render() {
    const { onHide, headerText, inputLabelText, messageText, submitButtonText, cancelButtonText } = this.props;
    const { value, validationError, valid } = this.state;

    const showValidationErrorElement = typeof validationError === 'string' && validationError;
    const validationErrorElement = (
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

          {messageText && (
            <div className="oc-fm--dialog__message">{messageText}</div>
          )}

          {inputLabelText && (
            <div className="oc-fm--dialog__input-label">{inputLabelText}</div>
          )}

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
            onFocus={this.handleFocus}
          />
          {validationErrorElement}

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
        </div>
      </Dialog>
    );
  }
}

SetNameDialog.propTypes = propTypes;
SetNameDialog.defaultProps = defaultProps;
