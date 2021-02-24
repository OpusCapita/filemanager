import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './LocationBar.less';
import Svg from '@opuscapita/react-svg/lib/SVG';
import {Popup} from 'semantic-ui-react';
const arrowIcon = require('@opuscapita/svg-icons/lib/keyboard_arrow_right.svg');

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    onClick: PropTypes.func
  })),
  loading: PropTypes.bool,
  rootUrl: PropTypes.string,
  toolTipStyle: PropTypes.object,
};
const defaultProps = {
  items: [],
  loading: false,
  rootUrl: '',
  toolTipStyle: PropTypes.object,
};

export default
class LocationBar extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const { items, loading, rootUrl, toolTipStyle } = this.props;

    if (!items.length) {
      return (
        <div className="oc-fm--location-bar__item oc-fm--location-bar__item--disabled">
          <div className={`oc-fm--location-bar__item-name`}>
            <span>&nbsp;</span>
          </div>
        </div>
      );
    }

    const itemsElement = items.map((item, i) => {
      const arrow = i < items.length - 1 ? (
        <Svg className="oc-fm--location-bar__item-arrow" svg={arrowIcon} />
      ) : null;

      const contentDiv = (<div
                               className={`
                                 oc-fm--location-bar__item-name
                                 ${loading ? 'oc-fm--location-bar__item-name--loading' : ''}
                               `}
                               name={item.name}
                             >
                               {item.name}
                             </div>
                         )
      // Add popup for first element to show rootUrl.
      const centerComp = (i==0 && rootUrl!=='') ?
                         (
                            <Popup content={rootUrl} position='bottom left' style={toolTipStyle} trigger={contentDiv} />
                         )
                         :
                         (contentDiv);

      return (
                <div
                  key={i}
                  tabIndex="0"
                  onClick={item.onClick} // eslint-disable-line react/jsx-handler-names
                  className={`
                    oc-fm--location-bar__item
                    ${i === items.length - 1 ? 'oc-fm--location-bar__item--last' : ''}
                  `}
                >
                  {centerComp}
                  {arrow}
                </div>
                );
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
