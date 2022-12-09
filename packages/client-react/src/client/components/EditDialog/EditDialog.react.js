import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './EditDialog.less';
import Dialog from '../Dialog';
import FileSaveConfirmDialog from '../FileSaveConfirmDialog'

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/worker-javascript"
import "ace-builds/src-noconflict/theme-monokai";
//import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";


const propTypes = {
  cancelButtonText: PropTypes.string,
  headerText: PropTypes.string,
  inputLabelText: PropTypes.string,
  initialValue: PropTypes.string,
  onChange: PropTypes.func,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  onValidate: PropTypes.func,
  getFileContent: PropTypes.func,
  submitButtonText: PropTypes.string
};
const defaultProps = {
  cancelButtonText: 'Close',
  headerText: 'Set name',
  inputLabelText: '',
  initialValue: '',
  onChange: () => {},
  onHide: () => {},
  onSubmit: () => {},
  onValidate: () => {},
  getFileContent: () => {},
  submitButtonText: 'Create'
};

export default
class EditDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue,
      showSaveConfirmDialog: false,
      editorText: ""
    };
    this.newText = null;
    this.saveConfirmDialog = React.createElement(FileSaveConfirmDialog, { ...FileSaveConfirmDialog.defaultProps,
                                                                          onSubmit: this.handleSubmit, 
                                                                          onHide: this.handleHideSaveConfirmDialog,
                                                                          onIgnore: this.handleSkipSaveAndClose,
                                                                        });
  }

  componentDidMount() {
    this._isMounted = true
    this.setText();
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  setText = async (e) => {
      let value = await this.props.getFileContent();
      this.setState({ editorText: value });
  } 

  handleChange = async (value, event) => {
    this.newText = value;
    if (this._isMounted) {

    }
  }

  handleSubmit = async () => {
    if (this.newText) {
      const validationError = await this.props.onSubmit(this.newText);

      // if (validationError && this._isMounted) {
      //   this.setState({ validationError });
      // }
      this.handleSkipSaveAndClose();
    }
  }

  handleClose = async () => {
    if (this._isMounted && this.newText) {
      this.setState({ showSaveConfirmDialog: true, editorText: this.newText});
    } else {
      this.handleSkipSaveAndClose();
    }
  }

  handleSkipSaveAndClose = async () => {
      this.props.onHide();
      this.newText = null;
  }

  handleHideSaveConfirmDialog = async () => {
    if (this._isMounted)
      this.setState({ showSaveConfirmDialog: false });
  }

  render() {
    const { onHide, headerText, inputLabelText, submitButtonText, cancelButtonText } = this.props;
    const { value, showSaveConfirmDialog } = this.state;


    return (
      <Dialog className="oc-fm-edit-dialog" onHide={this.handleClose}>
        <div className="oc-edit--dialog__content">
          {showSaveConfirmDialog ? (<div className="oc-fm--file-navigator__view-loading-overlay">{this.saveConfirmDialog}</div>) : null}
          <div className="oc-fm--dialog__header">
            {headerText}
          </div>

          <AceEditor
            mode="javascript"
            theme="monokai"
            fontSize={16}
            onChange={this.handleChange}
            name="UNIQUE_ID_OF_DIV"
            value={this.state.editorText}
            focus={true}
            setOptions={{
              useWorker: false,
              tabSize: 2,
              useSoftTabs: true,
              navigateWithinSoftTabs: true
            }}
          />

          <div className="oc-fm--dialog__horizontal-group oc-fm--dialog__horizontal-group--to-right">
            <button type="button" className="oc-fm--dialog__button oc-fm--dialog__button--default" onClick={this.handleClose}>
              {cancelButtonText}
            </button>
          </div>
        </div>
      </Dialog>
    );
  }
}

EditDialog.propTypes = propTypes;
EditDialog.defaultProps = defaultProps;
