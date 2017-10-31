import React from 'react';
import ReactDOM from 'react-dom';
import Showroom from '@opuscapita/react-showroom-client';
import env from '../.env';
import '@opuscapita/opuscapita-ui';

console.log('env2', env);

let element = document.getElementById('main');
let showroom = React.createElement(Showroom, {
  loaderOptions: {
    componentsInfo: require('.opuscapita-showroom/componentsInfo'),
    packagesInfo: require('.opuscapita-showroom/packageInfo')
  }
});

window.env = env;

ReactDOM.render(showroom, element);
