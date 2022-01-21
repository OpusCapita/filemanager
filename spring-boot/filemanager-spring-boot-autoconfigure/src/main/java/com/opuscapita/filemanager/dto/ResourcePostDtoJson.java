package com.opuscapita.filemanager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResourcePostDtoJson {

    private String parentId;

    private String type;

    private String name;
}
