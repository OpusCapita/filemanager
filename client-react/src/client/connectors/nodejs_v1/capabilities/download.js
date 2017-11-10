import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';

let downloadIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/file_download.svg');

export default (apiOptions, { showDialog, hideDialog, forceUpdate }) => ({
  id: 'download',
  shouldBeAvailable: (apiOptions, { selectedResources }) => {
    return selectedResources.length === 1 && selectedResources[0].type !== 'dir';
  },
  contextMenuRenderer: (apiOptions, { selectedResources }) => (
    <ContextMenuItem
      icon={{ svg: downloadIcon }}
      onClick={() => api.downloadResources(apiOptions, selectedResources)}
    >
      <span>Download</span>
    </ContextMenuItem>
  )
});
