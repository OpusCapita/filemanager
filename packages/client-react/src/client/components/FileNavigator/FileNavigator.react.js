import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './FileNavigator.less';
import ListView from '../ListView';
import LocationBar from '../LocationBar';
import Notifications from '../Notifications';
import Toolbar from '../Toolbar';
import { SortDirection } from 'react-virtualized';
import { find, isEqual } from 'lodash';
import clickOutside from 'react-click-outside';
import ContextMenu from '../ContextMenu';
import rawToReactElement from '../raw-to-react-element';
import {
  createHistory,
  pushToHistory,
} from '../history';

const propTypes = {
  id: PropTypes.string,
  api: PropTypes.object,
  apiOptions: PropTypes.object,
  capabilities: PropTypes.func,
  className: PropTypes.string,
  initialResourceId: PropTypes.string,
  listViewLayout: PropTypes.func,
  viewLayoutOptions: PropTypes.object,
  signInRenderer: PropTypes.func,
  onResourceLocationChange: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onResourceChange: PropTypes.func,
  onResourceChildrenChange: PropTypes.func
};
const defaultProps = {
  id: '',
  api: 'nodeV1',
  apiOptions: {
    locale: 'en'
  },
  capabilities: () => [],
  className: '',
  initialResourceId: '',
  listViewLayout: () => {},
  viewLayoutOptions: {},
  signInRenderer: null,
  onResourceLocationChange: () => {},
  onSelectionChange: () => {},
  onResourceChange: () => {},
  onResourceChildrenChange: () => {}
};

const MONITOR_API_AVAILABILITY_TIMEOUT = 16;

@clickOutside
export default
class FileNavigator extends Component {
  constructor(props) {
    super(props);
    let { locale } = props.apiOptions;
    this.state = {
      apiInitialized: false,
      apiOptions: props.apiOptions,
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
      history: createHistory(),
      selection: [],
      sortBy: 'title',
      sortDirection: SortDirection.ASC,
      initializedCapabilities: [],
      viewLayoutOptions: { ...props.viewLayoutOptions, locale }
    };
  }

  async componentDidMount() {
    await this.setChanges({});
  }

  async componentWillReceiveProps(nextProps) {
    let needToNavigate =
      (this.props.initialResourceId !== nextProps.initialResourceId) &&
      ((this.state.resource && this.state.resource.id) !== nextProps.initialResourceId);

    if (needToNavigate) {
      this.navigateToDir(nextProps.initialResourceId);
    }

    let { apiOptions, viewLayoutOptions } = nextProps;
    if (!isEqual(apiOptions, this.state.apiOptions)) {
      let { locale } = apiOptions;
      viewLayoutOptions = { ...viewLayoutOptions, locale };
      await this.setChanges({ apiOptions, viewLayoutOptions });
    }
  }

  async setChanges({ apiOptions = null, viewLayoutOptions = null }) {
    let { api, capabilities } = this.props;
    let haveOptions = !!apiOptions;
    if (!haveOptions) {
      ({ apiOptions, viewLayoutOptions } = this.state);// eslint-disable-line
    }

    let capabilitiesProps = this.getCapabilitiesProps();
    let initializedCapabilities = capabilities(apiOptions, capabilitiesProps);
    let stateChange = haveOptions ? { apiOptions, viewLayoutOptions } : {};
    this.setState({
      initializedCapabilities,
      ...stateChange,
      sortBy: viewLayoutOptions.initialSortBy || 'title',
      sortDirection: viewLayoutOptions.initialSortDirection || 'ASC'
    });

    await api.init({
      ...apiOptions,
      onInitSuccess: this.handleApiInitSuccess,
      onInitFail: this.handleApiInitFail,
      onSignInSuccess: this.handleApiSignInSuccess,
      onSignInFail: this.handleApiSignInFail
    });

    this.monitorApiAvailability();
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
  };

  handleApiInitSuccess = () => {
    this.setState({ apiInitialized: true });
  }

  handleApiInitFail = () => {
    this.setState({ apiInititalized: false });
    this.handleResourceChildrenChange([]);
    this.monitorApiAvailability();
  }

  handleApiSignInSuccess = () => {
    this.setState({ apiSignedIn: true });
  }

  handleApiSignInFail = () => {
    this.monitorApiAvailability();
    this.handleSelectionChange([]);
    this.handleResourceChildrenChange([]);
    this.handleResourceChange({});
    this.setState({ apiSignedIn: false });
  }

  handleLocationBarChange = (id) => {
    let { resource } = this.state;
    this.navigateToDir(id, resource.id);
  };

  handleHistoryChange = (history) => {
    this.setState({ history });

    let navigateToId = history.stack[history.currentPointer];
    this.navigateToDir(navigateToId, null, true, false);
  };

  navigateToDir = async (toId, idToSelect, startLoading = true, changeHistory = true) => {
    let { history, sortBy, sortDirection } = this.state;

    if (startLoading) {
      this.startViewLoading();
    }

    let resource = await this.getResourceById(toId);
    this.handleResourceChange(resource);

    let { resourceChildren } = await this.getChildrenForId(resource.id, sortBy, sortDirection);

    let newSelection = (typeof idToSelect === 'undefined' || idToSelect === null) ? [] : [idToSelect];

    if (changeHistory) {
      this.setState({ history: pushToHistory(history, toId) });
    }

    this.handleSelectionChange(newSelection);
    this.handleResourceChildrenChange(resourceChildren);

    this.stopViewLoading();
    this.setParentsForResource(resource);
  };

  async setParentsForResource(resource) {
    let resourceParents = await this.getParentsForId(resource.id);
    let resourceLocation = resourceParents.concat(resource);
    this.handleResourceLocationChange(resourceLocation);
    this.setState({ loadingResourceLocation: false });
  }

  async getParentsForId(id) {
    let { api } = this.props;
    let { apiOptions } = this.state;
    return await api.getParentsForId(apiOptions, id);
  }

  async getResourceById(id) {
    let { api } = this.props;
    let { apiOptions } = this.state;
    let result = await api.getResourceById(apiOptions, id);
    return result;
  }

  async getChildrenForId(id, sortBy, sortDirection) {
    let { api } = this.props;
    let { apiOptions } = this.state;
    let { resourceChildren } = await api.getChildrenForId(apiOptions, { id, sortBy, sortDirection });
    return { resourceChildren };
  }

  getResourceChildrenBySelection(selection) {
    let { resourceChildren } = this.state;
    let filteredResourceItems = resourceChildren.filter((o) => selection.indexOf(o.id) !== -1);
    return filteredResourceItems;
  }

  handleClickOutside = () => {
    this.handleSelectionChange([]);
  }

  handleResourceLocationChange = (resourceLocation) => {
    this.setState({ resourceLocation });
    this.props.onResourceLocationChange(resourceLocation);
  }

  handleSelectionChange = (selection) => {
    this.setState({ selection });
    this.props.onSelectionChange(selection);
  };

  handleResourceChildrenChange = (resourceChildren) => {
    this.setState({ resourceChildren });
    this.props.onResourceChildrenChange(resourceChildren);
  };

  handleResourceChange = (resource) => {
    this.setState({ resource });
    this.props.onResourceChange(resource);
  };

  handleSort = async ({ sortBy, sortDirection }) => {
    let { initializedCapabilities } = this.state;
    let sortCapability = find(initializedCapabilities, (o) => o.id === 'sort');
    if (!sortCapability) {
      return;
    }

    let sort = sortCapability.handler;
    this.setState({ loadingView: true });
    let newResourceChildren = await sort({ sortBy, sortDirection });
    this.handleResourceChildrenChange(newResourceChildren);
    this.setState({ sortBy, sortDirection, loadingView: false });
  };

  handleResourceItemClick = async ({ event, number, rowData }) => {

  };

  handleResourceItemRightClick = async ({ event, number, rowData }) => {

  };

  handleResourceItemDoubleClick = async ({ event, number, rowData }) => {
    let { loadingView } = this.state;
    let { id } = rowData;

    if (loadingView) {
      return;
    }

    let isDirectory = rowData.type === 'dir';
    if (isDirectory) {
      this.navigateToDir(id);
    }

    this.focusView();
  };

  handleViewKeyDown = async (e) => {
    let { api } = this.props;
    let { apiOptions, loadingView } = this.state;

    if ((e.which === 13 || e.which === 39) && !loadingView) { // Enter key or Right Arrow
      let { selection } = this.state;
      if (selection.length === 1) {
        // Navigate to selected resource if selected resource is single and is directory
        let selectedResourceChildren = this.getResourceChildrenBySelection(selection);

        if (!selectedResourceChildren[0]) {
          // Fix for fast selection updates
          return;
        }

        let isDirectory = selectedResourceChildren[0].type === 'dir';

        if (isDirectory) {
          this.navigateToDir(selectedResourceChildren[0].id);
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
  };

  handleKeyDown = async (e) => {

  }

  handleViewRef = (ref) => {
    this.viewRef = ref;
  }

  showDialog = (rawDialogElement) => {
    let dialogElement = rawToReactElement(rawDialogElement);

    this.setState({ dialogElement });
  }

  hideDialog = () => {
    this.setState({ dialogElement: null });
  }

  updateNotifications = (notifications) => {
    this.setState({ notifications });
  }

  getCapabilitiesProps = () => ({
    showDialog: this.showDialog,
    hideDialog: this.hideDialog,
    updateNotifications: this.updateNotifications,
    navigateToDir: this.navigateToDir,
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
      id,
      className,
      listViewLayout,
      signInRenderer
    } = this.props;

    let {
      apiInitialized,
      apiOptions,
      apiSignedIn,
      dialogElement,
      history,
      loadingResourceLocation,
      loadingView,
      notifications,
      resourceChildren,
      resourceLocation,
      selection,
      sortBy,
      sortDirection,
      initializedCapabilities,
      viewLayoutOptions
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

    let viewLoadingOverlay = (viewLoadingElement) ? (
      <div className="oc-fm--file-navigator__view-loading-overlay">
        {viewLoadingElement}
      </div>
    ) : null;

    let locationItems = resourceLocation.map((o) => ({
      name: this.props.api.getResourceName(apiOptions, o),
      onClick: () => this.handleLocationBarChange(o.id)
    }));

    // TODO replace it by method "getCapabilities" for performace reason
    let rowContextMenuChildren = initializedCapabilities.
        filter(capability => (
        capability.contextMenuRenderer &&
        capability.shouldBeAvailable(apiOptions) &&
        (capability.availableInContexts && capability.availableInContexts.indexOf('row') !== -1)
      )).
      map(capability => capability.contextMenuRenderer(apiOptions));

    let filesViewContextMenuChildren = initializedCapabilities.
      filter(capability => (
        capability.contextMenuRenderer &&
        capability.shouldBeAvailable(apiOptions) &&
        (capability.availableInContexts && capability.availableInContexts.indexOf('files-view') !== -1)
      )).
      map(capability => capability.contextMenuRenderer(apiOptions));

    let toolbarItems = initializedCapabilities.
        filter(capability => (
          (capability.availableInContexts && capability.availableInContexts.indexOf('toolbar') !== -1)
        )).
        map(capability => ({
          icon: capability.icon || null,
          label: capability.label || '',
          onClick: capability.handler || (() => {}),
          disabled: !capability.shouldBeAvailable(apiOptions)
        }));

    let newButtonItems = initializedCapabilities.
        filter(capability => (
          (capability.availableInContexts && capability.availableInContexts.indexOf('new-button') !== -1)
        )).
        map(capability => ({
          icon: capability.icon || null,
          label: capability.label || '',
          onClick: capability.handler || (() => {}),
          disabled: !capability.shouldBeAvailable(apiOptions)
        }));

    let rowContextMenuId = `row-context-menu-${id}`;
    let filesViewContextMenuId = `files-view-context-menu-${id}`;

    return (
      <div
        className={`oc-fm--file-navigator ${className}`}
        onKeyDown={this.handleKeyDown}
        ref={(ref) => (this.containerRef = ref)}
      >
        {viewLoadingOverlay}
        <div className="oc-fm--file-navigator__toolbar">
          <Toolbar
            items={toolbarItems}
            newButtonItems={newButtonItems}
            history={history}
            onMoveForward={this.handleHistoryChange}
            onMoveBackward={this.handleHistoryChange}
            locale={apiOptions.locale}
          />
        </div>
        <div className="oc-fm--file-navigator__view">
          <ListView
            rowContextMenuId={rowContextMenuId}
            filesViewContextMenuId={filesViewContextMenuId}
            onKeyDown={this.handleViewKeyDown}
            onRowClick={this.handleResourceItemClick}
            onRowRightClick={this.handleResourceItemRightClick}
            onRowDoubleClick={this.handleResourceItemDoubleClick}
            onSelection={this.handleSelectionChange}
            onSort={this.handleSort}
            onRef={this.handleViewRef}
            loading={loadingView}
            selection={selection}
            sortBy={sortBy}
            sortDirection={sortDirection}
            items={resourceChildren}
            layout={listViewLayout}
            layoutOptions={viewLayoutOptions}
          >
            <Notifications
              className="oc-fm--file-navigator__notifications"
              notifications={notifications}
            />
          </ListView>
        </div>
        <div className="oc-fm--file-navigator__location-bar">
          <LocationBar
            items={locationItems}
            loading={loadingResourceLocation}
          />
        </div>
        <ContextMenu triggerId={rowContextMenuId}>
          {rowContextMenuChildren.map((contextMenuChild, i) => ({ ...contextMenuChild, key: i }))}
        </ContextMenu>
        <ContextMenu triggerId={filesViewContextMenuId}>
          {filesViewContextMenuChildren.map((contextMenuChild, i) => ({ ...contextMenuChild, key: i }))}
        </ContextMenu>
      </div>
    );
  }
}

FileNavigator.propTypes = propTypes;
FileNavigator.defaultProps = defaultProps;
