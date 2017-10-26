import React, { Component, PropTypes } from 'react';
import './FileManager.less';
import ListView from '../ListView';
import { SortDirection } from 'react-virtualized';
import nanoid from 'nanoid';
import api from './api';
console.log('api', api);

const propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  apiRoot: PropTypes.string,
  apiVersion: PropTypes.string,
  initialResourceId: PropTypes.string
};
const defaultProps = {
  className: '',
  id: nanoid(),
  apiRoot: '',
  apiVersion: 'nodejs_v1',
  initialResourceId: ''
};

export default
class FileManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {},
      error: null,
      selection: [],
      sortBy: 'title',
      sortDirection: SortDirection.ASC,
      items: []
    };

    this.api = api[props.apiVersion];
  }

  componentDidMount() {
    let { initialResourceId } = this.props;
    this.getItemsForId(initialResourceId);
  }

  getItemsForId = (id) => {
    let { api } = this.props;
    let resource = api.getResourceById(id);

  }

  handleSelection = (selection) => {
    this.setState({ selection });
  }

  handleSort = ({ sortBy, sortDirection }) => {
    this.setState({ sortBy, sortDirection });
  }

  handleRowClick = ({ event, number, rowData }) => {

  }

  handleRowRightClick = ({ event, number, rowData }) => {

  }

  handleRowDoubleClick = ({ event, number, rowData }) => {

  }

  render() {
    let {
      className
    } = this.props;

    let {
      config,
      error,
      selection,
      sortBy,
      sortDirection,
      items
    } = this.state;

    return (
      <div className={`oc-fm--file-manager ${className}`}>
        <ListView
          onRowClick={this.handleRowClick}
          onRowRightClick={this.handleRowRightClick}
          onRowDoubleClick={this.handleRowDoubleClick}
          onSelection={this.handleSelection}
          onSort={this.handleSort}
          selection={selection}
          sortBy={sortBy}
          sortDirection={sortDirection}
          items={items}
          itemsCount={items.length}
        />
      </div>
    );
  }
}

FileManager.propTypes = propTypes;
FileManager.defaultProps = defaultProps;
