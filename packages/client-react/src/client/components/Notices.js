import { find, findIndex, extend } from 'lodash';

export default
class Notices {
  constructor(onChange) {
    this.onChange = onChange || (() => {});
    this.notifications = [];
    this.notificationChildren = [];
  }

  addNotification(id, props) {
    let index = findIndex(this.notifications, (o) => o.id === id);
    if (index === -1) {
      this.notifications = this.notifications.concat([{ id, children: (props.children || []), ...props }]);
    } else {
      console.error(`Can't add notification: ${id} already exists`);
    }

    this.onChange(this.notifications);
  }

  updateNotification(id, props) {
    this.notifications = this.notifications.map(o => {
      if (o.id !== id) {
        return o;
      }

      return extend({}, o, props);
    });

    this.onChange(this.notifications);
  }

  getNotification(id) {
    return find(this.notifications, (o) => o.id === id);
  }

  getNotifications() {
    return this.notifications;
  }

  removeNotification(id) {
    this.notifications = this.notifications.filter(o => o.id !== id);

    this.onChange(this.notifications);
  }

  addChild(notificationChildren, id, element) {
    return notificationChildren.concat([{ id, element }]);
  }

  removeChild(notificationChildren, id) {
    return notificationChildren.filter((o) => o.id !== id);
  }

  updateChild(notificationChildren, id, element) {
    return notificationChildren.map(o => {
      if (o.id !== id) {
        return o;
      }

      return extend({}, o, { id, ...element });
    });
  }

  getChild(notificationChildren, id) {
    return find(notificationChildren, (o) => o.id === id);
  }
};
