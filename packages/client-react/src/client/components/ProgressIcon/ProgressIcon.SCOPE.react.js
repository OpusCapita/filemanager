/*
   What is a SCOPE file. See documentation here:
   https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
*/

import React, { Component } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';

@showroomScopeDecorator
export default
class ProgressIconScope extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };

    this.progressInterval = setInterval(() => {
      let newProgress = this.state.progress < 100 ? this.state.progress + 1 : 0;
      this.setState({ progress: newProgress });
    }, 16);
  }

  componentWillUnmount() {
    clearInterval(this.progressInterval);
  }

  render() {
    return (
      <div>
        {this._renderChildren()}
      </div>
    );
  }
}
