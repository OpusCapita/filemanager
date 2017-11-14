// execute Promises in series
// credits to https://gist.github.com/istarkov/a42b3bd1f2a9da393554
export const serializePromises = series => series.reduce(
  (acc, cur) => acc.then(accValues => Promise.all([...accValues, cur()])),
  Promise.resolve([])
);
