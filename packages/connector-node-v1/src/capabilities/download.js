import api from '../api';
// import notifUtils from '../utils/notifications';
import { promptToSaveBlob } from '../utils/download';
import onFailError from '../utils/onFailError';
import nanoid from 'nanoid';
import icons from '../icons-svg';
import getMess from '../translations';

let label = 'download';

async function handler(apiOptions, actions) {
  const {
    // updateNotifications,
    getSelectedResources,
    // getNotifications,
    notices
  } = actions;

  let getMessage = getMess.bind(null, apiOptions.locale);

  const notificationId = label;
  const notificationChildId = nanoid();

  const onStart = ({ archiveName, quantity }) => {
    // const notifications = getNotifications();
    // const notification = notifUtils.getNotification(notifications, notificationId);
    const notification = notices.getNotification(notificationId);

    const childElement = {
      elementType: 'NotificationProgressItem',
      elementProps: {
        title: getMessage('creatingName', { name: archiveName }),
        progress: 0
      }
    };

    // const newChildren = notifUtils.addChild(
    //   (notification && notification.children) || [], notificationChildId, childElement
    // );
    const newChildren = notices.addChild(
      (notification && notification.children) || [], notificationChildId, childElement
    );
    const newNotification = {
      title: quantity > 1 ?
        getMessage('zippingItems', { quantity }) :
        getMessage('zippingItem'),
      children: newChildren
    };

    notification ?
      notices.updateNotification(notificationId, newNotification) :
      notices.addNotification(notificationId, newNotification);

    // const newNotifications = notification ?
    //   notifUtils.updateNotification(notifications, notificationId, newNotification) :
    //   notifUtils.addNotification(notifications, notificationId, newNotification);
    //
    // updateNotifications(newNotifications);
  };

  const onSuccess = _ => {
    // const notifications = getNotifications();
    // const notification = notifUtils.getNotification(notifications, notificationId);
    const notification = notices.getNotification(notificationId);
    const notificationChildrenCount = notification.children.length;
    // let newNotifications;

    if (notificationChildrenCount > 1) {
      notices.updateNotification(
        notificationId, {
          children: notices.removeChild(notification.children, notificationChildId)
        }
      );
      // newNotifications = notifUtils.updateNotification(
      //   notifications,
      //   notificationId, {
      //     children: notifUtils.removeChild(notification.children, notificationChildId)
      //   }
      // );
    } else {
      notices.removeNotification(notificationId);
      // newNotifications = notifUtils.removeNotification(notifications, notificationId);
    }
    // updateNotifications(newNotifications);
  };

  const onProgress = (progress) => {
    // const notifications = getNotifications();
    // const notification = notifUtils.getNotification(notifications, notificationId);
    // const child = notifUtils.getChild(notification.children, notificationChildId);
    const notification = notices.getNotification(notificationId);
    const child = notices.getChild(notification.children, notificationChildId);

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
    // const newChildren = notifUtils.updateChild(notification.children, notificationChildId, newChild);
    // const newNotifications = notifUtils.updateNotification(notifications, notificationId, { children: newChildren });
    // updateNotifications(newNotifications);
    const newChildren = notices.updateChild(notification.children, notificationChildId, newChild);
    notices.updateNotification(notificationId, { children: newChildren });
  };

  try {
    const resources = getSelectedResources();
    const quantity = resources.length;
    if (quantity === 1) {
      const { id, name } = resources[0];
      const downloadUrl = `${apiOptions.apiRoot}/download?items=${id}`;
      // check if the file is available and trigger native browser saving prompt
      // if server is down the error will be catched and trigger relevant notification
      await api.getResourceById(apiOptions, id);
      promptToSaveBlob({ name, downloadUrl });
    } else {
      // multiple resources -> download as a single archive
      const archiveName = apiOptions.archiveName || 'archive.zip';
      onStart({ archiveName, quantity });
      const content = await api.downloadResources({ resources, apiOptions, onProgress });
      setTimeout(onSuccess, 1000);
      promptToSaveBlob({ content, name: archiveName })
    }
  } catch (err) {
    onFailError({
      // getNotifications,
      label: getMessage(label),
      notificationId,
      // updateNotifications,
      notices
    });
    console.log(err)
  }
}

export default (apiOptions, actions) => {
  let localeLabel = getMess(apiOptions.locale, label);
  const { getSelectedResources } = actions;
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
    handler: () => handler(apiOptions, actions)
  };
}
