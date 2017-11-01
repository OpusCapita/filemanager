import ContextMenuItem from '../../components/ContextMenuItem';
import SVG from '@opuscapita/react-svg/lib/SVG';
import api from './api';
import DocumentExport from './dialogs/DocumentExport';
let downloadIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/file_download.svg');
let deleteIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/delete.svg');

export default (apiOptions, { showDialog, hideDialog }) => ([
  {
    id: 'canDownload',
    shouldBeAvailable: (apiOptions, resources) => resources.length >= 1,
    contextMenuRenderer: (apiOptions, resources) => (
      <ContextMenuItem
        icon={{ svg: downloadIcon }}
        onClick={() => api.downloadResources(resources, {
          onChooseDocumentExportType: (props) => {
            showDialog(<DocumentExport {...props} />);
          }
        })}
      >
        <span>Download</span>
      </ContextMenuItem>
    ),
    dialogs: (apiOptions, props) => ({
      download: (apiOptions, { onDialogEnd, resources }) => (
        <div>
          <button type="button" onClick={() => onDialogEnd('success')}>Success</button>
          <button type="button" onClick={() => onDialogEnd('fail')}>Fail</button>
          <button type="button" onClick={() => console.log(resources)}>Log resources</button>
        </div>
      )
    })
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
