/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import React, { Component } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import { SortDirection, Column } from 'react-virtualized';
import Cell from '../Cell';
import NameCell from '../NameCell';
import HeaderCell from '../HeaderCell';

window.Column = Column;
window.Cell = Cell;
window.NameCell = NameCell;
window.HeaderCell = HeaderCell;

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
