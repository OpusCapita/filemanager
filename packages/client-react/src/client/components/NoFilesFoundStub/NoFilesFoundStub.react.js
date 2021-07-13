import React from 'react';
import PropTypes from "prop-types";
import Svg from '@opuscapita/react-svg/lib/SVG';
const nothingToShowIcon = require('@opuscapita/svg-icons/lib/add_to_photos.svg');

import getMessage from '../../../translations'

import './NoFilesFoundStub.less';

const NoFilesFoundStub = ({ locale }) => (
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

NoFilesFoundStub.propTypes = {
  locale: PropTypes.string
};

NoFilesFoundStub.defaultProps = {
  locale: 'en',
};

export default NoFilesFoundStub;
