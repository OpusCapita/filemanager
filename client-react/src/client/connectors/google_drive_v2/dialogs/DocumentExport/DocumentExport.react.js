import React, { Component, PropTypes } from 'react';
import './DocumentExport.less';

const propTypes = {
  onHide: PropTypes.func,
  onChange: PropTypes.func
};
const defaultProps = {
  onHide: () => {},
  onChange: () => {}
};

export default
class DocumentExport extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    let { onHide, onChange } = this.props;

    return (
      <div className="oc-fm--dialog">
        <div className="oc-fm--dialog__header">
          <div>Document type</div>
        </div>

        <button type="button" className="oc-fm--dialog__button" onClick={onHide}>
          Cancel
        </button>
      </div>
    );
  }
}

DocumentExport.propTypes = propTypes;
DocumentExport.defaultProps = defaultProps;
