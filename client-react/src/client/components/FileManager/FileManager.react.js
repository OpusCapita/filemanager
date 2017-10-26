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
      resource: {},
      resourceItems: [],
      resourceItemsCount: 0
    };

    this.api = api[props.apiVersion];
  }

  async componentDidMount() {
    let { initialResourceId } = this.props;
    this.navigateToDir(initialResourceId);
  }

  async navigateToDir(id) {
    let resource = await this.getResourceById(id);
    this.setState({ resource });

    let { resourceItems, resourceItemsCount } = await this.getItemsForId(resource.id);
    this.setState({ resourceItems, resourceItemsCount });
  }

  async getResourceById(id) {
    let { apiRoot } = this.props;
    let result = await this.api.getResourceById(apiRoot, id);
    return result;
  }

  async getItemsForId(id) {
    let { apiRoot } = this.props;
    let { resourceItems, resourceItemsCount } = await this.api.getItemsForId(apiRoot, id);
    return { resourceItems, resourceItemsCount };
  }

  handleSelection = (selection) => {
    this.setState({ selection });
  }

  handleSort = ({ sortBy, sortDirection }) => {
    this.setState({ sortBy, sortDirection });
  }

  handleResourceItemClick = ({ event, number, rowData }) => {

  }

  handleResourceItemRightClick = ({ event, number, rowData }) => {

  }

  handleResourceItemDoubleClick = ({ event, number, rowData }) => {
    let { id, type } = rowData;

    if (type === 'dir') {
      this.navigateToDir(id);
    }

    this.viewRef.focus();
  }

  handleViewKeyDown = (e) => {
    if (e.which === 8) { // Backspace key
      let { resource } = this.state;
      this.navigateToDir(resource.parentId);
    }
  }

  handleKeyDown = (e) => {

  }

  handleViewRef = (ref) => {
    this.viewRef = ref;
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
      resourceItems,
      resourceItemsCount
    } = this.state;

    return (
      <div
        className={`oc-fm--file-manager ${className}`}
        onKeyDown={this.handleKeyDown}
        ref={(ref) => (this.containerRef = ref)}
      >
        <ListView
          onKeyDown={this.handleViewKeyDown}
          onRowClick={this.handleResourceItemClick}
          onRowRightClick={this.handleResourceItemRightClick}
          onRowDoubleClick={this.handleResourceItemDoubleClick}
          onSelection={this.handleSelection}
          onSort={this.handleSort}
          onRef={this.handleViewRef}
          selection={selection}
          sortBy={sortBy}
          sortDirection={sortDirection}
          items={resourceItems}
          itemsCount={resourceItemsCount}
        />
      </div>
    );
  }
}

FileManager.propTypes = propTypes;
FileManager.defaultProps = defaultProps;
