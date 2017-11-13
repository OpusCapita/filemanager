import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { HiddenDownloadForm } from '../../utils/download'
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
        then(({ done, downloadUrl }) => {
          if (done) {
            return
          }
          if (!this.state.downloadUrl) {
            this.setState({
              downloadUrl
            })
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
