import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';
import NotificationProgressItem from '../../../components/NotificationProgressItem';
import notifUtils from '../../../components/Notifications/utils';
import { getIcon } from '../icons';
import nanoid from 'nanoid';

let uploadIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/file_upload.svg');

function handler(apiOptions, {
  id,
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
}) {
  let notificationId = 'upload';
  let notificationChildId = id;

  let onStart = ({ name, size }) => {
    let notifications = getNotifications();
    let notification = notifUtils.getNotification(notifications, notificationId);
    let childElement = (
      <NotificationProgressItem title={name} progress={0} icon={getIcon({ title: name })} />
    );

    let newChildren = notifUtils.addChild((notification && notification.children) || [], notificationChildId, childElement);
    let newNotification = {
      title: `Uploading ${newChildren.length} ${newChildren.length > 1 ? 'items' : 'item'}`,
      children: newChildren
    };

    let newNotifications = notification ?
      notifUtils.updateNotification(notifications, notificationId, newNotification):
      notifUtils.addNotification(notifications, notificationId, newNotification);

    updateNotifications(newNotifications);
  };

  let onSuccess = () => {
    let notifications = getNotifications();
    let notification = notifUtils.getNotification(notifications, notificationId);
    let notificationChildrenCount = notification.children.length;
    let newNotifications;

    if (notificationChildrenCount > 1) {
      newNotifications = notifUtils.updateNotification(
        notifications,
        notificationId, {
          children: notifUtils.removeChild(notification.children, notificationChildId)
        }
      );
    } else {
      newNotifications = notifUtils.removeNotification(notifications, notificationId);
    }

    updateNotifications(newNotifications);
  };

  let onFail = () => {};
  let onProgress = (progress) => {
    let notifications = getNotifications();
    let notification = notifUtils.getNotification(notifications, notificationId);
    let child = notifUtils.getChild(notification.children, notificationChildId);
    let newChild = { ...child, element: { ...child.element, props: { ...child.element.props, progress } }};
    let newChildren = notifUtils.updateChild(notification.children, notificationChildId, newChild);
    let newNotifications = notifUtils.updateNotification(notifications, notificationId, { children: newChildren });
    updateNotifications(newNotifications);
  };

  let resource = getResource();
  api.uploadFileToId(resource.id, { onStart, onSuccess, onFail, onProgress });
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
  id: 'upload',
  shouldBeAvailable: (apiOptions) => {
    let selectedResources = getSelectedResources();
    return selectedResources.length === 1 && selectedResources[0].type !== 'dir';
  },
  contextMenuRenderer: (apiOptions) => (
    <ContextMenuItem
      icon={{ svg: uploadIcon }}
      onClick={() => handler(apiOptions, {
        id: nanoid(),
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
      })}
    >
      <span>Upload</span>
    </ContextMenuItem>
  )
});
