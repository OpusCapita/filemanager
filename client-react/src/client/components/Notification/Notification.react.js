import React, { Component, Children, PropTypes } from 'react';
import './Notification.less';
import SVG from '@opuscapita/react-svg/lib/SVG';

let minimizeIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/keyboard_arrow_down.svg');
let maximizeIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/keyboard_arrow_up.svg');
let closeIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/close.svg');

const propTypes = {
  closable: PropTypes.bool,
  minimizable: PropTypes.bool,
  onCancel: PropTypes.func,
  onHide: PropTypes.func,
  cancelButtonText: PropTypes.string,
  progressText: PropTypes.node,
  title: PropTypes.node
};
const defaultProps = {
  closable: false,
  minimizable: true,
  onHide: () => {},
  progressText: '',
  cancelButtonText: 'Cancel',
  title: ''
};

export default
class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minimized: false
    };
  }

  handleToggleClick = () => {
    this.setState({ minimized: !this.state.minimized });
  }

  render() {
    let { title, onHide, minimizable, closable, progressText, cancelButtonText, children } = this.props;
    let { minimized } = this.state;

    let toggleElement = (minimizable && (progressText || children)) ? (
      <div tabIndex="0" className="oc-fm--notification__header-icon" onClick={this.handleToggleClick}>
        <SVG
          svg={minimized ? maximizeIcon : minimizeIcon}
          style={{ fill: '#f5f5f5' }}
        />
      </div>
    ) : null;

    let closeElement = closable ? (
      <div tabIndex="0" className="oc-fm--notification__header-icon" onClick={onHide}>
        <SVG
          svg={closeIcon}
          style={{ fill: '#f5f5f5' }}
          />
      </div>
    ) : null;

    let progressMessageElement = (!minimized && progressText) ? (
      <div className="oc-fm--notification__progress">
        <div className="oc-fm--notification__progress-text">
          {progressText}
        </div>
        <button className="oc-fm--notification__cancel-button">
          {cancelButtonText}
        </button>
      </div>
    ) : null;

    let itemsElement = (
      <div className={`oc-fm--notification__items ${minimized ? 'oc-fm--notification__items--minimized' : ''}`}>
        {children.map((child, i) => ({ ...child, key: i }))}
      </div>
    );

    return (
      <div className="oc-fm--notification">
        <div className="oc-fm--notification__header">
          <div title={title} className="oc-fm--notification__header-title">
            {title}
          </div>
          <div className="oc-fm--notification__header-icons">
            {toggleElement}
            {closeElement}
          </div>
        </div>
        {progressMessageElement}
        {itemsElement}
      </div>
    );
  }
}

Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;
