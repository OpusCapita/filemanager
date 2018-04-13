import { triggerHiddenForm, promptToSaveBlob } from '../utils/download';
import api from '../api';
import nanoid from 'nanoid';
import { getIcon } from '../icons';
import icons from '../icons-svg';
import getMess from '../translations';
import { getDownloadParams } from "../google-drive-utils";

const label = 'download';

async function handler(apiOptions, actions) {
  const {
    getSelectedResources,
    notices
  } = actions;

  const getMessage = getMess.bind(null, apiOptions.locale);

  const notificationId = label;
  const notificationChildId = nanoid();

  const onStart = ({ name, quantity }) => {
    const notification = notices.getNotification(notificationId);

    const childElement = {
      elementType: 'NotificationProgressItem',
      elementProps: {
        title: name,
        progress: 0,
        icon: getIcon({ title: name })
      }
    };

    const newChildren = notices.addChild(
      (notification && notification.children) || [], notificationChildId, childElement
    );
    const newNotification = {
      title: quantity > 1 ?
        getMessage('downloadingItems', { quantity }) :
        getMessage('downloadingItem'),
      children: newChildren
    };

    if (notification) {
      notices.updateNotification(notificationId, newNotification);
    } else {
      notices.addNotification(notificationId, newNotification);
    }
  };

  const onSuccess = _ => {
    const notification = notices.getNotification(notificationId);
    const notificationChildrenCount = notification.children.length;

    if (notificationChildrenCount > 1) {
      notices.updateNotification(
        notificationId, {
          children: notices.removeChild(notification.children, notificationChildId)
        }
      );
    } else {
      notices.removeNotification(notificationId);
    }
  };

  const onFail = err => console.log(err);

  const onProgress = (progress) => {
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
    const newChildren = notices.updateChild(notification.children, notificationChildId, newChild);
    notices.updateNotification(notificationId, { children: newChildren });
  };

  try {
    let result;
    let resources = getSelectedResources();
    let quantity = resources.length;

    if (quantity === 1) {
      const resource = resources[0];
      const params = getDownloadParams(resource);
      onStart({ name: getMessage('downloadingName', { name: params.fileName }), quantity });
      result = await api.downloadResource({ resource, params, onProgress });
    } else {
      const archiveName = apiOptions.archiveName || 'archive.zip';
      onStart({ name: getMessage('creatingName', { name: archiveName }), quantity });
      result = await api.downloadResources({ resources, apiOptions, onProgress });
    }

    let { direct, downloadUrl, file, fileName, mimeType } = result;

    if (direct) {
      triggerHiddenForm({
        downloadUrl,
        ...(mimeType === 'application/pdf' ? { target: '_blank' } : null)
      });
    } else {
      promptToSaveBlob({ content: file, name: fileName });
    }

    onSuccess();
  } catch (err) {
    onFail(err);
  }
}

export default (apiOptions, actions) => {
  const localeLabel = getMess(apiOptions.locale, label);
  const { getSelectedResources } = actions;
  return {
    id: label,
    icon: { svg: icons.fileDownload },
    label: localeLabel,
    shouldBeAvailable: () => {
      const selectedResources = getSelectedResources();
      return selectedResources.length > 0 && selectedResources[0].type !== 'dir';
    },
    handler: () => handler(apiOptions, actions),
    availableInContexts: ['row', 'toolbar']
  };
}
