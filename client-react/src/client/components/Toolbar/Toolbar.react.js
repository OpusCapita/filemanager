import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './Toolbar.less';
import SVG from '@opuscapita/react-svg/lib/SVG';

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
    this.state = { };
  }

  render() {
    let { items, newButtonItems, newButtonText } = this.props;

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

    let newButton = (
      <button className="oc-fm--toolbar__new-button">
        {newButtonText}
      </button>
    );

    return (
      <div className="oc-fm--toolbar">
        <div className="oc-fm--toolbar__new-button-container">
          {newButton}
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
