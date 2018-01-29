import api from '../api';
import notifUtils from '../utils/notifications';
import { promptToSaveBlob } from '../utils/download';
import onFailError from '../utils/onFailError';
import nanoid from 'nanoid';
import icons from '../icons-svg';
import getMess from '../../translations';

let icon = icons.fileDownload;
let label = 'download';

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
  let getMessage = getMess.bind(null, apiOptions.locale);

  const notificationId = label;
  const notificationChildId = nanoid();

  const onStart = ({ archiveName, quantity }) => {
    const notifications = getNotifications();
    const notification = notifUtils.getNotification(notifications, notificationId);

    const childElement = {
      elementType: 'NotificationProgressItem',
      elementProps: {
        title: `${getMessage('creating')} ${archiveName}...`,
        progress: 0
      }
    };

    const newChildren = notifUtils.addChild(
      (notification && notification.children) || [], notificationChildId, childElement
    );
    const newNotification = {
      title: `getMessage('zipping') ${quantity} ${quantity > 1 ? getMessage('items') : getMessage('item')}`,
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

  const onFail = _ => onFailError({
    getNotifications,
    label: getMessage(label),
    // label,
    notificationId,
    updateNotifications
  });

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

  return api.downloadResources({
    resources: getSelectedResources(),
    apiOptions,
    trackers: {
      onStart,
      onSuccess,
      onFail,
      onProgress
    }
  }).then(
      ({ downloadUrl, file: content, name }) => promptToSaveBlob({ content, name, downloadUrl })
    ).catch(err => console.error(err));
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
    icon: { svg: icon },
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
        children: localeLabel
      }
    })
  };
}
