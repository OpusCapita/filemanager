import React, { Component, PropTypes } from 'react';
import './ProgressIcon.less';

const propTypes = {
  progress: PropTypes.number,
  radius: PropTypes.number
};
const defaultProps = {
  progress: 0,
  radius: 24
};

export default
class ProgressIcon extends Component {
  render() {
    let { progress, radius } = this.props;

    let circumference = 2 * Math.PI * radius;
    var dashOffset = circumference * (1 - progress / 100);
    let strokeWidth = radius / 3;
    let size = `${radius * 2}px`;
    console.log('progress:', progress);
    console.log('dashOffset:', dashOffset);
    return (
      <div
        className="oc-fm--progress-icon"
        style={{ width: size, height : size }}
      >
        <svg className="oc-fm--progress-icon__svg" viewBox="0 0 120 120">
          <circle
            className="oc-fm--progress-icon__svg-meter"
            cx="60"
            cy="60"
            r={radius}
            strokeWidth={strokeWidth}
          />
          <circle
            className="oc-fm--progress-icon__svg-value"
            cx="60"
            cy="60"
            r={radius}
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
