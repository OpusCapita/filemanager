import React, { Component, PropTypes } from 'react';
import './DocumentExport.less';

const propTypes = {};
const defaultProps = {};

export default
class DocumentExport extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="document-export">
        CHOOSE DOCUMENT EXPORT TYPE
      </div>
    );
  }
}

DocumentExport.propTypes = propTypes;
DocumentExport.defaultProps = defaultProps;
