import api from '../api';
import notifUtils from '../utils/notifications';
import { getIcon } from '../icons';
import nanoid from 'nanoid';
import icons from '../icons-svg';
import getMess from '../../translations';

let icon = icons.fileUpload;
let label = 'upload';

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
  let notificationId = label;
  let notificationChildId = nanoid();
  let getMessage = getMess.bind(null, apiOptions.locale);

  let onStart = ({ name, size }) => {
    let notifications = getNotifications();
    let notification = notifUtils.getNotification(notifications, notificationId);
    let childElement = {
      elementType: 'NotificationProgressItem',
      elementProps: {
        title: name,
        progress: 0,
        icon: getIcon({ title: name })
      }
    };

    let newChildren = notifUtils.addChild((notification && notification.children) || [], notificationChildId, childElement);
    let newNotification = {
      title: newChildren.length > 1 ? getMessage('uploadingItems', { quantity: newChildren.length }) : getMessage('uploadingItem'),
      children: newChildren
      // progressText: `2 minutes left…`, // TODO
      // cancelButtonText: "Cancel",
      // onCancel: () => console.log('cancel')
    };

    let newNotifications = notification ?
      notifUtils.updateNotification(notifications, notificationId, newNotification):
      notifUtils.addNotification(notifications, notificationId, newNotification);

    updateNotifications(newNotifications);
  };

  let onSuccess = (res) => {
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
    navigateToDir(resource.id, null, false);
  };

  let onFail = () => {};
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
  api.uploadFileToId(resource.id, { onStart, onSuccess, onFail, onProgress });
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
}) => {
  const localeLabel = getMess(apiOptions.locale, label);
  return {
    id: label,
    icon: { svg: icon },
    label: localeLabel,
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
    })
  };
}
