import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './Notification.less';
import Svg from '@opuscapita/react-svg/lib/SVG';
import rawToReactElement from '../raw-to-react-element';

let minimizeIcon = require('@opuscapita/svg-icons/lib/keyboard_arrow_down.svg');
let maximizeIcon = require('@opuscapita/svg-icons/lib/keyboard_arrow_up.svg');
let closeIcon = require('@opuscapita/svg-icons/lib/close.svg');

const propTypes = {
  closable: PropTypes.bool,
  minimizable: PropTypes.bool,
  onCancel: PropTypes.func,
  onHide: PropTypes.func,
  cancelButtonText: PropTypes.string,
  progressText: PropTypes.node,
  title: PropTypes.node,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({
      elementType: PropTypes.string,
      elementProps: PropTypes.object
    })),
    PropTypes.arrayOf(PropTypes.node)
  ])
};
const defaultProps = {
  closable: false,
  minimizable: true,
  onCancel: () => {},
  onHide: () => {},
  progressText: '',
  cancelButtonText: 'Cancel',
  title: '',
  children: []
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

  handleCancelClick = () => {
    this.props.onCancel();
  }

  render() {
    let { title, onHide, minimizable, closable, progressText, cancelButtonText, children } = this.props;
    let { minimized } = this.state;

    let toggleElement = (minimizable && (progressText || children)) ? (
      <div tabIndex="0" className="oc-fm--notification__header-icon" onClick={this.handleToggleClick}>
        <Svg
          svg={minimized ? maximizeIcon : minimizeIcon}
          style={{ fill: '#f5f5f5' }}
        />
      </div>
    ) : null;

    let closeElement = closable ? (
      <div tabIndex="0" className="oc-fm--notification__header-icon" onClick={onHide}>
        <Svg
          svg={closeIcon}
          style={{ fill: '#f5f5f5' }}
        />
      </div>
    ) : null;

    let progressMessageElement = (progressText) ? (
      <div className="oc-fm--notification__progress">
        <div className="oc-fm--notification__progress-text">
          {progressText}
        </div>
        <button onClick={this.handleCancelClick} className="oc-fm--notification__cancel-button">
          {cancelButtonText}
        </button>
      </div>
    ) : null;

    let itemsElement = (
      <div className={`oc-fm--notification__items`}>
        {children.map((rawChild, i) => {
          if (React.isValidElement(rawChild)) {
            return { ...rawChild, key: i };
          }

          return rawToReactElement(rawChild, i);
        })}
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
        <div
          className={`
            oc-fm--notification__content
            ${minimized ? 'oc-fm--notification__content--minimized' : ''}
          `}
        >
          {progressMessageElement}
          {itemsElement}
        </div>
      </div>
    );
  }
}

Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;
