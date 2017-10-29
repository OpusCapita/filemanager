import React, { Component, PropTypes } from 'react';
import './NoFilesFoundStub.less';
let nothingToShowIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/add_to_photos.svg');

export default () => (
  <div className="oc-fm--no-files-found-stub">
    <SVG
      className="oc-fm--no-files-found-stub__icon"
      svg={nothingToShowIcon}
    />
    <div className="oc-fm--no-files-found-stub__title">
      Nothing to show
    </div>
    <div className="oc-fm--no-files-found-stub__sub-title">
      Drop files here or use "New" button
    </div>
  </div>
);
