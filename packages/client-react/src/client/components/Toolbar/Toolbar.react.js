import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './Toolbar.less';
import SVG from '@opuscapita/react-svg/lib/SVG';
import DropdownMenu from '../DropdownMenu';
import DropdownMenuItem from '../DropdownMenuItem';
import { isHistoryStepPossible, doHistoryStep } from '../history';

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
  onMoveForward: PropTypes.func
};
const defaultProps = {
  history: [],
  items: [],
  newButtonItems: []
};

export default
class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropdownMenu: false
    };
  }

  showDropdownMenu = () => {
    this.setState({ showDropdownMenu: true });
  }

  hideDropdownMenu = () => {
    this.setState({ showDropdownMenu: false });
  }

  handleMoveBackward = () => {
    let { history } = this.props;
    let newHistory = doHistoryStep(history, -1);
    this.props.onMoveBackward(newHistory);
  }

  handleMoveForward = () => {
    let { history } = this.props;
    let newHistory = doHistoryStep(history, 1);
    this.props.onMoveForward(newHistory);
  }

  render() {
    let {
      items,
      newButtonItems,
      newButtonText,
      history,
      onMoveBackward,
      onMoveForward
    } = this.props;
    let { showDropdownMenu } = this.state;

    let itemsElement = items.length ? (
      <div className="oc-fm--toolbar__items">
        {items.map((item, i) => (
          <button
            key={i}
            disabled={item.disabled}
            className={`oc-fm--toolbar__item`}
            title={item.label || ''}
            onClick={(!item.disabled && item.onClick) || (() => {})}
          >
            <SVG
              className="oc-fm--toolbar__item-icon"
              svg={item.icon && item.icon.svg}
              style={{ fill: (item.icon && item.icon.fill) || '#424242' }}
            />
          </button>
        ))}
      </div>
    ) : null;


    let newButtonElement = newButtonText ? (
      <button onClick={this.showDropdownMenu} className="oc-fm--toolbar__new-button">
        {newButtonText}
      </button>
    ) : newButtonItems.map((item, i) => (
      <button
        key={i}
        disabled={item.disabled}
        className={`oc-fm--toolbar__item`}
        title={item.label || ''}
        onClick={(!item.disabled && item.onClick) || (() => {})}
      >
        <SVG
          className="oc-fm--toolbar__item-icon"
          svg={item.icon && item.icon.svg}
          style={{ fill: (item.icon && item.icon.fill) || '#424242' }}
        />
      </button>
    ));

    let dropdownMenuItems = newButtonItems.map((item, i) => (
      <DropdownMenuItem key={i} icon={item.icon} onClick={item.onClick || (() => {})}>
        <span>{item.label}</span>
      </DropdownMenuItem>
    ));

    let dropdownMenuElement = showDropdownMenu ? (
      <DropdownMenu show={showDropdownMenu} onHide={this.hideDropdownMenu}>
        {dropdownMenuItems}
      </DropdownMenu>
    ) : null;

    let newButtonContainer = newButtonText ? (
      <div className="oc-fm--toolbar__new-button-container">
          {newButtonElement}
          {dropdownMenuElement}
      </div>
    ) : (
      <div className="oc-fm--toolbar__items">
        {newButtonElement}
      </div>
    );

    let navButtons = (
      <div className="oc-fm--toolbar__nav-buttons">
        <button
          disabled={!isHistoryStepPossible(history, -1)}
          className={`oc-fm--toolbar__item`}
          title={'Move back'}
          onClick={() => this.handleMoveBackward()}
        >
          <SVG
            className="oc-fm--toolbar__item-icon"
            svg={icons.moveBackward}
            style={{ fill: '#424242' }}
          />
        </button>

        <button
          disabled={!isHistoryStepPossible(history, 1)}
          className={`oc-fm--toolbar__item`}
          title={'Move forward'}
          onClick={() => this.handleMoveForward()}
        >
          <SVG
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
