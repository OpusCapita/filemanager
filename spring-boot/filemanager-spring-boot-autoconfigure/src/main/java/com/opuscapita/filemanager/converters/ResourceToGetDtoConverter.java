package com.opuscapita.filemanager.converters;

import com.opuscapita.filemanager.dto.ResourceGetDto;
import com.opuscapita.filemanager.dto.ResourceListGetDto;
import com.opuscapita.filemanager.resource.Resource;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ResourceToGetDtoConverter implements Converter<Resource, ResourceGetDto> {

    @Override
    public ResourceGetDto convert(Resource resource) {
        return new ResourceGetDto(resource.getSize(), resource.getParentId(),
            resource.getId(), resource.getName(), resource.getType(),
            resource.getCreatedTime(), resource.getModifiedTime(), resource.getCapabilities(),
            resource.getAncestors().stream().map(this::convert).collect(Collectors.toCollection(ArrayDeque::new)));
    }

    public ResourceListGetDto convert(List<Resource> resourceList) {
        return new ResourceListGetDto(resourceList.stream().map(this::convert).collect(Collectors.toList()));
    }
}
