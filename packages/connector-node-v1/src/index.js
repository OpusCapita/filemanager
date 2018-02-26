import api from './api';
import apiOptions from './apiOptions';
import capabilities from './capabilities';
import listViewLayout from './list-view-layout';
import viewLayoutOptions from './view-layout-options';

export default {
  api,
  apiOptions,
  capabilities,
  listViewLayout,
  viewLayoutOptions
};
/* FIXME: export function instead of object.
 * apiOptions will be available with returnValue.api.options or returnValue.api[...options].
 * viewLayoutOptions will be available with returnValue.listViewLayout.options or returnValue.listViewLayout[...options].
export default function({ apiOptions, viewLayoutOptions }) => {
  const initiatedApi = api(apiOptions);

  return {
    api: initiatedApi,
    capabilities: capabilities(initiatedApi),
    listViewLayout: listViewLayout(viewLayoutOptions)
  };
}
*/
