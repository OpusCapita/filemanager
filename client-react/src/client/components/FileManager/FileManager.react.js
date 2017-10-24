import React, { Component, PropTypes } from 'react';
import './FileManager.less';
import ListView from '../ListView';
import { SortDirection } from 'react-virtualized';

const propTypes = {
  className: PropTypes.string,
  onGetConfig: PropTypes.func,
  initialResourceId: PropTypes.string
};
const defaultProps = {
  className: '',
  onGetConfig: () => new Promise((resolve, reject) => {}),
  initialResourceId: 'root'
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
      sortDirection: SortDirection.ASC
    };
  }

  componentDidMount = () => {
    this.getConfig();
  }

  getConfig = () => {
    this.props.onGetConfig().
      then(config => this.setState({ config })).
      catch(error => this.setState({ error }));
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
      sortDirection
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
          itemsCount={0}
        />
      </div>
    );
  }
}

FileManager.propTypes = propTypes;
FileManager.defaultProps = defaultProps;
