// import notifUtils from './notifications';

export default function onFailErrors({
  // getNotifications,
  label,
  notificationId,
  // updateNotifications,
  message,
  notices
}) {
  // const notifications = getNotifications();
  // let newNotifications = notifUtils.removeNotification(notifications, notificationId);
  notices.removeNotification(notificationId);

  const newNotification = {
    title: message || `${label} error`,
    minimizable: false,
    closable: true,
    children: [],
    onHide: _ => notices.removeNotification(notificationId)
  };
  // const newNotification = {
  //   title: message || `${label} error`,
  //   minimizable: false,
  //   closable: true,
  //   children: [],
  //   onHide: _ => updateNotifications(notifUtils.removeNotification(notifications, notificationId))
  // };

  const notification = notices.getNotification(notificationId);
  // const notification = notifUtils.getNotification(notifications, notificationId);

  notification ?
    notices.updateNotification(notificationId, newNotification) :
    notices.addNotification(notificationId, newNotification);

  // newNotifications = notification ?
  //   notifUtils.updateNotification(notifications, notificationId, newNotification) :
  //   notifUtils.addNotification(notifications, notificationId, newNotification);
  //
  // updateNotifications(newNotifications);
}
