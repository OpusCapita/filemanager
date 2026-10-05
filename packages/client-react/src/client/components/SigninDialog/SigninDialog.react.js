import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './SigninDialog.less';
import Dialog from '../Dialog';

const propTypes = {
  cancelButtonText: PropTypes.string,
  headerText: PropTypes.string,
  messageText: PropTypes.string,
  usernameLabelText: PropTypes.string,
  passwordLabelText: PropTypes.string,
  initalUsernameValue: PropTypes.string,
  onChange: PropTypes.func,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  onValidate: PropTypes.func,
  submitButtonText: PropTypes.string
};
const defaultProps = {
  cancelButtonText: 'Clear',
  headerText: 'Sign in',
  messageText: '',
  usernameLabelText: 'Username:',
  passwordLabelText: 'Password:',
  initalUsernameValue: '',
  initalPasswordValue: '',
  onChange: () => {},
  onHide: () => {},
  onSubmit: () => {},
  onValidate: () => {},
  submitButtonText: 'Sign in'
};

export default
class SigninDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.initalUsernameValue,
      password: props.initalPasswordValue,
      validationError: null,
      valid: false,
      lockedUntil: 0
    };
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.timer);
  }

  handleChange = async (e) => {
    this.setState({ [e.target.name]: e.target.value });
    const validationError = await this.props.onValidate(e.target.value);
    if (this._isMounted) {
      this.setState({ validationError, valid: !validationError });
    }
  }

  handleKeyDown = async (e) => {
    if (e.which === 13) { // Enter key
      if (!this.state.validationError && this.state.username) {
        this.handleSubmit(this.state.value);
      }
    }
  }

  handleSubmitButtonClick = async (e) => {
    if (!this.state.validationError && this.state.username) {
      this.handleSubmit(this.state.username);
    }
  }

  handleSubmit = async () => {
    if (this.state.lockedUntil > Date.now()) return;

    const result = await this.props.onSubmit(this.state.username, this.state.password);
    if (!this._isMounted) return;

    if (result && result.retryAfter) {
      this.setState({ lockedUntil: Date.now() + result.retryAfter * 1000, password: '' });
      this.timer = this.timer || setInterval(() => {
        if (this.state.lockedUntil > Date.now()) {
          this.forceUpdate();
        } else {
          clearInterval(this.timer);
          this.timer = null;
          this.setState({ lockedUntil: 0 });
        }
      }, 1000);
    } else if (result) {
      this.setState({ validationError: result });
    }
  }

  handleFocus = (e) => {
    // Move caret to the end
    const tmpValue = e.target.value;
    e.target.value = ''; // eslint-disable-line no-param-reassign
    e.target.value = tmpValue; // eslint-disable-line no-param-reassign
  }

  render() {
    const { onHide, headerText, usernameLabelText, passwordLabelText, messageText, submitButtonText, cancelButtonText } = this.props;
    const { username, password, validationError, valid, lockedUntil } = this.state;

    const left = lockedUntil - Date.now();
    const locked = left > 0;
    const sec = Math.ceil(left / 1000);
    const displayedError = locked ?
      `Too many failed attempts. Please try again in ${Math.floor(sec / 60)}:${('0' + (sec % 60)).slice(-2)}.` :
      validationError;

    const showValidationErrorElement = typeof displayedError === 'string' && displayedError;
    const validationErrorElement = (
      <div
        className={`
          oc-fm--dialog__validation-error
          ${showValidationErrorElement ? '' : 'oc-fm--dialog__validation-error--hidden'}
        `}
      >
        {displayedError || <span>&nbsp;</span>}
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

          {usernameLabelText && (
            <div className="oc-fm--dialog__input-label">{usernameLabelText}</div>
          )}

          <input
            spellCheck={false}
            className={`
              oc-fm--dialog__input
              oc-fm--dialog__input--margin-bottom
              ${validationError ? '' : 'oc-fm--dialog__input--error'}
            `}
            name="username"
            value={username}
            disabled={locked}
            onChange={this.handleChange}
          />

          {passwordLabelText && (
            <div className="oc-fm--dialog__input-label">{passwordLabelText}</div>
          )}

          <input
            type="password"
            spellCheck={false}
            className={`
              oc-fm--dialog__input
              oc-fm--dialog__input--margin-bottom
              ${validationError ? '' : 'oc-fm--dialog__input--error'}
            `}
            name="password"
            value={password}
            disabled={locked}
            onChange={this.handleChange}
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
              disabled={!valid || locked}
            >
              {submitButtonText}
            </button>
          </div>
        </div>
      </Dialog>
    );
  }
}

SigninDialog.propTypes = propTypes;
SigninDialog.defaultProps = defaultProps;
