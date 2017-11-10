import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';
import NotificationProgressItem from '../../../components/NotificationProgressItem';
import notifUtils from '../../../components/Notifications/utils';
import { getIcon } from '../icons';

let uploadIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/file_upload.svg');

function handler(apiOptions, {
  showDialog,
  hideDialog,
  forceUpdate,
  updateNotifications,
  selection,
  selectedResources,
  resource,
  resourceChildren,
  resourceLocation,
  notifications
}) {
  let notificationId = 'upload';
  let onStart = ({ name, size }) => {
    let notificationId = 'upload';
    let oldNotification = notifUtils.getNotificationById(notifications, notificationId);
    let oldChildren = (oldNotification && oldNotification.children) || [];
    let newChildren = oldChildren.concat([(
      <NotificationProgressItem
        title={name}
        progress={0}
        icon={getIcon({ title: name })}
      />
    )]);

    let notification = {
      title: `Upload ${newChildren.length} ${newChildren.length > 1 ? 'items' : 'item'}`,
      children: newChildren
    };
    console.log('old notif', oldNotification);
    let newNotifications = oldNotification ?
      notifUtils.updateNotification(notifications, notificationId, notification):
      notifUtils.addNotification(notifications, notificationId, notification);
    console.log('new notif', newNotifications);
    updateNotifications(newNotifications);
  };
  let onSuccess = () => {};
  let onFail = () => {};
  let onProgress = () => {};

  console.log('upload', updateNotifications);
  api.uploadFileToId(resource.id, { onStart, onSuccess, onFail, onProgress });
}

export default (apiOptions, { showDialog, hideDialog, forceUpdate, updateNotifications }) => ({
  id: 'upload',
  shouldBeAvailable: (apiOptions, { selectedResources }) => {
    return selectedResources.length === 1 && selectedResources[0].type !== 'dir';
  },
  contextMenuRenderer: (apiOptions, {
    selection,
    selectedResources,
    resource,
    resourceChildren,
    resourceLocation,
    notifications
  }) => console.log('dd', updateNotifications) || (
    <ContextMenuItem
      icon={{ svg: uploadIcon }}
      onClick={() => handler(apiOptions, {
        showDialog,
        hideDialog,
        forceUpdate,
        updateNotifications,
        selection,
        selectedResources,
        resource,
        resourceChildren,
        resourceLocation,
        notifications
      })}
    >
      <span>Upload</span>
    </ContextMenuItem>
  )
});
