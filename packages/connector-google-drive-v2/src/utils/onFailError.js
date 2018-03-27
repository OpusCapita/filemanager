import notifUtils from './notifications';
import getMessage from '../translations';

export default function onFailErrors({
  getNotifications,
  label,
  notificationId,
  updateNotifications,
  message,
  locale = 'en' // TODO: Add the locale parameter to the place of a call
}) {
  const notifications = getNotifications();
  let newNotifications = notifUtils.removeNotification(notifications, notificationId);

  const newNotification = {
    title: message || `${label} ${getMessage(locale, 'error')}`,
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
