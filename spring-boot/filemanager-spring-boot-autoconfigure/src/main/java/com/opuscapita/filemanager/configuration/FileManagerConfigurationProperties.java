package com.opuscapita.filemanager.configuration;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ConfigurationProperties(prefix = "filemanager")
public class FileManagerConfigurationProperties {

    private WebProperties web;

    private FileSystemProperties filesystem;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FileSystemProperties {
        private String rootPath;
        private String rootName;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class WebProperties {
        private String basePath;
    }
}
