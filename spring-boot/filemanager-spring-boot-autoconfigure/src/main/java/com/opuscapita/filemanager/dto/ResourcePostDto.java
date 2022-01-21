package com.opuscapita.filemanager.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ResourcePostDto {

    private String parentId;

    private String type;

    private String name;

    private MultipartFile[] files;
}
