import { find, findIndex, extend } from 'lodash';

function addNotification(notifications, id, props) {
  let index = findIndex(notifications, (o) => o.id === id);
  if (index !== -1) {
    console.error(`Can't add notification: ${id} already exists`);
    return notifications;
  }
  return notifications.concat([{ id, children: (props.children || []), ...props }]);
}

function updateNotification(notifications, id, props) {
  return notifications.map(o => {
    if (o.id !== id) {
      return o;
    }

    return extend({}, o, props);
  });
}

function getNotification(notifications, id) {
  return find(notifications, (o) => o.id === id);
}

function removeNotification(notifications, id) {
  return notifications.filter(o => o.id !== id);
}

function addChild(notificationChildren, id, element) {
  return notificationChildren.concat([{ id, element }]);
}

function removeChild(notificationChildren, id) {
  return notificationChildren.filter((o) => o.id !== id);
}

function updateChild(notificationChildren, id, element) {
  return notificationChildren.map(o => {
    if (o.id !== id) {
      return o;
    }

    return extend({}, o, { id, ...element });
  });
}

function getChild(notificationChildren, id) {
  return find(notificationChildren, (o) => o.id === id);
}

export default {
  addNotification,
  updateNotification,
  removeNotification,
  getNotification,
  addChild,
  removeChild,
  updateChild,
  getChild
};
