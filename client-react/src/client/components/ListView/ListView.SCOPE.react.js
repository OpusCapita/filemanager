/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import React, { Component, PropTypes } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import { SortDirection } from 'react-virtualized';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';
import { NameCell, SizeCell, DateTimeCell, HeaderCell } from './Cells.react';

window.NameCell = NameCell;
window.SizeCell = SizeCell;
window.DateTimeCell = DateTimeCell;
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
        <DragDropContextProvider backend={HTML5Backend}>
          {this._renderChildren()}
        </DragDropContextProvider>
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
