import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import nanoid from 'nanoid';

const propTypes = {
  fetcher: PropTypes.func,
  fetcherArguments: PropTypes.object,
  onLoad: PropTypes.func,
  onError: PropTypes.func
};
const defaultProps = {
  fetcher: () => {},
  fetcherArguments: {},
  onLoad: () => {},
  onError: () => {}
};

export default
class Fetch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      error: null,
      loaded: false,
      loading: false
    };
  }

  componentDidMount() {
    this.fetch(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.fetcherArguments, nextProps.fetcherArguments)) {
      this.fetch(nextProps);
    }
  }

  fetch = (props) => {
    this.setState({ loading: true });

    let { fetcher, fetcherArguments, onLoad, onError } = props;
    let promiseId = nanoid();

    this.promiseId = promiseId;
    this.fetcherPromise = fetcher(fetcherArguments);

    this.fetcherPromise.then(data => {
      if (this.promiseId === promiseId) {
        this.setState({
          data,
          error: null,
          loaded: true,
          loading: false
        });
        onLoad({ data });
      }
    }).catch(error => {
      if (this.promiseId === promiseId) {
        this.setState({
          data: undefined,
          error,
          loaded: false,
          loading: false
        });
        onError({ error });
      }
    });
  }

  render() {
    let renderedChildren = this.props.children(this.state);
    return renderedChildren && React.Children.only(renderedChildren);
  }
}

Fetch.propTypes = propTypes;
Fetch.defaultProps = defaultProps;
