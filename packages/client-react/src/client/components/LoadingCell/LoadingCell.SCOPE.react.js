/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';

@showroomScopeDecorator
export default
class LoadingCellScope extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        {this._renderChildren()}
      </div>
    );
  }
}

LoadingCellScope.contextTypes = {
  i18n: PropTypes.object
};
LoadingCellScope.childContextTypes = {
  i18n: PropTypes.object
};
