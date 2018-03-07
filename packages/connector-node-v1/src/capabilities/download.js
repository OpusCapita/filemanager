import api from '../api';
import notifUtils from '../utils/notifications';
import { promptToSaveBlob } from '../utils/download';
import onFailError from '../utils/onFailError';
import nanoid from 'nanoid';
import icons from '../icons-svg';
import getMess from '../../translations';

let label = 'download';

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

  const notificationId = label;
  const notificationChildId = nanoid();

  const onStart = ({ archiveName, quantity }) => {
    const notifications = getNotifications();
    const notification = notifUtils.getNotification(notifications, notificationId);

    const childElement = {
      elementType: 'NotificationProgressItem',
      elementProps: {
        title: getMessage('creatingName', { name: archiveName }),
        progress: 0
      }
    };

    const newChildren = notifUtils.addChild(
      (notification && notification.children) || [], notificationChildId, childElement
    );
    const newNotification = {
      title: quantity > 1 ? getMessage('zippingItems', { quantity }) : getMessage('zippingItem'),
      children: newChildren
    };

    const newNotifications = notification ?
      notifUtils.updateNotification(notifications, notificationId, newNotification) :
      notifUtils.addNotification(notifications, notificationId, newNotification);

    updateNotifications(newNotifications);
  };

  const onSuccess = _ => {
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
  };

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

  try {
    const response = await api.downloadResources({
      resources: getSelectedResources(),
      apiOptions,
      trackers: {
        onStart,
        onProgress
      }
    });
    const { direct, downloadUrl, file: content, name } = response;
    if (!direct) {
      setTimeout(onSuccess, 1000)
    }
    promptToSaveBlob({ content, name, downloadUrl })
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
  let localeLabel = getMess(apiOptions.locale, label);
  return {
    id: label,
    icon: { svg: icons.fileDownload },
    label: localeLabel,
    shouldBeAvailable: (apiOptions) => {
      let selectedResources = getSelectedResources();

      return (
        selectedResources.length > 0 &&
        !selectedResources.some(r => r.type === 'dir') &&
        selectedResources.every(r => r.capabilities.canDownload)
      );
    },
    availableInContexts: ['row', 'toolbar'],
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
