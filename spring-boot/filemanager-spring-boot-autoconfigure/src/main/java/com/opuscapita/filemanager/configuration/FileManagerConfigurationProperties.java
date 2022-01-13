package com.opuscapita.filemanager.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "filemanager")
public class FileManagerConfigurationProperties {

    private WebProperties web;

    private FileSystemProperties filesystem;

    @Data
    public static class FileSystemProperties {
        private String rootPath;
        private String rootName;
    }

    @Data
    public static class WebProperties {
        private String basePath;
    }
}
