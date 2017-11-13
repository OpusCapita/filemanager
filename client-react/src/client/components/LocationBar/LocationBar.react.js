import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './LocationBar.less';
import SVG from '@opuscapita/react-svg/lib/SVG';
let arrowIcon = require('@opuscapita/svg-icons/lib/keyboard_arrow_right.svg');

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    onClick: PropTypes.func
  })),
  loading: PropTypes.bool
};
const defaultProps = {
  items: [],
  loading: false
};

export default
class LocationBar extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    let { items, loading } = this.props;

    if (!items.length) {
      return (
        <div className="oc-fm--location-bar__item">
          <div className={`oc-fm--location-bar__item-title oc-fm--location-bar__item-title--disabled`}>
            <span>&nbsp;</span>
          </div>
        </div>
      );
    }

    let itemsElement = items.map((item, i) => {
      let arrow = i < items.length - 1 ? (
        <SVG className="oc-fm--location-bar__item-arrow" svg={arrowIcon} />
      ) : null;

      return (
        <div
          key={i}
          tabIndex="0"
          className={`
            oc-fm--location-bar__item
            ${i === items.length - 1 ? 'oc-fm--location-bar__item--last': ''}
          `}
        >
          <div
            className={`
              oc-fm--location-bar__item-title
              ${loading ? 'oc-fm--location-bar__item-title--loading': ''}
            `}
            title={item.title}
            onClick={item.onClick}
          >
            {item.title}
          </div>
          {arrow}
        </div>
    )});

    return (
      <div className="oc-fm--location-bar">
        {itemsElement}
      </div>
    );
  }
}

LocationBar.propTypes = propTypes;
LocationBar.defaultProps = defaultProps;
