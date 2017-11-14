import PropTypes from 'prop-types';
import React, { Component, Children } from 'react';
import './DropdownMenu.less';
import clickOutside from 'react-click-outside';

const propTypes = {
  show: PropTypes.bool,
  showToTop: PropTypes.bool,
  onHide: PropTypes.func
};
const defaultProps = {
  show: false,
  showToTop: false,
  onHide: () => {}
};

@clickOutside
export default
class DropdownMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    let shouldHide = (e.which === 27 || e.which === 9); // Hide on "Esc" or "Tab" key
    if (this.props.show && shouldHide) {
      this.props.onHide();
    }
  }

  handleClickOutside = () => {
    if (this.props.show) {
      this.props.onHide();
    }
  }

  render() {
    let { show, showToTop, onHide, children } = this.props;

    if (!show) {
      return null;
    }

    return (
      <div className={`oc-fm--dropdown-menu ${showToTop ? 'oc-fm--dropdown-menu--to-top' : ''}`}>
        {Children.toArray(children).map(child => {
          let childProps = {
            ...child.props,
            onClick: (e) => {
              if (child.props.onClick) {
                child.props.onClick(e);
              }
              onHide();
            }
          };

          return ({ ...child, props: childProps });
        })}
      </div>
    );
  }
}

DropdownMenu.propTypes = propTypes;
DropdownMenu.defaultProps = defaultProps;
