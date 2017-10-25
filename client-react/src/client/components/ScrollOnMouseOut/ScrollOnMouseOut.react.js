// XXX - scroll with mouse out doesn't work on ListView. If it can be fixed by another way, it welcome.
// TODO - remove this PERFECT component

import React, { Component, PropTypes } from 'react';

const STRENGTH = 20;
const TIMEOUT_TIME = 16;

const propTypes = {
  onCursorAbove: PropTypes.func,
  onCursorBellow: PropTypes.func,
  topCaptureOffset: PropTypes.number,
  bottomCaptureOffset: PropTypes.number,
  scrollHeight: PropTypes.number,
  clientHeight: PropTypes.number,
  scrollTop: PropTypes.number
};
const defaultProps = {
  onCursorAbove: () => {},
  onCursorBellow: () => {},
  topCaptureOffset: 12,
  bottomCaptureOffset: 12,
  scrollHeight: 0,
  clientHeight: 0,
  scrollTop: 0
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
    window.addEventListener('drop', this.handleWindowMouseUp);
  }

  componentWillUnmount() {
    this.stopCaptureCursor();
    this.clearTimeout();
    window.removeEventListener('mouseup', this.handleWindowMouseUp);
    window.removeEventListener('dragend', this.handleWindowMouseUp);
    window.removeEventListener('drop', this.handleWindowMouseUp);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.captureCursor) {
      this.startCaptureCursor();
    } else {
      this.stopCaptureCursor();
    }

    if (nextState.isCursorAbove && (this.state.isCursorAbove !== nextState.isCursorAbove)) {
      this.handleCursorAbove();
    } else if (nextState.isCursorBellow && (this.state.isCursorBellow !== nextState.isCursorBellow)) {
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
    this.clearTimeout();
    window.removeEventListener('mousemove', this.handleMouseMove, true);
    window.removeEventListener('dragover', this.handleMouseMove, true);
  }

  handleCursorAbove = () => {
    let { clientHeight, scrollHeight, scrollTop } = this.props;

    let newScrollTop = scrollTop - STRENGTH < 0 ? 0 : scrollTop - STRENGTH;

    this.timeout = window.setTimeout(() => {
      this.clearTimeout();
      if (!this.state.isCursorBellow && !this.state.isCursorAbove) {
        this.clearTimeout();
        return;
      }

      this.props.onCursorAbove(newScrollTop);
      this.handleCursorAbove();
    }, TIMEOUT_TIME);
  }

  handleCursorBellow = () => {
    let { clientHeight, scrollHeight, scrollTop } = this.props;

    let newScrollTop = scrollTop + STRENGTH > scrollHeight - clientHeight ?
        scrollHeight - clientHeight :
        scrollTop + STRENGTH;

    this.timeout = window.setTimeout(() => {
      this.clearTimeout();
      if (!this.state.isCursorBellow && !this.state.isCursorAbove) {
        this.clearTimeout();
        return;
      }

      this.props.onCursorBellow(newScrollTop);
      this.handleCursorBellow();
    }, TIMEOUT_TIME);
  }

  clearTimeout = () => {
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
      onCursorAbove,
      onCursorBellow,
      topCaptureOffset,
      bottomCaptureOffset,
      scrollHeight,
      clientHeight,
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
