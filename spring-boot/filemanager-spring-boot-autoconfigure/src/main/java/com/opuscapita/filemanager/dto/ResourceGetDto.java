package com.opuscapita.filemanager.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.opuscapita.filemanager.resource.Capabilities;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;
import java.util.Deque;

@Getter
@Setter
@AllArgsConstructor
public class ResourceGetDto {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long size;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String parentId;

    private String id;
    private String name;
    private String type;

    private ZonedDateTime createdTime;
    private ZonedDateTime modifiedTime;

    private Capabilities capabilities;

    private Deque<ResourceGetDto> ancestors;
}
