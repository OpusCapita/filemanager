import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';

let deleteIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/delete.svg');

export default (apiOptions, { showDialog, hideDialog, forceUpdate }) => ({
  id: 'delete',
  title: 'Remove',
  shouldBeAvailable: (apiOptions, { selectedResources }) => {
    return selectedResources.every(resource => resource.capabilities.canDelete);
  },
  contextMenuRenderer: (apiOptions, { selectedResources }) => (
    <ContextMenuItem icon={{ svg: deleteIcon }}>
      <span>Remove</span>
    </ContextMenuItem>
  )
});
