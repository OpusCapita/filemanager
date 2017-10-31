import React from 'react';
import ReactDOM from 'react-dom';
import Showroom from '@opuscapita/react-showroom-client';
import '@opuscapita/opuscapita-ui';

let element = document.getElementById('main');
let showroom = React.createElement(Showroom, {
  loaderOptions: {
    componentsInfo: require('.opuscapita-showroom/componentsInfo'),
    packagesInfo: require('.opuscapita-showroom/packageInfo')
  }
});

ReactDOM.render(showroom, element);
