import React, { Component, PropTypes } from 'react';
import './NotificationProgressItem.less';
import ProgressIcon from '../ProgressIcon';
import SVG from '@opuscapita/react-svg/lib/SVG';

const propTypes = {
  icon: PropTypes.shape({ svg: PropTypes.string, fill: PropTypes.string }),
  title: PropTypes.node,
  progress: PropTypes.number,
  onClick: PropTypes.func,
  onProgressClick: PropTypes.func
};
const defaultProps = {
  icon: null,
  title: '',
  progress: 100,
  onClick: () => {},
  onProgressClick: () => {}
};

export default
class NotificationProgressItem extends Component {
  render() {
    let {
      icon,
      title,
      progress,
      onClick
    } = this.props;

    let iconElement = icon ? (
      <div className="oc-fm--notification-progress-item__icon">
        <SVG svg={icon.svg} style={{ fill: icon.fill || '#333' }} />
      </div>
    ) : null;

    let titleElement = title ? (
      <div className="oc-fm--notification-progress-item__title" title={title}>
        {title}
      </div>
    ) : null;

    return (
      <div className="oc-fm--notification-progress-item">
        {iconElement}
        {titleElement}
        <div className="oc-fm--notification-progress-item__progress-icon">
          <ProgressIcon radius={12} progress={progress} />
        </div>
      </div>
    );
  }
}

NotificationProgressItem.propTypes = propTypes;
NotificationProgressItem.defaultProps = defaultProps;
