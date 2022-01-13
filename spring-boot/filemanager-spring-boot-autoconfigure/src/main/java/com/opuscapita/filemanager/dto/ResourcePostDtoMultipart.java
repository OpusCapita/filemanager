package com.opuscapita.filemanager.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ResourcePostDtoMultipart {

    private String parentId;

    private String type;

    private MultipartFile[] files;
}
