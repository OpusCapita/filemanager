import ContextMenuItem from '../../components/ContextMenuItem';
import SVG from '@opuscapita/react-svg/lib/SVG';
import api from './api';
import DocumentExport from './dialogs/DocumentExport';
let downloadIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/file_download.svg');
let deleteIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/delete.svg');

export default (apiOptions, { showDialog, hideDialog }) => ([
  {
    id: 'canDownload',
    shouldBeAvailable: (apiOptions, resources) => resources.length === 1 && resources[0].type !== 'dir',
    contextMenuRenderer: (apiOptions, resources) => (
      <ContextMenuItem
        icon={{ svg: downloadIcon }}
        onClick={() => api.downloadResources(resources)}
      >
        <span>Download</span>
      </ContextMenuItem>
    )
  },
  {
    id: 'canDelete',
    title: 'Remove',
    shouldBeAvailable: (apiOptions, resources) => resources.every(resource => resource.capabilities.canDelete),
    contextMenuRenderer: (apiOptions, resources) => (
      <ContextMenuItem icon={{ svg: deleteIcon }}>
        <span>Remove</span>
      </ContextMenuItem>
    )
  }
]);
