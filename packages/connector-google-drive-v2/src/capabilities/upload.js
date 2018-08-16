import api from '../api';
import notifUtils from '../utils/notifications';
import { getIcon } from '../icons';
import nanoid from 'nanoid';
import icons from '../icons-svg';
import getMess from '../translations';
import { readLocalFile } from "../utils/upload";

const label = 'upload';

async function handler(apiOptions, actions) {
  const {
    navigateToDir,
    updateNotifications,
    getResource,
    getNotifications
  } = actions;

  const notificationId = label;
  const notificationChildId = nanoid();
  const getMessage = getMess.bind(null, apiOptions.locale);

  const onStart = (name) => {
    const notifications = getNotifications();
    const notification = notifUtils.getNotification(notifications, notificationId);
    const childElement = {
      elementType: 'NotificationProgressItem',
      elementProps: {
        title: name,
        progress: 0,
        icon: getIcon({ title: name })
      }
    };

    const newChildren =
      notifUtils.addChild((notification && notification.children) || [], notificationChildId, childElement);
    const newNotification = {
      title: newChildren.length > 1 ?
        getMessage('uploadingItems', { quantity: newChildren.length }) :
        getMessage('uploadingItem'),
      children: newChildren
      // progressText: `2 minutes left…`, // TODO
      // cancelButtonText: "Cancel",
      // onCancel: () => console.log('cancel')
    };

    const newNotifications = notification ?
      notifUtils.updateNotification(notifications, notificationId, newNotification) :
      notifUtils.addNotification(notifications, notificationId, newNotification);

    updateNotifications(newNotifications);
  };

  const onSuccess = (res) => {
    const resource = getResource();
    const notifications = getNotifications();
    const notification = notifUtils.getNotification(notifications, notificationId);
    const notificationChildrenCount = notification.children.length;
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

  const onFail = () => {};

  const onProgress = (progress) => {
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

  const resource = getResource();
  const file = await readLocalFile();

  onStart(file.name);

  const res = await api.uploadFileToId(resource.id, file, onProgress);
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
    handler: () => handler(apiOptions, actions)
  };
}
