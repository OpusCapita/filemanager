import React, { Component, PropTypes } from 'react';
import './ListViewItem.less';

const propTypes = {
  iconUrl: PropTypes.string,
  title: PropTypes.string,
  size: PropTypes.string,
  humanReadableSize: PropTypes.bool,
  lastModified: PropTypes.string,
  dateTimePattern: PropTypes.string
};
const defaultProps = {
  iconUrl: '',
  title: "Customer folder",
  size: "355555500000",
  humanReadableSize: true,
  lastModified: "1508749017098",
  dateTimePattern: "yyyy-MM-dd HH:mm:ss"
};

export default
class ListViewItem extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="oc-fm__list-view-item">

      </div>
    );
  }
}

ListViewItem.propTypes = propTypes;
ListViewItem.defaultProps = defaultProps;
