import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './Toolbar.less';
import Svg from '@opuscapita/react-svg/lib/SVG';
import DropdownMenu from '../DropdownMenu';
import DropdownMenuItem from '../DropdownMenuItem';
import { isHistoryStepPossible, doHistoryStep } from '../history';
import getMess from '../../../translations';

import icons from './icons-svg';

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    icon: PropTypes.object,
    onClick: PropTypes.func
  })),
  newButtonItems: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    icon: PropTypes.object,
    onClick: PropTypes.func
  })),
  newButtonText: PropTypes.string,
  history: PropTypes.shape({
    stack: PropTypes.array,
    currentPointer: PropTypes.number
  }),
  onMoveBackward: PropTypes.func,
  onMoveForward: PropTypes.func,
  locale: PropTypes.string
};
const defaultProps = {
  history: [],
  items: [],
  newButtonItems: [],
  locale: 'en'
};

export default
class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropdownMenu: false
    };
  }

  handleShowDropdownMenu = () => {
    this.setState({ showDropdownMenu: true });
  }

  handleHideDropdownMenu = () => {
    this.setState({ showDropdownMenu: false });
  }

  handleMoveBackward = () => {
    const { history } = this.props;
    const newHistory = doHistoryStep(history, -1);
    this.props.onMoveBackward(newHistory);
  }

  handleMoveForward = () => {
    const { history } = this.props;
    const newHistory = doHistoryStep(history, 1);
    this.props.onMoveForward(newHistory);
  }

  render() {
    const {
      items,
      newButtonItems,
      newButtonText,
      history,
      onMoveBackward, // eslint-disable-line no-unused-vars
      onMoveForward // eslint-disable-line no-unused-vars
    } = this.props;
    const { showDropdownMenu } = this.state;

    const itemsElement = items.length ? (
      <div data-test-id="toolbar" className="oc-fm--toolbar__items">
        {items.map((item, i) => (
          <button
            type="button"
            key={i}
            data-test-id={`toolbar-item--${item.id}`}
            disabled={item.disabled}
            className={`oc-fm--toolbar__item`}
            title={item.label || ''}
            onClick={(!item.disabled && item.onClick) || (() => {})}
          >
            <Svg
              className="oc-fm--toolbar__item-icon"
              svg={item.icon && item.icon.svg}
              style={{ fill: (item.icon && item.icon.fill) || '#424242' }}
            />
          </button>
        ))}
      </div>
    ) : null;


    const newButtonElement = newButtonText ? (
      <button
        type="button"
        onClick={this.handleShowDropdownMenu}
        className="oc-fm--toolbar__new-button"
      >
        {newButtonText}
      </button>
    ) : newButtonItems.map((item, i) => (
      <button
        key={i}
        data-test-id={`toolbar-item--${item.id}`}
        disabled={item.disabled}
        className={`oc-fm--toolbar__item`}
        title={item.label || ''}
        onClick={(!item.disabled && item.onClick) || (() => {})}
      >
        <Svg
          className="oc-fm--toolbar__item-icon"
          svg={item.icon && item.icon.svg}
          style={{ fill: (item.icon && item.icon.fill) || '#424242' }}
        />
      </button>
    ));

    const dropdownMenuItems = newButtonItems.map((item, i) => (
      <DropdownMenuItem key={i} icon={item.icon} onClick={item.onClick || (() => {})}>
        <span>{item.label}</span>
      </DropdownMenuItem>
    ));

    const dropdownMenuElement = showDropdownMenu ? (
      <DropdownMenu
        show={showDropdownMenu}
        onHide={this.handleHideDropdownMenu}
      >
        {dropdownMenuItems}
      </DropdownMenu>
    ) : null;

    const newButtonContainer = newButtonText ? (
      <div className="oc-fm--toolbar__new-button-container">
        {newButtonElement}
        {dropdownMenuElement}
      </div>
    ) : (
      <div data-test-id="toolbar" className="oc-fm--toolbar__items">
        {newButtonElement}
      </div>
    );

    const getMessage = getMess.bind(null, this.props.locale);

    const navButtons = (
      <div className="oc-fm--toolbar__nav-buttons">
        <button
          type="button"
          disabled={!isHistoryStepPossible(history, -1)}
          className={`oc-fm--toolbar__item`}
          title={getMessage('common.Toolbar.moveBack')}
          onClick={() => this.handleMoveBackward()}
        >
          <Svg
            className="oc-fm--toolbar__item-icon"
            svg={icons.moveBackward}
            style={{ fill: '#424242' }}
          />
        </button>

        <button
          type="button"
          disabled={!isHistoryStepPossible(history, 1)}
          className={`oc-fm--toolbar__item`}
          title={getMessage('common.Toolbar.moveForward')}
          onClick={() => this.handleMoveForward()}
        >
          <Svg
            className="oc-fm--toolbar__item-icon"
            svg={icons.moveForward}
            style={{ fill: '#424242' }}
          />
        </button>
      </div>
    );

    return (
      <div className="oc-fm--toolbar">
        {navButtons}
        {newButtonContainer}
        {itemsElement}
      </div>
    );
  }
}

Toolbar.propTypes = propTypes;
Toolbar.defaultProps = defaultProps;
