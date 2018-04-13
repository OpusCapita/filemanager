import api from '../api';
import { getIcon } from '../icons';
import nanoid from 'nanoid';
import onFailError from '../utils/onFailError';
import { readLocalFile } from '../utils/upload';
import icons from '../icons-svg';
import getMess from '../translations';
import { normalizeResource } from '../utils/common';

let label = 'upload';

async function handler(apiOptions, actions) {
  const {
    navigateToDir,
    getResource,
    notices
  } = actions;

  const getMessage = getMess.bind(null, apiOptions.locale);

  const notificationId = label;
  const notificationChildId = nanoid();
  const prevResourceId = getResource().id;

  const onStart = ({ name, size }) => {
    const notification = notices.getNotification(notificationId);

    const childElement = {
      elementType: 'NotificationProgressItem',
      elementProps: {
        title: name,
        progress: 0,
        icon: getIcon({ name })
      }
    };

    const newChildren = notices.addChild(
      (notification && notification.children) || [], notificationChildId, childElement
    );
    const newNotification = {
      title: newChildren.length > 1 ?
        getMessage('uploadingItems', { quantity: newChildren.length }) :
        getMessage('uploadingItem'),
      children: newChildren
    };

    if (notification) {
      notices.updateNotification(notificationId, newNotification);
    } else {
      notices.addNotification(notificationId, newNotification);
    }
  };

  const onProgress = progress => {
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

  const resource = getResource();
  try {
    let file = await readLocalFile(true);
    onStart({ name: file.name, size: file.file.size });
    const response = await api.uploadFileToId({ apiOptions, parentId: resource.id, file, onProgress });
    const newResource = normalizeResource(response.body[0]);
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

    if (prevResourceId === resource.id) {
      navigateToDir(resource.id, newResource.id, false);
    }
  } catch (err) {
    onFailError({
      label: getMessage(label),
      notificationId,
      notices
    });
    console.log(err)
  }
}

export default (apiOptions, actions) => {
  const localeLabel = getMess(apiOptions.locale, label);
  const { getResource } = actions;
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
    handler: () => handler(apiOptions, actions)
  };
}
