import React, { Component, PropTypes } from 'react';
import './LocationBar.less';
import SVG from '@opuscapita/react-svg/lib/SVG';
let arrowIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/keyboard_arrow_right.svg');

const propTypes = {
  items: PropTypes.shape({
    title: PropTypes.string,
    onClick: PropTypes.func
  })
};
const defaultProps = {
  items: []
};

export default
class LocationBar extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    let { items } = this.props;

    let itemsElement = items.map((item, i) => {
      let arrow = i < items.length - 1 ? (
        <SVG className="oc-fm--location-bar__item-arrow" svg={arrowIcon} />
      ) : null;

      return (
        <div className="oc-fm--location-bar__item">
          <div
            className={`
              oc-fm--location-bar__item-title
              ${i === items.length - 1 ? 'oc-fm--location-bar__item-title--last': ''}
            `}
            tabIndex="0"
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
