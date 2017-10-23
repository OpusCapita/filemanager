/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import React, { Component, PropTypes } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';

@showroomScopeDecorator
export default
class ListViewScope extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: []
    };
  }

  handleSelection = (selection) => {
    this.setState({ selection });
    console.log('current selection:', selection);
  }

  handleUnselect(id) {
    let index = this.state.selection.indexOf(id);
    let selection =  index === -1 ?
      this.state.selection :
      [].
        concat(this.state.selection.slice(0, index)).
        concat(this.state.selection.slice(index + 1, this.state.selection.length));

    this.setState({ selection });

    console.log('remove from selection:', id);
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
