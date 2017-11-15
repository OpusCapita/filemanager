// execute Promises in series
export const serializePromises = ({ series, onProgress, onFail }) => series.reduce(
  (acc, cur, i) => acc.then(accValues => {
    onProgress(100 / series.length * i);
    return Promise.all([...accValues, cur({ onProgress, i, l: series.length, onFail })])
  }),
  Promise.resolve([])
);
