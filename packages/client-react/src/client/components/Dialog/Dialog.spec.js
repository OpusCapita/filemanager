import React from 'react';
import { expect } from 'chai';
import { mount } from '../../test-utils';
import sinon from 'sinon';
import Dialog from '.';

describe('<Dialog />', () => {
  it('should have "BEM" notation class name', () => {
    let wrapper = mount(<Dialog className="hello"/>);

    expect(wrapper.find('.oc-fm--dialog')).to.have.length(1);
    wrapper.detach();
  });


  it('should take "className" property', () => {
    let wrapper = mount(<Dialog className="test"/>, document.body);

    expect(wrapper.find(Dialog).hasClass('test')).to.equal(true);
    wrapper.detach();
  });


  it('should focus if "autofocus" prop equal "true"', () => {
    let wrapper = mount(<Dialog autofocus={true} />, document.body);
    let focusedElement = document.activeElement;

    expect(wrapper.find('.oc-fm--dialog').instance()).to.equal(focusedElement);
    wrapper.detach();
  });


  it('should not focus if "autofocus" prop equal "false"', () => {
    let wrapper = mount(<Dialog autofocus={false} />, document.body);
    let focusedElement = document.activeElement;

    expect(wrapper.find('.oc-fm--dialog').instance()).to.not.equal(focusedElement);
    wrapper.detach();
  });

  it('should not focus if "autofocus" prop isn\'t passed' , () => {
    let wrapper = mount(<Dialog />, document.body);
    let focusedElement = document.activeElement;

    expect(wrapper.find('.oc-fm--dialog').instance()).to.not.equal(focusedElement);
    wrapper.detach();
  });


  it('should call onHide on "Esc" keydown', () => {
    let callback = sinon.spy();
    let wrapper = mount(<Dialog onHide={callback}/>);
    wrapper.find(Dialog).simulate('keyDown', { key: 'Escape', keycode: 27, which: 27 });

    expect(callback.calledOnce).to.equal(true);
    wrapper.detach();
  });


  it('should stop Escape key "keydown" event propagation', () => {
    let callback = sinon.spy();
    let wrapper = mount(<div onKeyDown={callback}><Dialog /></div>);
    wrapper.find(Dialog).simulate('keyDown', { key: 'Escape', keycode: 27, which: 27 });

    expect(callback.notCalled).to.equal(true);
    wrapper.detach();
  });


  it('should stop "click" event propagation', () => {
    let callback = sinon.spy();
    let wrapper = mount(<div onClick={callback}><Dialog /></div>);
    wrapper.find(Dialog).simulate('click');

    expect(callback.notCalled).to.equal(true);
    wrapper.detach();
  });


  it('should stop "mousedown" event propagation', () => {
    let callback = sinon.spy();
    let wrapper = mount(<div onMouseDown={callback}><Dialog /></div>);
    wrapper.find(Dialog).simulate('mousedown');

    expect(callback.notCalled).to.equal(true);
    wrapper.detach();
  });


  it('should stop "mouseup" event propagation', () => {
    let callback = sinon.spy();
    let wrapper = mount(<div onMouseUp={callback}><Dialog /></div>);
    wrapper.find(Dialog).simulate('mouseup');

    expect(callback.notCalled).to.equal(true);
    wrapper.detach();
  });
});
