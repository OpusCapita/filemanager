import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';

let uploadIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/file_upload.svg');

export default (apiOptions, { showDialog, hideDialog, forceUpdate }) => ({
  id: 'download',
  shouldBeAvailable: (apiOptions, { selectedResources }) => {
    return selectedResources.length === 1 && selectedResources[0].type !== 'dir';
  },
  contextMenuRenderer: (apiOptions, { selectedResources, resource }) => (
    <ContextMenuItem
      icon={{ svg: uploadIcon }}
      onClick={() => api.uploadFileToId(resource.id)}
    >
      <span>Upload</span>
    </ContextMenuItem>
  )
});
