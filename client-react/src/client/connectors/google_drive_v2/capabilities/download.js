import React from 'react';
import { triggerHiddenForm, promptToSaveBlob } from '../../utils/download'
import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';

const icon = require('@opuscapita/svg-icons/lib/file_download.svg');
const label = 'Download';

function handler(apiOptions, {
  id,
  showDialog,
  hideDialog,
  navigateToDir,
  updateNotifications,
  getSelection,
  getSelectedResources,
  getResource,
  getResourceChildren,
  getResourceLocation,
  getNotifications
}) {
  let selectedResources = getSelectedResources();

  return api.downloadResources(selectedResources).
    then(({ direct, downloadUrl, file, fileName, mimeType }) => direct ?
      triggerHiddenForm({
        downloadUrl,
        ...(mimeType === 'application/pdf' ? { target: '_blank' } : null)
      }) :
      promptToSaveBlob(file, fileName)
    ).catch(err => console.log(err))
}

export default (apiOptions, {
  showDialog,
  hideDialog,
  navigateToDir,
  updateNotifications,
  getSelection,
  getSelectedResources,
  getResource,
  getResourceChildren,
  getResourceLocation,
  getNotifications
}) => ({
  id: 'download',
  icon: { svg: icon },
  label,
  shouldBeAvailable: (apiOptions) => {
    const selectedResources = getSelectedResources();
    return selectedResources.length > 0 && selectedResources[0].type !== 'dir';
  },
  handler: () => handler(apiOptions, {
    showDialog,
    hideDialog,
    navigateToDir,
    updateNotifications,
    getSelection,
    getSelectedResources,
    getResource,
    getResourceChildren,
    getResourceLocation,
    getNotifications
  }),
  availableInContexts: ['row', 'toolbar'],
  contextMenuRenderer: (apiOptions) => {
    return (
      <ContextMenuItem
        icon={{ svg: icon }}
        onClick={_ => handler(apiOptions, { getSelectedResources })}
      >
        <span>{ label }</span>
      </ContextMenuItem>
    );
  }
});
