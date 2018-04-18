import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import './SearchDialog.less';
import Dialog from '../Dialog';

const ITEM_TYPE_FILE = 'file';
const ITEM_TYPE_DIR = 'dir';

export default class SearchDialog extends Component {
  static propTypes = {
    headerText: PropTypes.string,
    itemNameSubstringText: PropTypes.string,
    itemNameCaseSensitiveText: PropTypes.string,
    recursiveText: PropTypes.string,
    itemTypeText: PropTypes.string,
    itemTypeFileText: PropTypes.string,
    itemTypeDirText: PropTypes.string,
    cancelButtonText: PropTypes.string,
    submitButtonText: PropTypes.string,
    onSubmit: PropTypes.func,
    onHide: PropTypes.func,
    stepIndex: PropTypes.number,
    resources: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['dir', 'file']).isRequired,
      ancestors: PropTypes.array,
      parentId: PropTypes.string
    })),
    final: PropTypes.bool,
    err: PropTypes.any,
    navigateToDir: PropTypes.func.isRequired

  };
  static defaultProps = {
    headerText: 'Search',
    itemNameSubstringText: 'Item name',
    itemNameCaseSensitiveText: 'Case sensitive',
    recursiveText: 'Recursive',
    itemTypeText: 'Type',
    itemTypeFileText: 'Files',
    itemTypeDirText: 'Folders',
    cancelButtonText: 'Cancel',
    submitButtonText: 'Search',
    autofocus: false,
    stepIndex: -1,
    resources: [],
    onSubmit: _ => {},
    onHide: _ => {}
  };

  state = {
    [ITEM_TYPE_FILE]: true,
    [ITEM_TYPE_DIR]: true,
    itemNameSubstring: '',
    itemNameCaseSensitive: false,
    recursive: true,
    resources: [],
    loading: false,
    submitArgs: null // arguments of last submit() call.
  }

  componentDidMount() {
    if (this.itemNameSubstringInput) {
      this.itemNameSubstringInput.focus();
    }
  }

  componentWillReceiveProps({ resources, stepIndex, final, err }) {
    if (stepIndex !== this.props.stepIndex) {
      this.setState({
        resources: [...this.state.resources, ...resources],
        loading: !final
      });
    } else if (err && err !== this.props.err) {
      // API call err has just occured.
      this.setState({
        loading: false,
        submitArgs: null // Allow re-submit.
      });
    }
  }

  setItemNameSubstringInputRef = element => {
    this.itemNameSubstringInput = element;
  }

  handleItemNameSubstingChange = ({
    target: {
      value: itemNameSubstring
    }
  }) => this.setState({ itemNameSubstring })

  handleItemNameCaseSensitiveChange = ({
    target: {
      checked: itemNameCaseSensitive
    }
  }) => this.setState({ itemNameCaseSensitive })

  handleRecursiveChange = ({
    target: {
      value: recursive
    }
  }) => this.setState({ recursive })

  handleItemTypeChange = itemType => ({
    target: {
      checked: value
    }
  }) => this.setState({
    [itemType]: value,
    ...(!value && { // Making sure that at least one item type is selected.
      [itemType === ITEM_TYPE_FILE ?
        ITEM_TYPE_DIR :
        ITEM_TYPE_FILE
      ]: true
    })
  });

  handleCancel = _ => this.props.onHide()

  getSubmitArgs = _ => ({
    itemNameSubstring: this.state.itemNameSubstring.trim(),
    itemNameCaseSensitive: this.state.itemNameCaseSensitive,
    recursive: this.state.recursive,
    itemType: {
      file: this.state[ITEM_TYPE_FILE],
      dir: this.state[ITEM_TYPE_DIR]
    }
  })

  handleSubmit = event => {
    event.preventDefault(); // Prevent reload on submit.
    event.stopPropagation(); // In case we use component in outer 'form' element.
    const submitArgs = this.getSubmitArgs();
    this.props.onSubmit(submitArgs);

    this.setState({
      resources: [],
      loading: true,
      submitArgs
    });
  }

  gotoResult = ({ id, type, parentId }) => _ => {
    this.props.navigateToDir(
      ...(type === 'dir' ?
        [id, null] :
        [parentId, id]
      ),
      false
    );

    this.props.onHide();
  }

  render() {
    return (
      <div className="oc-fm--search-dialog">
        <Dialog onHide={this.props.onHide}>
          <form className="oc-fm--dialog__content" onSubmit={this.handleSubmit}>
            <div className="oc-fm--dialog__header">
              {this.props.headerText}
            </div>

            <div className="oc-fm--dialog__input-label">
              {this.props.itemNameSubstringText}
            </div>
            <input
              ref={this.setItemNameSubstringInputRef}
              value={this.state.itemNameSubstring}
              onChange={this.handleItemNameSubstingChange}
              spellCheck={false}
              className="oc-fm--dialog__input oc-fm--dialog__input--margin-bottom"
            />

            <label className="oc-fm--dialog__input-label">
              {this.props.itemNameCaseSensitiveText}
              <input
                type="checkbox"
                value={this.state.itemNameCaseSensitive}
                onChange={this.handleItemNameCaseSensitiveChange}
              />
            </label>

            <label className="oc-fm--dialog__input-label">
              {this.props.recursiveText}
              <input
                type="checkbox"
                value={this.state.recursive}
                onChange={this.handleRecursiveChange}
              />
            </label>

            <div className="oc-fm--dialog__input-label">
              {this.props.itemTypeText}
            </div>
            <label className="oc-fm--dialog__input-label">
              {this.props.itemTypeFileText}
              <input
                type="checkbox"
                checked={this.state[ITEM_TYPE_FILE]}
                onChange={this.handleItemTypeChange(ITEM_TYPE_FILE)}
              />
            </label>
            <label className="oc-fm--dialog__input-label">
              {this.props.itemTypeDirText}
              <input
                type="checkbox"
                checked={this.state[ITEM_TYPE_DIR]}
                onChange={this.handleItemTypeChange(ITEM_TYPE_DIR)}
              />
            </label>

            <div>
            </div>

            <div className="oc-fm--dialog__horizontal-group oc-fm--dialog__horizontal-group--to-right">
              <button
                type="button"
                className="oc-fm--dialog__button oc-fm--dialog__button--default"
                onClick={this.handleCancel}
              >
                {this.props.cancelButtonText}
              </button>
              <button
                type="submit"
                className="oc-fm--dialog__button oc-fm--dialog__button--primary"
                disabled={isEqual(this.state.submitArgs, this.getSubmitArgs())}
              >
                {this.props.submitButtonText}
              </button>
            </div>
          </form>
          <div style={{ overflow: 'auto', height: '150px' }}>
            {this.state.resources.map(resource => (
              <div key={resource.id} className="oc-fm--dialog__input-label" onDoubleClick={this.gotoResult(resource)}>
                {
                  resource.type + ': ' +
                  [
                    ...resource.ancestors.map(({ name }) => name),
                    resource.name
                  ].join(' > ')
                }
              </div>
            ))}
          </div>
          <div className="oc-fm--dialog__input-label">
            {this.state.loading && 'Searching...'}
          </div>
        </Dialog>
      </div>
    );
  }
}
