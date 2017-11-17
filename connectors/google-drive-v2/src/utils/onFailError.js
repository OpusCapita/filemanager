import React from 'react';
import notifUtils from './notifications';
import icons from '../icons-svg';

export default function onFailErrors({
  getNotifications,
  label,
  notificationId,
  updateNotifications,
  message
}) {
  const notifications = getNotifications();
  let newNotifications = notifUtils.removeNotification(notifications, notificationId);

  const newNotification = {
    title: message || `${label} error`,
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
}
