// execute Promises in series
export const serializePromises = async getPromises => {
  const resolutions = [];

  for (let i = 0; i < getPromises.length; i++) {
    resolutions.push(await getPromises[i]());
  }

  return resolutions;
}
