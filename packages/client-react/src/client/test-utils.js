import { mount as _mount } from 'enzyme';

export const mount = (element) => {
  let attachTo = document.createElement('div');
  document.body.appendChild(attachTo);
  return _mount(element, { attachTo });
};

export const hasClass = (reactWrapper, className) => reactWrapper.getDOMNode().classList.contains(className);
