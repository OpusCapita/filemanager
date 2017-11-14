import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

function promptToSaveBlob(content, name) {
  let objectUrl = URL.createObjectURL(new Blob([content], { type: 'octet/stream' }));

  let downloadLink = document.createElement("a");
  downloadLink.href = objectUrl;
  downloadLink.download = name;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// TODO combine with promptToSaveBlob for consistensy
class HiddenDownloadForm extends PureComponent {
  static propTypes = {
    downloadUrl: PropTypes.string,
    method: PropTypes.string,
    target: PropTypes.string,
    onDownloadWasCalled: PropTypes.func
  }

  static defaultProps = {
    method: 'GET',
    target: '_self'
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).submit();
    this.props.onDownloadWasCalled();
  }

  render() {
    const { downloadUrl, method, target } = this.props;

    return (<form
      target={target}
      action={downloadUrl}
      style={{ display: 'none' }}
      method={method}
    >
    </form>)
  }
}

export {
  promptToSaveBlob,
  HiddenDownloadForm
};
