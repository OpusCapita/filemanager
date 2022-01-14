package com.opuscapita.filemanager.service;

import com.opuscapita.filemanager.dto.ResourcePostDto;
import com.opuscapita.filemanager.resource.Resource;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Slf4j
@Service
public class FileManagerService {

    private final ResourceService resourceService;

    public FileManagerService(final ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    public Resource getRootResource() throws IOException {
        return resourceService.getRootResource();
    }

    public Resource getUnderRootResource(String id) throws IOException {
        return resourceService.getUnderRootResource(id);
    }

    public List<Resource> getChildren(String id, String orderBy, String orderDirection) throws IOException {
        return resourceService.getChildren(id, orderBy, orderDirection);
    }

    public void deleteResource(String id) throws IOException {
        resourceService.deleteResource(id);
    }

    public Resource createDirectory(ResourcePostDto resourcePostDto) throws IOException {
        return resourceService.createDirectory(resourcePostDto);
    }

    public List<Resource> uploadResource(ResourcePostDto resourcePostDto) throws IOException {
        return resourceService.uploadResource(resourcePostDto);
    }

    public void download(String[] ids, OutputStream outputStream) throws IOException {
        if (ids.length == 1) {
            Resource resource = getUnderRootResource(ids[0]);
            File file = new File(resource.getPath());
            if (resource.getType().equals(ResourceService.TYPE_DIRECTORY)) {
                log.debug("Directory: {}", resource.getName());

                Path dirPath = Paths.get(resource.getPath());
                try (ZipOutputStream zipOutputStream = new ZipOutputStream(outputStream)) {
                    Files.walkFileTree(dirPath, new SimpleFileVisitor<>() {
                        public FileVisitResult visitFile(Path filePath, BasicFileAttributes attrs) throws IOException {
                            zipOutputStream.putNextEntry(new ZipEntry(dirPath.relativize(filePath).toString()));
                            try (FileInputStream fileInputStream = new FileInputStream(filePath.toFile())) {
                                IOUtils.copy(fileInputStream, zipOutputStream);
                            }
                            zipOutputStream.closeEntry();
                            return FileVisitResult.CONTINUE;
                        }

                        public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                            zipOutputStream.putNextEntry(new ZipEntry(dirPath.relativize(dir).toString() + "/"));
                            zipOutputStream.closeEntry();
                            return FileVisitResult.CONTINUE;
                        }
                    });
                }
            } else if (resource.getType().equals(ResourceService.TYPE_FILE)) {
                try (FileInputStream fileInputStream = new FileInputStream(file)) {
                    IOUtils.copy(fileInputStream, outputStream);
                }
                return;
            }
        }

        try (ZipOutputStream zipOutputStream = new ZipOutputStream(outputStream)) {
            for (String id: ids) {
                Resource resource = getUnderRootResource(id);
                String filePath = resource.getPath();
                zipOutputStream.putNextEntry(new ZipEntry(resource.getName()));
                try (FileInputStream fileInputStream = new FileInputStream(new File(filePath))) {
                    IOUtils.copy(fileInputStream, zipOutputStream);
                }
                zipOutputStream.closeEntry();
            }
        }
    }
}
