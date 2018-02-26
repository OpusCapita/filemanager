import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SearchDialog.less';
import Dialog from '../Dialog';

const propTypes = {
  headerText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  onSubmit: PropTypes.func,
  onHide: PropTypes.func

};
const defaultProps = {
  headerText: 'Search files',
  cancelButtonText: 'Cancel',
  submitButtonText: 'Search',
  autofocus: false,
  onSubmit: () => {},
  onHide: () => {}
};

export default
class SearchDialog extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

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
    let { onHide, headerText, submitButtonText, cancelButtonText } = this.props;

    return (
      <div className="oc-fm--search-dialog">
        <Dialog onHide={onHide}>
          <div className="oc-fm--dialog__content" onKeyDown={this.handleKeyDown}>
            <div className="oc-fm--dialog__header">
              {headerText}
            </div>

            <div className="oc-fm--dialog__horizontal-group oc-fm--dialog__horizontal-group--to-right">
              <button
                type="button"
                className="oc-fm--dialog__button oc-fm--dialog__button--default"
                onClick={this.handleCancel}
              >
                {cancelButtonText}
              </button>
              <button
                type="button"
                className={`oc-fm--dialog__button oc-fm--dialog__button--primary`}
                onClick={this.handleSubmit}
              >
                {submitButtonText}
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

SearchDialog.propTypes = propTypes;
SearchDialog.defaultProps = defaultProps;
