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
      parentId: resource.parentId ? resource.parentId : null,
      ancestors: resource.ancestors ? resource.ancestors : null
    };
  } else {
    return {};
  }
}
