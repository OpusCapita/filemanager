export const normalizeResource = ({
  id,
  createdTime,
  modifiedTime,
  parentId,
  ancestors,
  ...rest
} = {}) => id ? {
  id,
  createdTime: Date.parse(createdTime),
  modifiedTime: Date.parse(modifiedTime),
  parentId: parentId || null,
  ...rest,
  ...(ancestors && { ancestors: ancestors.map(normalizeResource) })
} :
  {};
