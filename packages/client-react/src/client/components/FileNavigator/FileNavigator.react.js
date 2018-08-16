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
import { createHistory, pushToHistory } from '../history';

function hasContext(capability, context) {
  return capability.availableInContexts && capability.availableInContexts.indexOf(context) !== -1;
}

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
  onResourceItemClick: PropTypes.func,
  onResourceItemRightClick: PropTypes.func,
  onResourceItemDoubleClick: PropTypes.func,
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
  onResourceItemClick: () => {},
  onResourceItemRightClick: () => {},
  onResourceItemDoubleClick: () => {},
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
      history: createHistory(),
      selection: [],
      sortBy: 'title',
      sortDirection: SortDirection.ASC,
      initializedCapabilities: []
    };
  }

  componentDidMount() {
    this.initialize();
  }

  componentWillReceiveProps(nextProps) {
    const needToNavigate =
      (this.props.initialResourceId !== nextProps.initialResourceId) &&
      ((this.state.resource && this.state.resource.id) !== nextProps.initialResourceId);

    if (needToNavigate) {
      this.navigateToDir(nextProps.initialResourceId);
    }

    if (!isEqual(this.props.apiOptions, nextProps.apiOptions)) {
      const { apiOptions, capabilities } = nextProps;
      const capabilitiesProps = this.getCapabilitiesProps();
      const initializedCapabilities = capabilities(apiOptions, capabilitiesProps);
      this.setState({ initializedCapabilities });
    }
  }

  initialize = async () => {
    const { apiOptions, api, capabilities, viewLayoutOptions } = this.props;

    const capabilitiesProps = this.getCapabilitiesProps();
    const initializedCapabilities = capabilities(apiOptions, capabilitiesProps);

    const { apiInitialized, apiSignedIn } = await api.init({ ...apiOptions });

    this.setState({
      apiInitialized,
      apiSignedIn,
      initializedCapabilities,
      sortBy: viewLayoutOptions.initialSortBy || 'title',
      sortDirection: viewLayoutOptions.initialSortDirection || 'ASC'
    }, _ => {
      if (apiSignedIn) {
        this.handleApiReady();
      } else {
        if (apiInitialized) {
          this.handleApiSignInFail();
        } else {
          this.handleApiInitFail();
        }

        this.monitorApiAvailability();
      }
    });
  }

  startViewLoading = () => {
    this.setState({ loadingView: true, loadingResourceLocation: true });
  };

  stopViewLoading = () => {
    this.setState({ loadingView: false });
  };

  focusView = () => {
    this.viewRef.focus();
  };

  handleApiReady = () => {
    const { initialResourceId } = this.props;
    const resourceId = this.state.resource.id;
    const idToNavigate = typeof resourceId === 'undefined' ? initialResourceId : resourceId;
    this.navigateToDir(idToNavigate);
  };

  monitorApiAvailability = () => {
    const { api } = this.props;

    this.apiAvailabilityTimeout = setTimeout(() => {
      if (api.hasSignedIn()) {
        this.setState({ apiInitialized: true, apiSignedIn: true });
        this.handleApiReady();
      } else {
        this.monitorApiAvailability();
      }
    }, MONITOR_API_AVAILABILITY_TIMEOUT);
  };

  handleApiInitFail = () => {
    this.handleResourceChildrenChange([]);
  };

  handleApiSignInFail = () => {
    this.handleSelectionChange([]);
    this.handleResourceChildrenChange([]);
    this.handleResourceChange({});
  };

  handleLocationBarChange = (id) => {
    const { resource } = this.state;
    this.navigateToDir(id, resource.id);
  };

  handleHistoryChange = (history) => {
    this.setState({ history });

    const navigateToId = history.stack[history.currentPointer];
    this.navigateToDir(navigateToId, null, true, false);
  };

  navigateToDir = async (toId, idToSelect, startLoading = true, changeHistory = true) => {
    const { history, sortBy, sortDirection } = this.state;

    if (startLoading) {
      this.startViewLoading();
    }

    const resource = await this.getResourceById(toId);
    this.handleResourceChange(resource);

    const resourceChildren = await this.getChildrenForId(resource.id, sortBy, sortDirection);

    const newSelection = (typeof idToSelect === 'undefined' || idToSelect === null) ? [] : [idToSelect];

    if (changeHistory) {
      this.setState({ history: pushToHistory(history, toId) });
    }

    this.handleSelectionChange(newSelection);
    this.handleResourceChildrenChange(resourceChildren);

    this.stopViewLoading();
    this.setParentsForResource(resource);
  };

  async setParentsForResource(resource) {
    const resourceParents = await this.getParentsForId(resource.id);
    const resourceLocation = resourceParents.concat(resource);
    this.handleResourceLocationChange(resourceLocation);
    this.setState({ loadingResourceLocation: false });
  }

  async getParentsForId(id) {
    const { api, apiOptions } = this.props;
    return await api.getParentsForId(apiOptions, id);
  }

  async getResourceById(id) {
    const { api, apiOptions } = this.props;
    const result = await api.getResourceById(apiOptions, id);
    return result;
  }

  async getChildrenForId(id, sortBy, sortDirection) {
    const { api, apiOptions } = this.props;
    return api.getChildrenForId(apiOptions, { id, sortBy, sortDirection });
  }

  getResourceChildrenBySelection(selection) {
    const { resourceChildren } = this.state;
    const filteredResourceItems = resourceChildren.filter((o) => selection.indexOf(o.id) !== -1);
    return filteredResourceItems;
  }

  handleClickOutside = () => {
    this.handleSelectionChange([]);
  };

  handleResourceLocationChange = (resourceLocation) => {
    this.setState({ resourceLocation });
    this.props.onResourceLocationChange(resourceLocation);
  };

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
    const { initializedCapabilities } = this.state;
    const sortCapability = find(initializedCapabilities, (o) => o.id === 'sort');
    if (!sortCapability) {
      return;
    }

    const sort = sortCapability.handler;
    this.setState({ loadingView: true });
    const newResourceChildren = await sort({ sortBy, sortDirection });
    this.handleResourceChildrenChange(newResourceChildren);
    this.setState({ sortBy, sortDirection, loadingView: false });
  };

  handleResourceItemClick = async ({ event, number, rowData }) => {
    this.props.onResourceItemClick({ event, number, rowData });
  };

  handleResourceItemRightClick = async ({ event, number, rowData }) => {
    this.props.onResourceItemRightClick({ event, number, rowData });
  };

  handleResourceItemDoubleClick = async ({ event, number, rowData }) => {
    const { loadingView } = this.state;
    const { id } = rowData;

    if (loadingView) {
      return;
    }

    const isDirectory = rowData.type === 'dir';
    if (isDirectory) {
      this.navigateToDir(id);
    }

    this.focusView();

    this.props.onResourceItemDoubleClick({ event, number, rowData });
  };

  handleViewKeyDown = async (e) => {
    const { api, apiOptions } = this.props;
    const { loadingView } = this.state;

    if ((e.which === 13 || e.which === 39) && !loadingView) { // Enter key or Right Arrow
      const { selection } = this.state;
      if (selection.length === 1) {
        // Navigate to selected resource if selected resource is single and is directory
        const selectedResourceChildren = this.getResourceChildrenBySelection(selection);

        if (!selectedResourceChildren[0]) {
          // Fix for fast selection updates
          return;
        }

        const isDirectory = selectedResourceChildren[0].type === 'dir';

        if (isDirectory) {
          this.navigateToDir(selectedResourceChildren[0].id);
        }
      }
    }

    if ((e.which === 8 || e.which === 37) && !loadingView) { // Backspace or Left Arrow
      // Navigate to parent directory
      const { resource } = this.state;
      const parentId = await api.getParentIdForResource(apiOptions, resource);
      if (parentId) {
        this.navigateToDir(parentId, resource.id);
      }
    }
  };

  handleKeyDown = async (e) => {

  };

  handleViewRef = (ref) => {
    this.viewRef = ref;
  };

  showDialog = (rawDialogElement) => {
    const dialogElement = rawToReactElement(rawDialogElement);

    this.setState({ dialogElement });
  };

  hideDialog = () => {
    this.setState({ dialogElement: null });
  };

  updateNotifications = (notifications) => {
    this.setState({ notifications });
  };

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

  getCapability = ({ context, isDataView = false }) => {
    const { apiOptions } = this.props;
    const { initializedCapabilities } = this.state;
    return initializedCapabilities.
      filter(capability => (
        (isDataView ? capability.shouldBeAvailable(apiOptions) : true) && hasContext(capability, context)
      )).
      map(capability => {
        const res = ({
          icon: capability.icon,
          label: capability.label || '',
          onClick: capability.handler || (() => {}),
        });

        if (!isDataView) {
          res.disabled = !capability.shouldBeAvailable(apiOptions);
        }
        return res;
      });
  };

  render() {
    const {
      id,
      apiOptions,
      className,
      listViewLayout,
      signInRenderer,
      viewLayoutOptions
    } = this.props;

    const {
      apiInitialized,
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
      sortDirection
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

    const viewLoadingOverlay = (viewLoadingElement) ? (
      <div className="oc-fm--file-navigator__view-loading-overlay">
        {viewLoadingElement}
      </div>
    ) : null;

    const locationItems = resourceLocation.map((o) => ({
      name: this.props.api.getResourceName(this.props.apiOptions, o),
      onClick: () => this.handleLocationBarChange(o.id)
    }));

    const rowContextMenuItems = this.getCapability({ context: 'row', isDataView: true });
    const filesViewContextMenuItems = this.getCapability({ context: 'files-view', isDataView: true });
    const toolbarItems = this.getCapability({ context: 'toolbar' });
    const newButtonItems = this.getCapability({ context: 'new-button' });

    const rowContextMenuId = `row-context-menu-${id}`;
    const filesViewContextMenuId = `files-view-context-menu-${id}`;

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
        <ContextMenu
          triggerId={rowContextMenuId}
          items={rowContextMenuItems}
        />
        <ContextMenu
          triggerId={filesViewContextMenuId}
          items={filesViewContextMenuItems}
        />
      </div>
    );
  }
}

FileNavigator.propTypes = propTypes;
FileNavigator.defaultProps = defaultProps;
