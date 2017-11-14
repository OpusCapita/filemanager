// execute Promises in series
// credits to https://gist.github.com/istarkov/a42b3bd1f2a9da393554
export const serializePromises = (series, onProgress) => series.reduce(
  (acc, cur, i) => acc.then(accValues => {
    onProgress(100 / series.length * i);
    return Promise.all([...accValues, cur()])
  }),
  Promise.resolve([])
);
