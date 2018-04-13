// This code don't use

import getMessage from '../translations';

export default function onFailErrors({
  label,
  notificationId,
  message,
  notices,
  locale = 'en' // TODO: Add the locale parameter to the place of a call
}) {
  notices.removeNotification(notificationId);

  const newNotification = {
    title: message || `${label} ${getMessage(locale, 'error')}`,
    minimizable: false,
    closable: true,
    children: [],
    onHide: _ => notices.removeNotification(notificationId)
  };

  const notification = notices.getNotification(notificationId);

  notification ?
    notices.updateNotification(notificationId, newNotification) :
    notices.addNotification(notificationId, newNotification);
}
