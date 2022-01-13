package com.opuscapita.filemanager.resource;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;
import java.util.Deque;

@Getter
@Setter
@AllArgsConstructor
public class Resource {

    private Long size;

    private String parentId;
    private String id;
    private String name;
    private String type;
    private String path;

    private ZonedDateTime createdTime;
    private ZonedDateTime modifiedTime;

    private Capabilities capabilities;

    private Deque<Resource> ancestors;
}
