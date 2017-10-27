import React, { Component, PropTypes } from 'react';
import './FileManager.less';
import ListView from '../ListView';
import { SortDirection } from 'react-virtualized';
import nanoid from 'nanoid';
import api from './api';

const propTypes = {
  api: PropTypes.object,
  apiOptions: PropTypes.object,
  className: PropTypes.string,
  dateTimePattern: PropTypes.string,
  id: PropTypes.string,
  initialResourceId: PropTypes.string,
  locale: PropTypes.string
};
const defaultProps = {
  api: 'nodejs_v1',
  apiOptions: {},
  className: '',
  dateTimePattern: 'YYYY-MM-DD HH:mm:ss',
  id: nanoid(),
  initialResourceId: '',
  locale: 'en'
};

const MONITOR_API_AVAILABILITY_TIMEOUT = 16;

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
      loadingView: false,
      apiInitialized: false,
      apiSignedIn: false
    };
  }

  startViewLoading = () => {
    this.setState({ loadingView: true });
  }

  stopViewLoading = () => {
    this.setState({ loadingView: false });
  }

  focusView = () => {
    this.viewRef.focus();
  }

  handleApiReady = () => {
    let { initialResourceId } = this.props;
    let resourceId = this.state.resource.id;
    let idToNavigate = typeof resourceId === 'undefined' ? initialResourceId : resourceId;
    this.navigateToDir(idToNavigate);
  }

  monitorApiAvailability = () => {
    clearTimeout(this.apiAvailabilityTimeout);

    this.apiAvailabilityTimeout = setTimeout(() => {
      let { apiInitialized, apiSignedIn } = this.state;
      if (apiInitialized && apiSignedIn) {
        this.handleApiReady();
      } else {
        this.monitorApiAvailability();
      }
    }, MONITOR_API_AVAILABILITY_TIMEOUT);
  }

  async componentDidMount() {
    let { initialResourceId, apiOptions, api } = this.props;
    let { apiInitialized, apiSignedIn } = this.state;

    await api.init({
      ...apiOptions,
      onInitSuccess: this.handleApiInitSuccess,
      onInitFail: this.handleApiInitFail,
      onSignInSuccess: this.handleApiSignInSuccess,
      onSignInFail: this.handleApiSignInFail
    });

    this.monitorApiAvailability();
  }

  handleApiInitSuccess = () => {
    this.setState({ apiInitialized: true });
  }

  handleApiInitFail = () => {
    this.setState({ apiInititalized: false, resourceChildren: [] });
    this.monitorApiAvailability();
  }

  handleApiSignInSuccess = () => {
    this.setState({ apiSignedIn: true });
  }

  handleApiSignInFail = () => {
    this.monitorApiAvailability();
    this.setState({ apiSignedIn: false, resourceChildren: [] });
  }

  async navigateToDir(toId, fromId) {
    this.startViewLoading();
    let resource = await this.getResourceById(toId);
    this.setState({ resource });

    let { resourceChildren } = await this.getChildrenForId(resource.id);

    this.setState({
      resourceChildren,
      selection: typeof fromId !== 'undefined' ? [fromId] : []
    });

    this.stopViewLoading();
  }

  async getResourceById(id) {
    let { api, apiOptions } = this.props;
    let result = await api.getResourceById(apiOptions, id);
    return result;
  }

  async getChildrenForId(id) {
    let { api, apiOptions } = this.props;
    let { resourceChildren } = await api.getChildrenForId(apiOptions, id);
    return { resourceChildren };
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
    let { loadingView, resource } = this.state;
    let { id } = rowData;

    if (loadingView) {
      return;
    }

    let isDirectory = rowData.type === 'dir';
    if (isDirectory) {
      this.navigateToDir(id);
    }

    this.focusView();
  }

  handleViewKeyDown = (e) => {
    let { loadingView, resource } = this.state;

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

    if ((e.which === 8) && !loadingView) { // Backspace
      // Navigate to parent directory
      let { resource } = this.state;
      if (resource.parentId) {
        this.navigateToDir(resource.parentId, resource.id);
      }
    }
  }

  handleKeyDown = (e) => {

  }

  handleViewRef = (ref) => {
    this.viewRef = ref;
  }

  render() {
    let {
      api,
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
      selection,
      sortBy,
      sortDirection,
      apiInitialized,
      apiSignedIn
    } = this.state;

    let viewLoadingOverlayMessage = '';

    if (!apiInitialized) {
      viewLoadingOverlayMessage = 'Problems with server connection';
    }

    if (!apiSignedIn) {
      viewLoadingOverlayMessage = 'Not authenticated';
    }

    let viewLoadingOverlay = (loadingView || viewLoadingOverlayMessage) ? (
      <div className="oc-fm--file-manager__view-loading-overlay">
        {viewLoadingOverlayMessage}
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
          itemsCount={resourceChildren ? resourceChildren.length : 0}
          locale={locale}
          dateTimePattern={dateTimePattern}
        />
      </div>
    );
  }
}

FileManager.propTypes = propTypes;
FileManager.defaultProps = defaultProps;
