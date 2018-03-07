import api from '../api';
import notifUtils from '../utils/notifications';
import { getIcon } from '../icons';
import nanoid from 'nanoid';
import onFailError from '../utils/onFailError';
import icons from '../icons-svg';
import getMess from '../../translations';
import { normalizeResource } from '../utils/common';

let label = 'upload';

async function handler(apiOptions, {
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
  let getMessage = getMess.bind(null, apiOptions.locale);

  let notificationId = label;
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
      title: newChildren.length > 1 ?
        getMessage('uploadingItems', { quantity: newChildren.length }) :
        getMessage('uploadingItem'),
      children: newChildren
    };

    let newNotifications = notification ?
      notifUtils.updateNotification(notifications, notificationId, newNotification) :
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

  const onProgress = progress => {
    const notifications = getNotifications();
    const notification = notifUtils.getNotification(notifications, notificationId);
    const child = notifUtils.getChild(notification.children, notificationChildId);
    const newChild = {
      ...child,
      element: {
        ...child.element,
        elementProps: {
          ...child.element.elementProps,
          progress
        }
      }
    };
    const newChildren = notifUtils.updateChild(notification.children, notificationChildId, newChild);
    const newNotifications = notifUtils.updateNotification(notifications, notificationId, { children: newChildren });
    updateNotifications(newNotifications);
  };

  let resource = getResource();
  try {
    const response = await api.uploadFileToId(apiOptions, resource.id, { onStart, onProgress });
    let newResource = normalizeResource(response.body[0]);
    onSuccess(newResource.id);
  } catch (err) {
    onFailError({
      getNotifications,
      label: getMessage(label),
      notificationId,
      updateNotifications
    });
    console.log(err)
  }
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
    icon: { svg: icons.fileUpload },
    label: localeLabel,
    shouldBeAvailable: (apiOptions) => {
      const resource = getResource();
      if (!resource || !resource.capabilities) {
        return false
      }
      return resource.capabilities.canAddChildren
    },
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
