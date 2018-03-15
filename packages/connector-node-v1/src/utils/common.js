// execute Promises in series
export const serializePromises = ({ series, onProgress }) => series.reduce(
  (acc, cur, i) => acc.then(accValues => {
    onProgress(100 / series.length * i);
    return Promise.all([...accValues, cur({ onProgress, i, l: series.length })])
  }),
  Promise.resolve([])
)

export function normalizeResource(resource) {
  if (resource) {
    return {
      capabilities: resource.capabilities,
      createdTime: Date.parse(resource.createdTime),
      id: resource.id,
      modifiedTime: Date.parse(resource.modifiedTime),
      name: resource.name,
      type: resource.type,
      size: resource.size,
      parentId: resource.parentId ? resource.parentId : null
    };
  } else {
    return {};
  }
}
