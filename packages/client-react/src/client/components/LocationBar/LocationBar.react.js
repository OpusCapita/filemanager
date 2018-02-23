import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './LocationBar.less';
import Svg from '@opuscapita/react-svg/lib/SVG';
let arrowIcon = require('@opuscapita/svg-icons/lib/keyboard_arrow_right.svg');

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
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
        <div className="oc-fm--location-bar__item oc-fm--location-bar__item--disabled">
          <div className={`oc-fm--location-bar__item-name`}>
            <span>&nbsp;</span>
          </div>
        </div>
      );
    }

    let itemsElement = items.map((item, i) => {
      let arrow = i < items.length - 1 ? (
        <Svg className="oc-fm--location-bar__item-arrow" svg={arrowIcon} />
      ) : null;

      return (
        <div
          key={i}
          tabIndex="0"
          onClick={item.onClick} // eslint-disable-line
          className={`
            oc-fm--location-bar__item
            ${i === items.length - 1 ? 'oc-fm--location-bar__item--last' : ''}
          `}
        >
          <div
            className={`
              oc-fm--location-bar__item-name
              ${loading ? 'oc-fm--location-bar__item-name--loading' : ''}
            `}
            name={item.name}
          >
            {item.name}
          </div>
          {arrow}
        </div>
      )
    });

    return (
      <div className="oc-fm--location-bar">
        {itemsElement}
      </div>
    );
  }
}

LocationBar.propTypes = propTypes;
LocationBar.defaultProps = defaultProps;
