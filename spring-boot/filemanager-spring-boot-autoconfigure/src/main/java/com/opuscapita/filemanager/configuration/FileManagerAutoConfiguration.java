package com.opuscapita.filemanager.configuration;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(FileManagerConfigurationProperties.class)
@ComponentScan("com.opuscapita.filemanager")
public class FileManagerAutoConfiguration {
}
