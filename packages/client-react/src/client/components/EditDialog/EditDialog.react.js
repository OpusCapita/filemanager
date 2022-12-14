import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './EditDialog.less';
import Dialog from '../Dialog';
import FileSaveConfirmDialog from '../FileSaveConfirmDialog';
import AceEditor from "react-ace";
import Svg from '@opuscapita/react-svg/lib/SVG';
import icons from './icons-svg';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/worker-javascript"
import "ace-builds/src-noconflict/theme-monokai";
//import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";


const propTypes = {
  readOnly: PropTypes.bool,
  headerText: PropTypes.string,
  onChange: PropTypes.func,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  onValidate: PropTypes.func,
  getFileContent: PropTypes.func,
};
const defaultProps = {
  readOnly: false,
  headerText: '',
  onChange: () => {},
  onHide: () => {},
  onSubmit: () => {},
  onValidate: () => {},
  getFileContent: () => {},
};

export default
class EditDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.initEditorText();
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  initEditorText = async (e) => {
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
    const { onHide, headerText } = this.props;
    const { showSaveConfirmDialog } = this.state;


    return (
      <Dialog className="oc-fm-edit-dialog" onHide={this.handleClose}>
        <div className="oc-edit--dialog__content">
          {showSaveConfirmDialog ? (<div className="oc-fm--file-navigator__view-loading-overlay">{this.saveConfirmDialog}</div>) : null}
            
          <Svg
            className="oc-edit--dialog__close-icon"
            svg={icons.close}
            onClick={this.handleClose}
          />
          
          <div className="oc-fm--dialog__header">
            {headerText}
          </div>

          <AceEditor
            readOnly={this.props.readOnly}
            mode="javascript"
            theme="monokai"
            fontSize={16}
            onChange={this.handleChange}
            name="UNIQUE_ID_OF_DIV"
            value={this.state.editorText}
            focus={!showSaveConfirmDialog}
            width="100%"
            height="100%"
            setOptions={{
              useWorker: false,
              tabSize: 4,
              useSoftTabs: true,
              navigateWithinSoftTabs: true
            }}
          />
        </div>
      </Dialog>
    );
  }
}

EditDialog.propTypes = propTypes;
EditDialog.defaultProps = defaultProps;
