import React, { Component, PropTypes } from 'react';
import './SearchBar.less';

const propTypes = {};
const defaultProps = {};

export default
class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="search-bar">
      </div>
    );
  }
}

SearchBar.propTypes = propTypes;
SearchBar.defaultProps = defaultProps;
