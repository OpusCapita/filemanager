import React, { Component, PropTypes } from 'react';
import './GridViewItem.less';

const propTypes = {
  iconUrl: PropTypes.string,
  title: PropTypes.string
};
const defaultProps = {
  iconUrl: '',
  title: ''
};

export default
class GridViewItem extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    let {
      iconUrl,
      title
    } = this.props;

    return (
      <div className="oc-fm-grid-view-item">
        <div className="oc-fm-grid-view-item__title">
          {title}
        </div>
      </div>
    );
  }
}

GridViewItem.propTypes = propTypes;
GridViewItem.defaultProps = defaultProps;
