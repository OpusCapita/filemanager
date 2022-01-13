# FileManager backend for Spring Boot

## Usage

Add dependency (example for Maven):

```
<dependency>
  <groupId>com.opuscapita.filemanager</groupId>
  <artifactId>filemanager-spring-boot-starter</artifactId>
  <version>0.0.1-SNAPSHOT</version>
</dependency>
```

Add configuration properties:
```
# application.yaml

filemanager:
  web:
    basePath: /api # filemanager API is exposed on {basePath}, can also be empty or `/`
  filesystem:
    rootPath: /path/to/mydir # path to root directory exposed via filemanager API
    rootName: Root directory # how this root directory is named in API responses
```
