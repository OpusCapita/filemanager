import React from 'react';
import './NoFilesFoundStub.less';
import Svg from '@opuscapita/react-svg/lib/SVG';
let nothingToShowIcon = require('@opuscapita/svg-icons/lib/add_to_photos.svg');

// TODO Add localization
export default () => (
  <div className="oc-fm--no-files-found-stub">
    <Svg
      className="oc-fm--no-files-found-stub__icon"
      svg={nothingToShowIcon}
    />
    <div className="oc-fm--no-files-found-stub__title">
      Nothing to show
    </div>
    <div className="oc-fm--no-files-found-stub__sub-title">
      Use toolbar or context menu to preform available actions
    </div>
    {/*
    <div className="oc-fm--no-files-found-stub__sub-title">
      Drop files here or use "New" button
    </div>
    */}
  </div>
);
