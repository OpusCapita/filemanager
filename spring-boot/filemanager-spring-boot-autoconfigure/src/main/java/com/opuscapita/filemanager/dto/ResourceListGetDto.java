package com.opuscapita.filemanager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ResourceListGetDto {

    private List<ResourceGetDto> items;
}
