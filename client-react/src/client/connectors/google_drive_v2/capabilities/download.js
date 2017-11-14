import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { HiddenDownloadForm, promptToSaveBlob } from '../../utils/download'
import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';

const downloadIcon = require('@opuscapita/svg-icons/lib/file_download.svg');

class DownloadMenuItem extends PureComponent {
  static propTypes = {
    selectedResources: PropTypes.array
  }

  state = {
    downloadUrl: null,
    newTab: false
  }

  handleClick = _ => (!this.state.downloadUrl && api.downloadResources(this.props.selectedResources).
      then(({ direct, downloadUrl, file, fileName, mimeType }) => direct ?
        // we have a direct download link
        !this.state.downloadUrl ?
          this.setState({
            downloadUrl,
            ...(mimeType === 'application/pdf' ? { newTab: true } : null)
          }) :
          console.log('downloadUrl is not empty') :
        // we don't have a direct link - download it silently and then prompt to save the blob
        promptToSaveBlob(file, fileName)
      ).catch(err => console.log(err)))

  handleDownloadWasCalled = _ => this.setState({
    downloadUrl: null,
    newTab: false
  })

  render() {
    const { downloadUrl, newTab } = this.state;

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
            target={newTab ? '_blank' : '_self'}
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
    return selectedResources.length > 0 && selectedResources[0].type !== 'dir';
  },
  contextMenuRenderer: (apiOptions) => {
    // const selectedResources = getSelectedResources()
    return (
      <DownloadMenuItem selectedResources={getSelectedResources()} />
    );
  }
});
