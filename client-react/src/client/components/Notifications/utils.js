import { find, findIndex, extend } from 'lodash';

function addNotification(notifications, id, props) {
  let index = findIndex(notifications, (o) => o.id === id);
  if (index !== -1) {
    console.error(`Can't add notification: ${id} already exists`);
    return notifications;
  }
  return notifications.concat([{ id, ...props }]);
}

function updateNotification(notifications, id, props) {
  return notifications.map(o => {
    if (o.id !== id) {
      return o;
    }

    return extend({}, o, props);
  });
}

function getNotificationById(notifications, id) {
  return find(notifications, (o) => o.id === id);
}

function removeNotification(notifications, id) {
  return notifications.filter(o => o.id !== id);
}

export default {
  addNotification,
  updateNotification,
  removeNotification,
  getNotificationById
};
