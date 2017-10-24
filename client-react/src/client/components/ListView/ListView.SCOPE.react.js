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
