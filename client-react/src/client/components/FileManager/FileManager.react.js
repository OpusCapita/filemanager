import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './FileManager.less';
import Toolbar from '../Toolbar';

const propTypes = {};
const defaultProps = {};

function requireAll(requireContext) {
  return requireContext.keys().map(key => ({
    name: key.replace(/(\.svg$|^\.\/)/gi, ''),
    svg: requireContext(key)
  }));
}

let icons = requireAll(require.context('@opuscapita/svg-icons/lib', true, /.*\.svg$/));


export default
class FileManager extends Component {
  constructor(props) {
    super(props);
    this.state = { icons };
  }

  getIcon(name) {
    return this.state.icons.filter(icon => icon.name === name)[0].svg;
  }

  render() {
    let { children } = this.props;

    return (
      <div className="oc-fm--file-manager">
        <div className="oc-fm--file-manager__toolbar">
          <Toolbar
            items={[
              { icon: { svg: this.getIcon('create_new_folder')}, label: 'Create folder' },
              { icon: { svg: this.getIcon('title')}, label: 'Rename' },
              { icon: { svg: this.getIcon('file_download')}, label: 'Download' },
              { icon: { svg: this.getIcon('delete')}, label: 'Remove' }
            ]}
            newButtonItems={[
              { icon: { svg: this.getIcon('create_new_folder')}, label: 'Create folder' },
              { icon: { svg: this.getIcon('title')}, label: 'Rename' },
              { icon: { svg: this.getIcon('file_download')}, label: 'Download' },
              { icon: { svg: this.getIcon('delete')}, label: 'Remove' }
            ]}
          />
        </div>
        <div className="oc-fm--file-manager__navigators">
          {children.map((child, i) => (
            <div key={i} className="oc-fm--file-manager__navigator">
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

FileManager.propTypes = propTypes;
FileManager.defaultProps = defaultProps;
