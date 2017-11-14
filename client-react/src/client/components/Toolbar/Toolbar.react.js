import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './Toolbar.less';
import SVG from '@opuscapita/react-svg/lib/SVG';
import DropdownMenu from '../DropdownMenu';
import DropdownMenuItem from '../DropdownMenuItem';

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
  newButtonText: PropTypes.string
};
const defaultProps = {
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

  render() {
    let { items, newButtonItems, newButtonText } = this.props;
    let { showDropdownMenu } = this.state;

    let itemsElement = items.length ? (
      <div className="oc-fm--toolbar__items">
        {items.map((item, i) => (
          <button
            key={i}
            disabled={item.disabled}
            className={`oc-fm--toolbar__item ${item.disabled ? 'oc-fm--toolbar__item--disabled' : ''}`}
            title={item.label || ''}
            onClick={(!item.disabled && item.onClick) || (() => {})}
          >
            <SVG
              className="oc-fm--toolbar__item-icon"
              svg={item.icon && item.icon.svg}
              style={{ fill: (item.icon && item.icon.fill) || 'rgba(0,0,0,.72)' }}
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
        className={`oc-fm--toolbar__item ${item.disabled ? 'oc-fm--toolbar__item--disabled' : ''}`}
        title={item.label || ''}
        onClick={(!item.disabled && item.onClick) || (() => {})}
      >
        <SVG
          className="oc-fm--toolbar__item-icon"
          svg={item.icon && item.icon.svg}
          style={{ fill: (item.icon && item.icon.fill) || 'rgba(0,0,0,.72)' }}
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

    return (
      <div className="oc-fm--toolbar">
        {newButtonContainer}
        {itemsElement}
      </div>
    );
  }
}

Toolbar.propTypes = propTypes;
Toolbar.defaultProps = defaultProps;
