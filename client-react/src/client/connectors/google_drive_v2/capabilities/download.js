import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { HiddenDownloadForm, downloadFile } from '../../utils/download'
import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';

const downloadIcon = require('@opuscapita/svg-icons/lib/file_download.svg');

class DownloadMenuItem extends PureComponent {
  static propTypes = {
    selectedResources: PropTypes.array
  }

  state = {
    downloadUrl: null
  }

  handleClick = _ => {
    if (!this.state.downloadUrl) {
      api.downloadResources(this.props.selectedResources).
        then(result => {
          const { direct, downloadUrl, file, title } = result;
          if (direct) {
            if (!this.state.downloadUrl) {
              this.setState({ downloadUrl })
            } else {
              console.log('downloadUrl is not empty')
            }
          } else {
            downloadFile(file, title)
          }
        })
    }
  }

  handleDownloadWasCalled = _ => this.setState({
    downloadUrl: null
  })

  render() {
    const { downloadUrl } = this.state;

    return (
      <ContextMenuItem
        icon={{ svg: downloadIcon }}
        onClick={this.handleClick}
      >
        <span>Download</span>
        {
          downloadUrl && <HiddenDownloadForm
            downloadUrl={downloadUrl}
            onDownloadWasCalled={this.handleDownloadWasCalled}
          />
        }
      </ContextMenuItem>
    );
  }
}

export default (apiOptions, {
  showDialog,
  hideDialog,
  forceUpdate,
  updateNotifications,
  getSelection,
  getSelectedResources,
  getResource,
  getResourceChildren,
  getResourceLocation,
  getNotifications
}) => ({
  id: 'download',
  shouldBeAvailable: (apiOptions) => {
    const selectedResources = getSelectedResources();
    return selectedResources.length === 1 && selectedResources[0].type !== 'dir';
  },
  contextMenuRenderer: (apiOptions) => {
    const selectedResources = getSelectedResources()
    return (
      <DownloadMenuItem selectedResources={getSelectedResources()} />
    );
  }
});
