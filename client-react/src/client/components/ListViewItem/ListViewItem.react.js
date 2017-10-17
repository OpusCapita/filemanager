import React, { Component, PropTypes } from 'react';
import './ListViewItem.less';

const propTypes = {};
const defaultProps = {};

export default
class ListViewItem extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="list-view-item">
      </div>
    );
  }
}

ListViewItem.propTypes = propTypes;
ListViewItem.defaultProps = defaultProps;
