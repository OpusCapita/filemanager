import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './NoFilesFoundStub.less';
import SVG from '@opuscapita/react-svg/lib/SVG';
let nothingToShowIcon = require('@opuscapita/svg-icons/lib/add_to_photos.svg');

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
