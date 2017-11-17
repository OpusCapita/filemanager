import api from '../api';
import notifUtils from '../../../components/Notifications/utils';
import { getIcon } from '../icons';
import nanoid from 'nanoid';
import onFailError from '../../utils/onFailError';
import icons from '../icons-svg';

let icon = icons.fileUpload;
let label = 'Upload';

function handler(apiOptions, {
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
  let notificationId = 'upload';
  let notificationChildId = nanoid();
  let prevResourceId = getResource().id;

  let onStart = ({ name, size }) => {
    let notifications = getNotifications();
    let notification = notifUtils.getNotification(notifications, notificationId);
    let childElement = {
      elementType: 'NotificationProgressItem',
      elementProps: {
        title: name,
        progress: 0,
        icon: getIcon({ name })
      }
    };

    let newChildren =
      notifUtils.addChild((notification && notification.children) || [], notificationChildId, childElement);
    let newNotification = {
      title: `Uploading ${newChildren.length} ${newChildren.length > 1 ? 'items' : 'item'}`,
      children: newChildren
    };

    let newNotifications = notification ?
      notifUtils.updateNotification(notifications, notificationId, newNotification):
      notifUtils.addNotification(notifications, notificationId, newNotification);

    updateNotifications(newNotifications);
  };

  let onSuccess = (newResourceId) => {
    let resource = getResource();
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

    if (prevResourceId === resource.id) {
      navigateToDir(resource.id, newResourceId, false);
    }
  };

  const onFail = _ => onFailError({
    getNotifications,
    label,
    notificationId,
    updateNotifications
  });

  let onProgress = (progress) => {
    let notifications = getNotifications();
    let notification = notifUtils.getNotification(notifications, notificationId);
    let child = notifUtils.getChild(notification.children, notificationChildId);
    let newChild = {
      ...child,
      element: {
        ...child.element,
        elementProps: {
          ...child.element.elementProps,
          progress
        }
      }
    };
    let newChildren = notifUtils.updateChild(notification.children, notificationChildId, newChild);
    let newNotifications = notifUtils.updateNotification(notifications, notificationId, { children: newChildren });
    updateNotifications(newNotifications);
  };

  let resource = getResource();
  api.uploadFileToId(apiOptions, resource.id, { onStart, onSuccess, onFail, onProgress });
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
  id: 'upload',
  icon: { svg: icon },
  label,
  shouldBeAvailable: (apiOptions) => true,
  availableInContexts: ['files-view', 'new-button'],
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
  contextMenuRenderer: (apiOptions) => ({
    elementType: 'ContextMenuItem',
    elementProps: {
      icon: { svg: icon },
      onClick: () => handler(apiOptions, {
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
      children: label
    }
  })
});
