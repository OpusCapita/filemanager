// Inspired by https://codepen.io/xgad/post/svg-radial-progress-meters

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import './ProgressIcon.less';
import Svg from '@opuscapita/react-svg/lib/SVG';
let completeIcon = require('@opuscapita/svg-icons/lib/done.svg');

const propTypes = {
  progress: PropTypes.number,
  radius: PropTypes.number
};
const defaultProps = {
  progress: 0,
  radius: 12
};

const viewportSize = 120;
const circlePos = viewportSize / 2;

export default
class ProgressIcon extends Component {
  render() {
    let { progress, radius } = this.props;

    let size = `${radius * 2}px`;

    if (progress === 100) {
      return (
        <div
          className="oc-fm--progress-icon"
          style={{ width: size, height: size }}
        >
          <Svg
            className="oc-fm--progress-icon__complete"
            svg={completeIcon}
            style={{ fill: '#fff', width: size, height: size }}
          />
        </div>
      );
    }

    let strokeWidth = Math.log(radius) * 5;
    let circleRadius = 60 - strokeWidth / 2;
    let circumference = 2 * Math.PI * circleRadius;
    let dashOffset = circumference * (1 - progress / 100);

    return (
      <div
        className="oc-fm--progress-icon"
        style={{ width: size, height: size }}
      >
        <svg className="oc-fm--progress-icon__svg" viewBox={`0 0 ${viewportSize} ${viewportSize}`}>
          <circle
            className="oc-fm--progress-icon__svg-meter"
            cx={circlePos}
            cy={circlePos}
            r={circleRadius}
            strokeWidth={strokeWidth}
          />
          <circle
            className="oc-fm--progress-icon__svg-value"
            cx={circlePos}
            cy={circlePos}
            r={circleRadius}
            strokeWidth={strokeWidth}
            strokeDashoffset={dashOffset}
            strokeDasharray={circumference}
          />
        </svg>
      </div>
    );
  }
}

ProgressIcon.propTypes = propTypes;
ProgressIcon.defaultProps = defaultProps;
