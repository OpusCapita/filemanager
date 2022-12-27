import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './EditDialog.less';
import Dialog from '../Dialog';
import FileSaveConfirmDialog from '../FileSaveConfirmDialog';
import AceEditor from "react-ace";
import Svg from '@opuscapita/react-svg/lib/SVG';
import icons from './icons-svg';
import {getModeForPath, modes, modesByName} from "ace-builds/src-noconflict/ext-modelist";

// const languages = [
//   "javascript",
//   "java",
//   "python",
//   "xml",
//   "markdown",
//   "json",
//   "html",
//   "typescript",
//   "css",
//   "text",
//   "plain_text"
// ];

// languages.map(lang => {
//   try {
//     require(`ace-builds/src-noconflict/mode-${lang}`);
//     require(`ace-builds/src-noconflict/snippets/${lang}`);
//   } catch(ignore) {}
// });

// modes.map(mode => {
//   try {
//     require(`ace-builds/src-noconflict/mode-${mode.name}`);
//     require(`ace-builds/src-noconflict/snippets/${mode.name}`);
//   } catch(ignore) {}
// });

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/snippets/javascript";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/snippets/java";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/snippets/python";

import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/snippets/xml";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/snippets/json";

import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/snippets/html";

import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/snippets/typescript";

import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/snippets/css";

import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/snippets/text";

import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/snippets/plain_text";

import  'ace-builds/src-noconflict/mode-makefile';
import "ace-builds/src-noconflict/snippets/makefile";

import  'ace-builds/src-noconflict/mode-markdown';
import "ace-builds/src-noconflict/snippets/markdown";

import  'ace-builds/src-noconflict/mode-lua';
import "ace-builds/src-noconflict/snippets/lua";

import  'ace-builds/src-noconflict/mode-jsx'
import "ace-builds/src-noconflict/snippets/jsx";

//import "ace-builds/src-noconflict/theme-monokai";
import  'ace-builds/src-noconflict/theme-dracula';

//import  'ace-builds/src-noconflict/ext-beautify';
import  'ace-builds/src-noconflict/ext-code_lens';
// import  'ace-builds/src-noconflict/ext-elastic_tabstops_lite';
// import  'ace-builds/src-noconflict/ext-emmet';
import  'ace-builds/src-noconflict/ext-error_marker';
import  'ace-builds/src-noconflict/ext-hardwrap';
import  'ace-builds/src-noconflict/ext-keybinding_menu';
import  'ace-builds/src-noconflict/ext-language_tools';
import  'ace-builds/src-noconflict/ext-linking';
//import  'ace-builds/src-noconflict/ext-modelist';
import  'ace-builds/src-noconflict/ext-options';
import  'ace-builds/src-noconflict/ext-prompt';
import  'ace-builds/src-noconflict/ext-rtl';
import  'ace-builds/src-noconflict/ext-searchbox';
import  'ace-builds/src-noconflict/ext-settings_menu';
//import  'ace-builds/src-noconflict/ext-spellcheck';
//import  'ace-builds/src-noconflict/ext-split';
//import  'ace-builds/src-noconflict/ext-static_highlight';
//import  'ace-builds/src-noconflict/ext-statusbar';
import  'ace-builds/src-noconflict/ext-textarea';
//import  'ace-builds/src-noconflict/ext-themelist';
import  'ace-builds/src-noconflict/ext-whitespace';
// import  'ace-builds/src-noconflict/keybinding-emacs';
// import  'ace-builds/src-noconflict/keybinding-sublime';
// import  'ace-builds/src-noconflict/keybinding-vim';
// import  'ace-builds/src-noconflict/keybinding-vscode';


const propTypes = {
  readOnly: PropTypes.bool,
  headerText: PropTypes.string,
  fileName: PropTypes.string,
  onChange: PropTypes.func,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  onValidate: PropTypes.func,
  getFileContent: PropTypes.func,
};
const defaultProps = {
  readOnly: false,
  headerText: '',
  fileName: '',
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
      editorText: "",
      editorMode: "text"
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
      let mode = getModeForPath(this.props.fileName).name;
      let value = await this.props.getFileContent();
      this.setState({ editorText: value, editorMode: mode });
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
            mode={this.state.editorMode}
            theme="dracula"
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
