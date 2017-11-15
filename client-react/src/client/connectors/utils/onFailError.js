import React from 'react';
import SVG from '@opuscapita/react-svg/lib/SVG';
let warningIcon = require('@opuscapita/svg-icons/lib/warning.svg');
import notifUtils from '../../components/Notifications/utils';

export default function onFailErrors({
  getNotifications,
  label,
  notificationId,
  updateNotifications,
  message
}) {
  const notifications = getNotifications();
  let newNotifications = notifUtils.removeNotification(notifications, notificationId);

  const title = (
    <div className="oc-fm--notification-progress-item">
      <SVG svg={warningIcon} style={{ fill: '#f00' }} />
      <span className="oc-fm--notification-progress-item__title" style={{ margin: '0 0 0 6px' }}>
        {message || `${label} error`}
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
}