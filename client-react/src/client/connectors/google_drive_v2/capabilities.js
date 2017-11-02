import ContextMenuItem from '../../components/ContextMenuItem';
import SVG from '@opuscapita/react-svg/lib/SVG';
import api from './api';
import SetNameDialog from '../../components/SetNameDialog';


let downloadIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/file_download.svg');
let deleteIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/delete.svg');
let createFolderIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/create_new_folder.svg');

export default (apiOptions, { showDialog, hideDialog }) => ([
    {
    id: 'createFolder',
    shouldBeAvailable: (apiOptions, resources) => resources.length === 1,
    contextMenuRenderer: (apiOptions, resources) => (
      <ContextMenuItem
        icon={{ svg: createFolderIcon }}
        onClick={() => {
          showDialog((
            <SetNameDialog
              onHide={hideDialog}
              onSubmit={val => console.log('Submit!', val)}
              headerText={`Name`}
            />
          ));
          // api.createFolder(resources);
        }}
      >
        <span>Create folder</span>
      </ContextMenuItem>
    )
  },
  {
    id: 'download',
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
    id: 'delete',
    title: 'Remove',
    shouldBeAvailable: (apiOptions, resources) => resources.every(resource => resource.capabilities.canDelete),
    contextMenuRenderer: (apiOptions, resources) => (
      <ContextMenuItem icon={{ svg: deleteIcon }}>
        <span>Remove</span>
      </ContextMenuItem>
    )
  }
]);
