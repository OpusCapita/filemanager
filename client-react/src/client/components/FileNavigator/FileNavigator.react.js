import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './FileNavigator.less';
import ListView from '../ListView';
import LocationBar from '../LocationBar';
import Notifications from '../Notifications';
import { SortDirection } from 'react-virtualized';
import { find, findIndex } from 'lodash';
import nanoid from 'nanoid';
import SVG from '@opuscapita/react-svg/lib/SVG';
let spinnerIcon = require('../assets/spinners/spinner.svg');

const propTypes = {
  api: PropTypes.object,
  apiOptions: PropTypes.object,
  capabilities: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  initialResourceId: PropTypes.string,
  listViewLayout: PropTypes.func,
  viewLayoutOptions: PropTypes.object,
  signInRenderer: PropTypes.func
};
const defaultProps = {
  api: 'nodejs_v1',
  apiOptions: {},
  capabilities: () => [],
  className: '',
  id: '',
  initialResourceId: '',
  listViewLayout: () => {},
  viewLayoutOptions: {},
  signInRenderer: null
};

const MONITOR_API_AVAILABILITY_TIMEOUT = 16;

export default
class FileNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiInitialized: false,
      apiSignedIn: false,
      config: {},
      dialogElement: null,
      error: null,
      loadingResourceLocation: false,
      loadingView: false,
      notifications: [],
      resource: {},
      resourceChildren: [],
      resourceLocation: [],
      selection: [],
      sortBy: 'title',
      sortDirection: SortDirection.ASC,
      initializedCapabilities: []
    };
  }

  startViewLoading = () => {
    this.setState({ loadingView: true, loadingResourceLocation: true });
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
    let { initialResourceId, apiOptions, api, capabilities } = this.props;
    let { apiInitialized, apiSignedIn } = this.state;

    let capabilitiesProps = this.getNavigatorState();
    let initializedCapabilities = capabilities(apiOptions, capabilitiesProps);
    this.setState({ initializedCapabilities });

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
    this.setState({
      apiSignedIn: false,
      selection: [],
      resource: [],
      resourceChildren: []
    });
  }

  handleLocationBarChange = (id) => {
    let { resource, resourceLocation } = this.state;
    this.navigateToDir(id, resource.id);
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
    this.setParentsForResource(resource);
  }

  async setParentsForResource(resource) {
    let resourceParents = await this.getParentsForId(resource.id);
    let resourceLocation = resourceParents.concat(resource);
    this.setState({ resourceLocation, loadingResourceLocation: false });
  }

  async getParentsForId(id) {
    let { api, apiOptions } = this.props;
    return await api.getParentsForId(apiOptions, id);
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

  handleSort = async ({ sortBy, sortDirection }) => {
    let { apiOptions } = this.props;
    let { initializedCapabilities } = this.state;
    let sortCapability = find(initializedCapabilities, (o) => o.id === 'sort');
    if (!sortCapability) {
      return;
    }

    let sort = sortCapability.handler;
    this.setState({ loadingView: true });
    let newResourceChildren = await sort({ sortBy, sortDirection });
    this.setState({ sortBy, sortDirection, resourceChildren: newResourceChildren, loadingView: false });
  }

  handleResourceItemClick = async ({ event, number, rowData }) => {

  }

  handleResourceItemRightClick = async ({ event, number, rowData }) => {

  }

  handleResourceItemDoubleClick = async ({ event, number, rowData }) => {
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

  handleViewKeyDown = async (e) => {
    let { api, apiOptions } = this.props;
    let { loadingView, resource } = this.state;

    if ((e.which === 13 || e.which === 39) && !loadingView) { // Enter key or Right Arrow
      let { selection } = this.state;
      if (selection.length === 1) {
        // Navigate to selected resource if selected resource is single and is directory
        let selectedResourceItems = this.filterResourceChildrenByID(selection);

        if (!selectedResourceItems[0]) {
          // Fix for fast selection updates
          return;
        }

        let isDirectory = selectedResourceItems[0].type === 'dir';

        if (isDirectory) {
          this.navigateToDir(selectedResourceItems[0].id);
        }
      }
    }

    if ((e.which === 8 || e.which === 37) && !loadingView) { // Backspace or Left Arrow
      // Navigate to parent directory
      let { resource } = this.state;
      let parentId = await api.getParentIdForResource(apiOptions, resource);
      if (parentId) {
        this.navigateToDir(parentId, resource.id);
      }
    }
  }

  handleKeyDown = async (e) => {

  }

  handleViewRef = async (ref) => {
    this.viewRef = ref;
  }

  showDialog = (dialogElement) => {
    this.setState({ dialogElement });
  }

  hideDialog = () => {
    this.setState({ dialogElement: null });
  }

  updateNotifications = (notifications) => {
    this.setState({ notifications });
  }

  getNavigatorState = () => ({
    showDialog: this.showDialog,
    hideDialog: this.hideDialog,
    updateNotifications: this.updateNotifications,
    forceUpdate: this.state.resource.id ? () => this.navigateToDir(this.state.resource.id) : () => {},
    getSelection: () => this.state.selection,
    getSelectedResources: () => this.state.resourceChildren.filter(o => this.state.selection.some((s) => s === o.id)),
    getResource: () => this.state.resource,
    getResourceChildren: () => this.state.resourceChildren,
    getResourceLocation: () => this.state.resourceLocation,
    getNotifications: () => this.state.notifications,
    getSortState: () => ({ sortBy: this.state.sortBy, sortDirection: this.state.sortDirection })
  });

  render() {
    let {
      api,
      apiOptions,
      capabilities,
      className,
      id,
      initialResourceId,
      listViewLayout,
      signInRenderer,
      viewLayoutOptions
    } = this.props;

    let {
      apiInitialized,
      apiSignedIn,
      config,
      dialogElement,
      error,
      loadingResourceLocation,
      loadingView,
      notifications,
      resource,
      resourceChildren,
      resourceLocation,
      selection,
      sortBy,
      sortDirection,
      initializedCapabilities
    } = this.state;

    let viewLoadingElement = null;

    if (!apiInitialized) {
      viewLoadingElement = 'Problems with server connection';
    }

    if (!apiSignedIn) {
      viewLoadingElement = signInRenderer ? signInRenderer() : 'Not authenticated';
    }

    if (dialogElement) {
      viewLoadingElement = dialogElement;
    }

    // Don't remove!
    // if (showSpinner) {
    //   viewLoadingElement = null;
    //   (<SVG svg={spinnerIcon} className="oc-fm--file-navigator__view-loading-overlay-spinner" />);
    // }

    let viewLoadingOverlay = (viewLoadingElement) ? (
      <div className="oc-fm--file-navigator__view-loading-overlay">
        {viewLoadingElement}
      </div>
    ) : null;

    let locationItems = resourceLocation.map((o) => ({
      title: o.title,
      onClick: () => this.handleLocationBarChange(o.id)
    }));

    // TODO replace it by method "getCapabilities" for performace reason
    let contextMenuChildren = initializedCapabilities.
      filter(capability => (capability.contextMenuRenderer && capability.shouldBeAvailable(apiOptions))).
      map(capability => capability.contextMenuRenderer(apiOptions));

    return (
      <div
        className={`oc-fm--file-navigator ${className}`}
        onKeyDown={this.handleKeyDown}
        ref={(ref) => (this.containerRef = ref)}
      >
        <div className="oc-fm--file-navigator__location-bar">
          <LocationBar
            items={locationItems}
            loading={loadingResourceLocation}
          />
        </div>

        <div className="oc-fm--file-navigator__view">
          {viewLoadingOverlay}
          <ListView
            contextMenuId={id}
            onKeyDown={this.handleViewKeyDown}
            onRowClick={this.handleResourceItemClick}
            onRowRightClick={this.handleResourceItemRightClick}
            onRowDoubleClick={this.handleResourceItemDoubleClick}
            onSelection={this.handleSelection}
            onSort={this.handleSort}
            onRef={this.handleViewRef}
            loading={loadingView}
            selection={selection}
            sortBy={sortBy}
            sortDirection={sortDirection}
            items={resourceChildren}
            contextMenuChildren={contextMenuChildren}
            layout={listViewLayout}
            layoutOptions={viewLayoutOptions}
          >
            <Notifications
              className="oc-fm--file-navigator__notifications"
              notifications={notifications}
            />
          </ListView>
        </div>
      </div>
    );
  }
}

FileNavigator.propTypes = propTypes;
FileNavigator.defaultProps = defaultProps;
