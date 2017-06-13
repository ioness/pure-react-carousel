import React from 'react';
import { shallow, mount } from 'enzyme';
import components from '../../helpers/component-config';
import { ERROR } from '../../helpers/index';
import Image from '../Image';

const { props } = components.Image;

describe('<Image />', () => {
  it('should render', () => {
    const wrapper = mount(<Image {...props} />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should make a call to store.subscribeMasterSpinner() if props.hasMasterSpinner is true', () => {
    const spy = jest.spyOn(props.store, 'subscribeMasterSpinner');
    expect(spy).not.toHaveBeenCalled();
    shallow(<Image {...props} hasMasterSpinner />);
    expect(spy).toHaveBeenCalled();
  });
  it('should call any passed-in onLoad after the image loads.', () => {
    const onLoad = jest.fn();
    expect(onLoad).not.toHaveBeenCalled();
    mount(<Image {...props} onLoad={onLoad} />);
    expect(onLoad).toHaveBeenCalled();
  });
  it('should call any passed-in onError if an image load fails.', () => {
    const onError = jest.fn();
    const wrapper = mount(<Image {...props} src="crap.junk" onError={onError} />);
    const instance = wrapper.instance();
    // simulate a load error
    instance.image.onerror();
    expect(onError).toHaveBeenCalled();
  });
  it('should call the default onError if an image load fails and there is no custom onError.', () => {
    const wrapper = mount(<Image {...props} src="crap.junk" />);
    const instance = wrapper.instance();
    // simulate a load error
    instance.image.onerror();
    expect(wrapper.hasClass('imageError')).toBe(true);
  });
  it('should render the default error with the class "carousel__image--with-background" if isBgImage === true', () => {
    const newProps = Object.assign({}, props, { tag: 'div' });
    const wrapper = mount(<Image {...newProps} src="crap.junk" isBgImage />);
    // simulate a load error
    wrapper.setState({ imageStatus: 'error' });
    wrapper.update();
    expect(wrapper.hasClass('carousel__image--with-background')).toBe(true);
  });
  it('should render with class carousel__image--with-background when isBgImage prop is true', () => {
    const wrapper = mount(<Image {...props} tag="div" isBgImage />);
    expect(wrapper.find('div').hasClass('carousel__image--with-background')).toBe(true);
  });
  it('should throw an error if you try to use isBgImage on an img tag', () => {
    const mock = jest.fn();
    global.console.error = mock;
    shallow(<Image {...props} isBgImage />);
    expect(mock).toHaveBeenCalledTimes(1);
    mock.mockRestore();
  });
  it('should call a custom renderLoading method if supplied as a prop', () => {
    const renderLoading = jest.fn(() => <span>Loading</span>);
    mount(<Image {...props} renderLoading={renderLoading} />);
    expect(renderLoading).toHaveBeenCalledTimes(1);
  });
  it('should call a custom renderError method if supplied as a prop and image load fails', () => {
    const renderError = jest.fn(() => <span>Error</span>);
    const wrapper = mount(<Image {...props} renderError={renderError} />);
    wrapper.setState({ imageStatus: ERROR });
    expect(renderError).toHaveBeenCalledTimes(1);
  });
  it('should throw an error if state.imageStatus is not LOADING, SUCCESS, or ERROR', () => {
    const wrapper = mount(<Image {...props} />);
    expect(() => {
      wrapper.setState({ imageStatus: 'poo' });
    }).toThrow();
  });
  it('should give set class carousel__image--with-background when error and isBgImage is true', () => {
    const renderError = jest.fn(() => <span>Error</span>);
    const wrapper = mount(<Image {...props} renderError={renderError} />);
    wrapper.setState({ imageStatus: 'error' });
    expect(renderError).toHaveBeenCalledTimes(1);
  });
});