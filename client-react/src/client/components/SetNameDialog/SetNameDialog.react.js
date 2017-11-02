import React, { Component, PropTypes } from 'react';
import './SetNameDialog.less';
import Dialog from '../Dialog';

const propTypes = {
  headerText: PropTypes.string,
  validationError: PropTypes.string,
  onHide: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func
};
const defaultProps = {
  headerText: 'Set name',
  autofocus: false,
  validationError: null,
  onHide: () => {},
  onChange: () => {},
  onSubmit: () => {}
};

export default
class SetNameDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  }

  handleKeyDown = (e) => {
    if (e.which === 13) { // Enter key
      if (!this.props.validationError) {
        this.props.onSubmit(this.state.value);
        this.props.onHide();
      }
    }
  }

  render() {
    let { onHide, headerText } = this.props;
    let { value } = this.state;

    return (
      <Dialog onHide={onHide}>
        <div className="oc-fm--dialog__content" onKeyDown={this.handleKeyDown}>
          <div className="oc-fm--dialog__header">
            {headerText}
          </div>

          <input
            ref={ref => (ref && ref.focus())}
            className="oc-fm--dialog__input oc-fm--dialog__input--margin-bottom"
            value={value}
            onChange={this.handleChange}
          />

          <div className="oc-fm--dialog__horizontal-group oc-fm--dialog__horizontal-group--to-right">
            <button type="button" className="oc-fm--dialog__button oc-fm--dialog__button--default" onClick={onHide}>
              Cancel
            </button>
            <button type="button" className="oc-fm--dialog__button oc-fm--dialog__button--primary" onClick={onHide}>
              Create
            </button>
          </div>
        </div>
      </Dialog>
    );
  }
}

SetNameDialog.propTypes = propTypes;
SetNameDialog.defaultProps = defaultProps;
