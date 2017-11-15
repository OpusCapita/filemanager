import React from 'react';
import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';
import NotificationProgressItem from '../../../components/NotificationProgressItem';
import notifUtils from '../../../components/Notifications/utils';
import { getIcon } from '../icons';
import { promptToSaveBlob } from '../../utils/download';
import SVG from '@opuscapita/react-svg/lib/SVG';
let warningIcon = require('@opuscapita/svg-icons/lib/warning.svg');

let icon = require('@opuscapita/svg-icons/lib/file_download.svg');
let label = 'Download';

function handler(apiOptions, {
  id,
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
  const notificationId = 'download';
  const notificationChildId = id;

  const onStart = ({ archiveName, quantity }) => {
    const notifications = getNotifications();
    const notification = notifUtils.getNotification(notifications, notificationId);

    const childElement = (
      <NotificationProgressItem title={`Creating ${archiveName}...`} progress={0} />
    );

    const newChildren = notifUtils.addChild(
      (notification && notification.children) || [], notificationChildId, childElement
    );
    const newNotification = {
      title: `Zipping ${quantity} ${quantity > 1 ? 'items' : 'item'}`,
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

  const onFail = _ => {
    const notifications = getNotifications();
    let newNotifications = notifUtils.removeNotification(notifications, notificationId);

    const icon = getIcon({ title: 'error' })
    const title = (
      <div className="oc-fm--notification-progress-item">
        <SVG svg={warningIcon} style={{ fill: '#f00' }} />
        <span className="oc-fm--notification-progress-item__title" style={{ margin: '0 0 0 6px' }}>
          {`${label} error`}
        </span>
      </div>
    )

    const newNotification = {
      title,
      minimizable: false,
      closable: true,
      children: [],
      onHide: _ => updateNotifications(notifUtils.removeNotification(notifications, notificationId))
    };

    const notification = notifUtils.getNotification(notifications, notificationId);

    newNotifications = notification ?
      notifUtils.updateNotification(notifications, notificationId, newNotification) :
      notifUtils.addNotification(notifications, notificationId, newNotification);

    updateNotifications(newNotifications);
  };

  const onProgress = (progress) => {
    const notifications = getNotifications();
    const notification = notifUtils.getNotification(notifications, notificationId);
    const child = notifUtils.getChild(notification.children, notificationChildId);
    const newChild = { ...child, element: { ...child.element, props: { ...child.element.props, progress } } };
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
}) => ({
  id: 'download',
  icon: { svg: icon },
  label,
  shouldBeAvailable: (apiOptions) => {
    let selectedResources = getSelectedResources();
    return selectedResources.length > 0 && selectedResources[0].type !== 'dir';
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
  contextMenuRenderer: (apiOptions) => {
    return (
      <ContextMenuItem
        icon={{ svg: icon }}
        onClick={() => handler(apiOptions, {
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
        })}
      >
        <span>{label}</span>
      </ContextMenuItem>
    );
  }
});
