export function normalizeResource(resource) {
  if (resource) {
    const hasLink = (/.*-Link:.*/.test(resource.name));
    const name = hasLink ? resource.name.split('-Link:')[0] : resource.name;
    const href = hasLink ? `//${atob(resource.name.split('-Link:')[1])}` : '';

    return {
      capabilities: resource.capabilities,
      createdTime: Date.parse(resource.createdTime),
      id: resource.id,
      modifiedTime: Date.parse(resource.modifiedTime),
      name,
      href,
      type: resource.type,
      size: resource.size,
      parentId: resource.parentId ? resource.parentId : null,
      ancestors: resource.ancestors ? resource.ancestors : null
    };
  } else {
    return {};
  }
}
