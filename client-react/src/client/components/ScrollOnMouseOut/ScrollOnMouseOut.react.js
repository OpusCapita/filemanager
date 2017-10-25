// XXX - scroll with mouse out doesn't work on ListView. If it can be fixed by another way, it welcome.
// TODO - remove this PERFECT component

import React, { Component, PropTypes } from 'react';

const STRENGTH = 20;
const TIMEOUT_TIME = 16;

const propTypes = {
  onMouseAbove: PropTypes.func,
  onMouseBellow: PropTypes.func,
  topCaptureOffset: PropTypes.number,
  bottomCaptureOffset: PropTypes.number,
  scrollHeight: PropTypes.number,
  clientHeight: PropTypes.number,
  scrollTop: PropTypes.number
};
const defaultProps = {
  onMouseAbove: () => {},
  onMouseBellow: () => {},
  topCaptureOffset: 12,
  bottomCaptureOffset: 12
};

export default
class ScrollOnMouseOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      captureCursor: false,
      isCursorAbove: false,
      isCursorBellow: false
    };

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleWindowMouseUp = this.handleWindowMouseUp.bind(this);
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.handleWindowMouseUp);
    window.addEventListener('dragend', this.handleWindowMouseUp);
  }

  componentWillUnmount() {
    this.stopCaptureCursor();
    this.stopHandleCursorPosition();
    window.removeEventListener('mouseup', this.handleWindowMouseUp);
    window.removeEventListener('dragend', this.handleWindowMouseUp);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.captureCursor) {
      this.startCaptureCursor();
    } else {
      this.stopCaptureCursor();
    }

    if (nextState.isCursorAbove && (this.state.isCursorAbove !== nextState.isCursorAbove)) {
      console.log('above!');
      this.handleCursorAbove();
    } else if (nextState.isCursorBellow && (this.state.isCursorBellow !== nextState.isCursorBellow)) {
      console.log('bellow!');
      this.handleCursorBellow();
    }
  }

  handleMouseDown = () => {
    this.setState({ captureCursor: true });
  }

  handleWindowMouseUp() {
    this.setState({ captureCursor: false });
  }

  startCaptureCursor = () => {
    window.addEventListener('mousemove', this.handleMouseMove, true);
    window.addEventListener('dragover', this.handleMouseMove, true);
  }

  stopCaptureCursor = () => {
    this.stopHandleCursorPosition();
    window.removeEventListener('mousemove', this.handleMouseMove, true);
    window.addEventListener('dragover', this.handleMouseMove, true);
  }

  handleCursorAbove = () => {
    let { clientHeight, scrollHeight, scrollTop } = this.props;

    let newScrollTop = scrollTop - STRENGTH < 0 ? 0 : scrollTop - STRENGTH;

    this.timeout = window.setTimeout(() => {
      if (!this.state.isCursorBellow && !this.state.isCursorAbove) {
        this.stopHandleCursorPosition();
        return;
      }

      this.props.onMouseAbove(newScrollTop);
      this.handleCursorAbove();
    }, TIMEOUT_TIME);
  }

  handleCursorBellow = () => {
    let { clientHeight, scrollHeight, scrollTop } = this.props;

    let newScrollTop = scrollTop + STRENGTH > scrollHeight - clientHeight ?
        scrollHeight - clientHeight :
        scrollTop + STRENGTH;

    this.timeout = window.setTimeout(() => {
      if (!this.state.isCursorBellow && !this.state.isCursorAbove) {
        this.stopHandleCursorPosition();
        return;
      }

      this.props.onMouseBellow(newScrollTop);
      this.handleCursorBellow();
    }, TIMEOUT_TIME);
  }

  stopHandleCursorPosition = () => {
    window.clearTimeout(this.timeout);
  }

  handleMouseMove(e) {
    let {
      topCaptureOffset,
      bottomCaptureOffset,
      clientHeight,
      scrollHeight,
      scrollTop
    } = this.props;

    let rect = this.containerRef.getBoundingClientRect();
    let isCursorAbove = e.clientY < rect.top + topCaptureOffset;
    let isCursorBellow = e.clientY > rect.bottom - bottomCaptureOffset;

    if (isCursorAbove) {
      this.setState({ isCursorAbove: true, isCursorBellow: false });
    } else if (isCursorBellow) {
      this.setState({ isCursorAbove: false, isCursorBellow: true });
    } else {
      this.setState({ isCursorAbove: false, isCursorBellow: false });
    }
  }

  render() {
    let {
      onMouseAbove,
      onMouseBellow,
      topCaptureOffset,
      bottomCaptureOffset,
      clientHeight,
      scrollHeight,
      scrollTop,
      ...restProps
    } = this.props;

    return (
      <div
        {...restProps}
        ref={(ref) => (this.containerRef = ref)}
        onMouseDown={this.handleMouseDown}
      >
        {this.props.children}
      </div>
    );
  }
}

ScrollOnMouseOut.propTypes = propTypes;
ScrollOnMouseOut.defaultProps = defaultProps;
