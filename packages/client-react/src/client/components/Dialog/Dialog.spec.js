import React from 'react';
import { expect } from 'chai';
import { mount, hasClass } from '../../test-utils';
import sinon from 'sinon';
import Dialog from '.';

describe('<Dialog /> component', () => {
  it('should have "BEM" notation class name', () => {
    let wrapper = mount(<Dialog />);

    expect(hasClass(wrapper, 'oc-fm--dialog')).to.equal(true);
    wrapper.detach();
  });


  it('should take "className" property', () => {
    let wrapper = mount(<Dialog className="test"/>);

    expect(hasClass(wrapper, 'test')).to.equal(true);
    wrapper.detach();
  });


  it('should focus if "autofocus" prop equal "true"', () => {
    let wrapper = mount(<Dialog autofocus={true} />);
    let focusedElement = document.activeElement;

    expect(wrapper.getDOMNode()).to.equal(focusedElement);
    wrapper.detach();
  });


  it('should not focus if "autofocus" prop equal "false"', () => {
    let wrapper = mount(<Dialog autofocus={false} />);
    let focusedElement = document.activeElement;

    expect(wrapper.getDOMNode()).to.not.equal(focusedElement);
    wrapper.detach();
  });

  it('should not focus if "autofocus" prop isn\'t passed' , () => {
    let wrapper = mount(<Dialog />);
    let focusedElement = document.activeElement;

    expect(wrapper.getDOMNode()).to.not.equal(focusedElement);
    wrapper.detach();
  });


  it('should call onHide on "Esc" keydown', () => {
    let callback = sinon.spy();
    let wrapper = mount(<Dialog onHide={callback}/>);
    wrapper.simulate('keydown', { key: 'Escape', keycode: 27, which: 27 });

    expect(callback.calledOnce).to.equal(true);
    wrapper.detach();
  });


  it('should stop Escape key "keydown" event propagation', () => {
    let callback = sinon.spy();
    let wrapper = mount(<div onKeyDown={callback}><Dialog /></div>);
    wrapper.find(Dialog).simulate('keydown', { key: 'Escape', keycode: 27, which: 27 });

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
