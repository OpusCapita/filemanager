export default function onFailErrors({
  label,
  notificationId,
  message,
  notices
}) {
  notices.removeNotification(notificationId);

  const newNotification = {
    title: message || `${label} error`,
    minimizable: false,
    closable: true,
    children: [],
    onHide: _ => notices.removeNotification(notificationId)
  };

  const notification = notices.getNotification(notificationId);

  if (notification) {
    notices.updateNotification(notificationId, newNotification);
  } else {
    notices.addNotification(notificationId, newNotification);
  }
}
