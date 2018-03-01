import React from 'react';
import { expect } from 'chai';
import { mount, hasClass, changeInputValue } from '../../test-utils';
import sinon from 'sinon';
import SetNameDialog from '.';

describe.only('<SetNameDialog /> component', () => {
  it('should have "BEM" notation class name', () => {
    let wrapper = mount(<SetNameDialog />);

    expect(hasClass(wrapper, 'oc-fm--set-name-dialog')).to.equal(true);
    wrapper.detach();
  });


  it('should take "className" property', () => {
    let wrapper = mount(<SetNameDialog className="test"/>);

    expect(hasClass(wrapper, 'test')).to.equal(true);
    wrapper.detach();
  });


  it('should focus after component mount', (done) => {
    let wrapper = mount(<SetNameDialog />);

    // XXX Have issues with testing using Mocha + Enzyme + jsdom
    // https://github.com/eleme/element-react/blob/0cc39d32fc98de07f3dfada7e5cef55b6c12e207/src/input/Input.jsx#L37
    setTimeout(() => {
      let focusedElement = document.activeElement;

      expect(wrapper.find('.oc-fm--set-name-dialog__input').getDOMNode()).to.equal(focusedElement);
      wrapper.detach();
      done();
    }, 300);
  });


  it('should call onHide on "Esc" keydown', () => {
    let callback = sinon.spy();
    let wrapper = mount(<SetNameDialog onHide={callback} />);
    wrapper.simulate('keydown', { key: 'Escape', keycode: 27, which: 27 });

    expect(callback.calledOnce).to.equal(true);
    wrapper.detach();
  });


  it('should stop Escape key "keydown" event propagation', () => {
    let callback = sinon.spy();
    let wrapper = mount(<div onKeyDown={callback}><SetNameDialog /></div>);
    wrapper.find(SetNameDialog).simulate('keydown', { key: 'Escape', keycode: 27, which: 27 });

    expect(callback.notCalled).to.equal(true);
    wrapper.detach();
  });


  it('should stop "click" event propagation', () => {
    let callback = sinon.spy();
    let wrapper = mount(<div onClick={callback}><SetNameDialog /></div>);
    wrapper.find(SetNameDialog).simulate('click');

    expect(callback.notCalled).to.equal(true);
    wrapper.detach();
  });


  it('should stop "mousedown" event propagation', () => {
    let callback = sinon.spy();
    let wrapper = mount(<div onMouseDown={callback}><SetNameDialog /></div>);
    wrapper.find(SetNameDialog).simulate('mousedown');

    expect(callback.notCalled).to.equal(true);
    wrapper.detach();
  });


  it('should stop "mouseup" event propagation', () => {
    let callback = sinon.spy();
    let wrapper = mount(<div onMouseUp={callback}><SetNameDialog /></div>);
    wrapper.find(SetNameDialog).simulate('mouseup');

    expect(callback.notCalled).to.equal(true);
    wrapper.detach();
  });


  it.only('should call onSubmit on "Enter" keydown', () => {
    let callback = sinon.spy();
    let wrapper = mount(<SetNameDialog onSubmit={callback} />);

    wrapper.setState({ value: 'string' });

    wrapper.simulate('keydown', { key: 'Enter', keycode: 13, which: 13 });

    expect(callback.calledOnce).to.equal(true);
    wrapper.detach();
  });


  it.only('should call "onSubmit" prop on "Submit" button click', () => {
    let callback = sinon.spy();
    let wrapper = mount(<SetNameDialog onSubmit={callback} onValidate={() => true} />);

    let input = wrapper.find('.oc-fm--set-name-dialog__input');
    changeInputValue(input, 'string');
    wrapper.update();

    let valid = wrapper.state('valid');
    let value = wrapper.state('value');
    console.log('valid:', valid);
    console.log('value:', value);


    let button = wrapper.find('.oc-fm--set-name-dialog__submit-button');
    button.simulate('click');

    expect(callback.called).to.equal(true);
    wrapper.detach();
  });


  // it('should display "submitButtonText" property content', () => {
  //   let string = "Hello world";
  //   let wrapper = mount(<SetNameDialog submitButtonText={string} />);
  //   let button = wrapper.find('.oc-fm--set-name-dialog__submit-button');

  //   expect(button.html()).to.include(string);
  //   wrapper.detach();
  // });


  // it('should call "onHide" prop on "Cancel" button click', () => {
  //   let callback = sinon.spy();
  //   let wrapper = mount(<SetNameDialog onHide={callback} />);
  //   let button = wrapper.find('.oc-fm--set-name-dialog__cancel-button');
  //   button.simulate('click');

  //   expect(callback.calledOnce).to.equal(true);
  //   wrapper.detach();
  // });

  // it('should display "cancelButtonText" property content', () => {
  //   let string = "Hello world";
  //   let wrapper = mount(<SetNameDialog cancelButtonText={string} />);
  //   let button = wrapper.find('.oc-fm--set-name-dialog__cancel-button');

  //   expect(button.html()).to.include(string);
  //   wrapper.detach();
  // });

  // it('should display "headerText" property content', () => {
  //   let string = "Hello world";
  //   let wrapper = mount(<SetNameDialog headerText={string} />);

  //   expect(wrapper.html()).to.include(string);
  //   wrapper.detach();
  // });


  // it('should display "messageText" property content', () => {
  //   let string = "Hello world";
  //   let wrapper = mount(<SetNameDialog messageText={string} />);

  //   expect(wrapper.html()).to.include(string);
  //   wrapper.detach();
  // });
});
