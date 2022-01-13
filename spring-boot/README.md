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
