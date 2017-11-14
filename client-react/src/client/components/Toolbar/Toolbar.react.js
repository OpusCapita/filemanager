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
  newButtonItems: [],
  newButtonText: 'New'
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

    let itemsElement = items.map((item, i) => (
      <button
        key={i}
        className="oc-fm--toolbar__item"
        title={item.label || ''}
        onClick={item.onClick || (() => {})}
      >
        <SVG
          className="oc-fm--toolbar__item-icon"
          svg={item.icon && item.icon.svg}
          style={{ fill: (item.icon && item.icon.fill) || '#333' }}
        />
      </button>
    ));

    let newButtonElement = (
      <button onClick={this.showDropdownMenu} className="oc-fm--toolbar__new-button">
        {newButtonText}
      </button>
    );

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

    return (
      <div className="oc-fm--toolbar">
        <div className="oc-fm--toolbar__new-button-container">
          {newButtonElement}
          {dropdownMenuElement}
        </div>
        <div className="oc-fm--toolbar__items">
          {itemsElement}
        </div>
      </div>
    );
  }
}

Toolbar.propTypes = propTypes;
Toolbar.defaultProps = defaultProps;
