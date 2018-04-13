import api from '../api';
import { getIcon } from '../icons';
import nanoid from 'nanoid';
import icons from '../icons-svg';
import getMess from '../translations';
import { readLocalFile } from "../utils/upload";

let label = 'upload';

async function handler(apiOptions, actions) {
  const {
    navigateToDir,
    getResource,
    notices
  } = actions;

  let notificationId = label;
  let notificationChildId = nanoid();
  let getMessage = getMess.bind(null, apiOptions.locale);

  let onStart = (name) => {
    const notification = notices.getNotification(notificationId);

    let childElement = {
      elementType: 'NotificationProgressItem',
      elementProps: {
        title: name,
        progress: 0,
        icon: getIcon({ title: name })
      }
    };

    let newChildren =
      notices.addChild((notification && notification.children) || [], notificationChildId, childElement);
    let newNotification = {
      title: newChildren.length > 1 ?
        getMessage('uploadingItems', { quantity: newChildren.length }) :
        getMessage('uploadingItem'),
      children: newChildren
      // progressText: `2 minutes left…`, // TODO
      // cancelButtonText: "Cancel",
      // onCancel: () => console.log('cancel')
    };

    notification ?
      notices.updateNotification(notificationId, newNotification) :
      notices.addNotification(notificationId, newNotification);
  };

  let onSuccess = (res) => {
    let resource = getResource();
    const notification = notices.getNotification(notificationId);
    let notificationChildrenCount = notification.children.length;

    if (notificationChildrenCount > 1) {
      notices.updateNotification(
        notificationId, {
          children: notices.removeChild(notification.children, notificationChildId)
        }
      );
    } else {
      notices.removeNotification(notificationId);
    }
    navigateToDir(resource.id, null, false);
  };

  let onFail = () => {};

  let onProgress = (progress) => {
    const notification = notices.getNotification(notificationId);

    let child = notices.getChild(notification.children, notificationChildId);
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
    let newChildren = notices.updateChild(notification.children, notificationChildId, newChild);
    notices.updateNotification(notificationId, { children: newChildren });
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
    handler: () => handler(apiOptions, actions)
  };
}
