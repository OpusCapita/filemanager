import React, { Component, PropTypes } from 'react';
import './FileManager.less';
import ListView from '../ListView';
import { SortDirection } from 'react-virtualized';
import nanoid from 'nanoid';
import api from './api';
console.log('api', api);

const propTypes = {
  apiRoot: PropTypes.string,
  apiVersion: PropTypes.string,
  className: PropTypes.string,
  dateTimePattern: PropTypes.string,
  id: PropTypes.string,
  initialResourceId: PropTypes.string,
  locale: PropTypes.string
};
const defaultProps = {
  apiRoot: '',
  apiVersion: 'nodejs_v1',
  className: '',
  dateTimePattern: 'YYYY-MM-DD HH:mm:ss',
  id: nanoid(),
  initialResourceId: '',
  locale: 'en'
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
      resourceChildren: [],
      resourceChildrenCount: 0,
      loadingView: false
    };

    this.api = api[props.apiVersion];
  }

  startViewLoading = () => {
    this.setState({ loadingView: true });
  }

  stopViewLoading = () => {
    this.setState({ loadingView: false });
  }

  focusView = () => {
    console.log(this.viewRef);
    this.viewRef.focus();
  }

  clearSelection = () => {
    this.setState({ selection: [] });
  }

  componentDidMount() {
    let { initialResourceId } = this.props;
    this.navigateToDir(initialResourceId);
  }

  async navigateToDir(id) {
    this.startViewLoading();

    let resource = await this.getResourceById(id);
    this.setState({ resource });

    let { resourceChildren, resourceChildrenCount } = await this.getChildrenForId(resource.id);
    this.setState({ resourceChildren, resourceChildrenCount });

    this.stopViewLoading();
    this.clearSelection();
  }

  async getResourceById(id) {
    let { apiRoot } = this.props;
    let result = await this.api.getResourceById(apiRoot, id);

    return result;
  }

  async getChildrenForId(id) {
    let { apiRoot } = this.props;
    let { resourceChildren, resourceChildrenCount } = await this.api.getChildrenForId(apiRoot, id);
    return { resourceChildren, resourceChildrenCount };
  }

  filterResourceChildrenByID(ids) {
    let { resourceChildren } = this.state;
    let filteredResourceItems = resourceChildren.filter((o) => ids.indexOf(o.id) !== -1);
    return filteredResourceItems;
  }

  handleSelection = (selection) => {
    this.setState({ selection });
  }

  handlepSort = ({ sortBy, sortDirection }) => {
    this.setState({ sortBy, sortDirection });
  }

  handleResourceItemClick = ({ event, number, rowData }) => {

  }

  handleResourceItemRightClick = ({ event, number, rowData }) => {

  }

  handleResourceItemDoubleClick = ({ event, number, rowData }) => {
    let { loadingView } = this.state;
    let { id, isDirectory } = rowData;

    if (loadingView) {
      return;
    }

    if (type === 'dir') {
      this.navigateToDir(id);
    }

    this.focusView();
  }

  handleViewKeyDown = (e) => {
    let { loadingView } = this.state;

    if (e.which === 13 && !loadingView) { // Enter key
      let { selection } = this.state;
      if (selection.length === 1) {
        // Navigate to selected resource if selected resource is single and is directory
        let selectedResourceItems = this.filterResourceChildrenByID(selection);
        let isDirectory = selectedResourceItems[0].type === 'dir';

        if (isDirectory) {
          this.navigateToDir(selectedResourceItems[0].id);
        }
      }
    }

    if (e.which === 8 && !loadingView) { // Backspace key
      // Navigate to parent directory
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
      apiRoot,
      apiVersion,
      className,
      dateTimePattern,
      id,
      initialResourceId,
      locale
    } = this.props;

    let {
      config,
      error,
      loadingView,
      resourceChildren,
      resourceChildrenCount,
      selection,
      sortBy,
      sortDirection
    } = this.state;

    let viewLoadingOverlay = loadingView ? (
      <div className="oc-fm--file-manager__view-loading-overlay">
      </div>
    ) : null;


    return (
      <div
        className={`oc-fm--file-manager ${className}`}
        onKeyDown={this.handleKeyDown}
        ref={(ref) => (this.containerRef = ref)}
      >
        {viewLoadingOverlay}
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
          items={resourceChildren}
          itemsCount={resourceChildrenCount}
          locale={locale}
          dateTimePattern={dateTimePattern}
        />
      </div>
    );
  }
}

FileManager.propTypes = propTypes;
FileManager.defaultProps = defaultProps;
