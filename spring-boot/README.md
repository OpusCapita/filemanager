# FileManager backend for Spring Boot

## Demo

- open regular demo link for particular branch (e.g. for `master` this is `https://demo.core.dev.opuscapita.com/filemanager/master/`, for different branch replace `master` with branch name)
- to use Spring boot backend instead of NodeJS backend open browser console and execute there:
```
env.SERVER_URL = env.SERVER_URL + "/spring-boot-backend"
```
- open `components` menu, select there `FileManagerOne` - it'll be FileManager UI with Spring Boot backend

## Installation

### With access to OpusCapita artifactory

Add dependency (example for Maven):

```
<dependency>
  <groupId>com.opuscapita.filemanager</groupId>
  <artifactId>filemanager-spring-boot-starter</artifactId>
  <version>0.0.1-SNAPSHOT</version>
</dependency>
```

### Without access to OpusCapita artifactory

Clone repository, then
```
cd spring-boot
mvn package
```

Then locate .jar artifacts in `<module>/target` directories and use them locally:
- https://maven.apache.org/guides/mini/guide-3rd-party-jars-local.html
- https://www.baeldung.com/install-local-jar-with-maven/
- or include directly into pom.xml:
```
<dependency>
  <groupId>com.opuscapita.filemanager</groupId>
  <artifactId>filemanager-spring-boot-autoconfigure</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <scope>system</scope>
  <systemPath>path/to/filemanager/spring-boot/filemanager-spring-boot-autoconfigure/target/filemanager-spring-boot-autoconfigure-0.0.1-SNAPSHOT.jar</systemPath>
</dependency>
```

## Configuration

Add configuration properties:
```
# application.yaml

filemanager:
  web:
    base-path: /api # filemanager API is exposed on {base-path}, can also be empty or `/`
  filesystem:
    root-path: /path/to/mydir # path to root directory exposed via filemanager API
    root-name: Root directory # how this root directory is named in API responses
```

By default Java has a limit for size of uploads set to 1Mb. If it needs to be changed, use the following properties in application:

```
spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
```

## Development

Start demo app:
```
cd demo
mvn spring-boot:run
```

Start UI if needed:
```
cd ..
npm i # install dependencies
cd packages/client-react

# in env.js set process.env.SERVER_URL to 'http://localhost:8080/myfilemanager'

npm start

# open UI in browser: http://localhost:3000
```

Visit `/swagger-ui.html` to open Swagger/OpenAPI v3 UI.
