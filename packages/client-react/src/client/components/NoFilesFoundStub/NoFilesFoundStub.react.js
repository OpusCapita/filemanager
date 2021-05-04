import React from 'react';
import './NoFilesFoundStub.less';
import Svg from '@opuscapita/react-svg/lib/SVG';
import getMessage from '../../../translations'
const nothingToShowIcon = require('@opuscapita/svg-icons/lib/add_to_photos.svg');

// TODO Add localization
export default (locale) => (
  <div className="oc-fm--no-files-found-stub">
    <Svg
      className="oc-fm--no-files-found-stub__icon"
      svg={nothingToShowIcon}
    />
    <div className="oc-fm--no-files-found-stub__title">
      {getMessage(locale, "nothingToShow")}
    </div>
    <div className="oc-fm--no-files-found-stub__sub-title">
      {getMessage(locale, "useContextMenu")}
    </div>
    {/*
    <div className="oc-fm--no-files-found-stub__sub-title">
      Drop files here or use "New" button
    </div>
    */}
  </div>
);
