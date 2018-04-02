import api from '../api';
import notifUtils from '../utils/notifications';
import { getIcon } from '../icons';
import nanoid from 'nanoid';
import icons from '../icons-svg';
import getMess from '../translations';
import { readLocalFile } from "../utils/upload";

let label = 'upload';

async function handler(apiOptions, actions) {
  const {
    navigateToDir,
    updateNotifications,
    getResource,
    getNotifications
  } = actions;

  let notificationId = label;
  let notificationChildId = nanoid();
  let getMessage = getMess.bind(null, apiOptions.locale);

  let onStart = (name) => {
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

    let newChildren =
      notifUtils.addChild((notification && notification.children) || [], notificationChildId, childElement);
    let newNotification = {
      title: newChildren.length > 1 ?
        getMessage('uploadingItems', { quantity: newChildren.length }) :
        getMessage('uploadingItem'),
      children: newChildren
      // progressText: `2 minutes left…`, // TODO
      // cancelButtonText: "Cancel",
      // onCancel: () => console.log('cancel')
    };

    let newNotifications = notification ?
      notifUtils.updateNotification(notifications, notificationId, newNotification) :
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
  let file = await readLocalFile();

  onStart(file.name);

  let res = await api.uploadFileToId(resource.id, file, onProgress);
  if (res && (res.status === 200 || res.status === 201)) {
    onSuccess(res);
  } else {
    onFail();
  }
}

export default (apiOptions, actions) => {
  const localeLabel = getMess(apiOptions.locale, label);
  return {
    id: label,
    icon: { svg: icons.fileUpload },
    label: localeLabel,
    shouldBeAvailable: (apiOptions) => true,
    availableInContexts: ['files-view', 'new-button'],
    handler: async () => await handler(apiOptions, actions)
  };
}
