package com.opuscapita.filemanager.configuration;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@ConfigurationProperties(prefix = "filemanager")
public class FileManagerConfigurationProperties {

    private WebProperties web;

    private FileSystemProperties filesystem;

    @Data
    @AllArgsConstructor
    @RequiredArgsConstructor
    public static class FileSystemProperties {
        private String rootPath;
        private String rootName;
    }

    @Data
    @AllArgsConstructor
    @RequiredArgsConstructor
    public static class WebProperties {
        private String basePath;
    }
}
