/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import React, { Component, PropTypes } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import { SortDirection } from 'react-virtualized';

@showroomScopeDecorator
export default
class ListViewScope extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: [],
      sortBy: 'title',
      sortDirection: SortDirection.ASC
    };
  }

  handleSelection = (selection) => {
    this.setState({ selection });
  }

  handleSort = ({ sortBy, sortDirection }) => {
    this.setState({ sortBy, sortDirection });
  }

  render() {
    return (
      <div>
        {this._renderChildren()}
      </div>
    );
  }
}

ListViewScope.contextTypes = {
  i18n: PropTypes.object
};
ListViewScope.childContextTypes = {
  i18n: PropTypes.object
};
