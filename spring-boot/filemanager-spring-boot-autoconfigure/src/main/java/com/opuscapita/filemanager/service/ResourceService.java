package com.opuscapita.filemanager.service;

import com.opuscapita.filemanager.configuration.FileManagerConfigurationProperties;
import com.opuscapita.filemanager.dto.ResourcePostDto;
import com.opuscapita.filemanager.error.ResourceNotFoundException;
import com.opuscapita.filemanager.resource.Capabilities;
import com.opuscapita.filemanager.resource.Resource;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Service;

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
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Comparator;
import java.util.Deque;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Slf4j
@Service
public class ResourceService {

    public final static String TYPE_DIRECTORY = "dir";
    public final static String TYPE_FILE = "file";
    private final String rootPath;
    private final String rootName;

    public ResourceService(FileManagerConfigurationProperties configurationProperties) {
        rootPath = configurationProperties.getFilesystem().getRootPath();
        rootName = configurationProperties.getFilesystem().getRootName();
    }

    public Resource getRootResource() throws IOException {
        return getResource(new File(rootPath));
    }

    public Resource getUnderRootResource(String id) throws IOException {
        String resourcePath = rootPath + id2path(id);

        File file = new File(resourcePath);

        if (!file.exists()) {
            throw new ResourceNotFoundException(id);
        }

        return getResource(file);
    }

    public List<Resource> getChildren(String id, String orderBy, String orderDirection) throws IOException {
        List<Resource> children = new ArrayList<>();
        Resource resource = getUnderRootResource(id);

        File file = new File(resource.getPath());

        if (file.isDirectory()) {
            for (File child : file.listFiles()) {
                children.add(getResource(child));
            }

            Comparator<Resource> comparator = Comparator.comparing(Resource::getName);

            if ("modifiedTime".equalsIgnoreCase(orderBy)) {
                comparator = Comparator.comparing(Resource::getModifiedTime);
            }

            if (orderDirection.equalsIgnoreCase("desc")) {
                comparator = comparator.reversed();
            }

            children.sort(comparator);
        }

        return children;
    }

    public void deleteResource(String id) throws IOException {
        Resource resource = getUnderRootResource(id);

        File file = new File(resource.getPath());

        if (file.isDirectory()) {
            FileUtils.deleteDirectory(file);
        } else {
            Files.delete(file.toPath());
        }
    }

    public Resource createDirectory(ResourcePostDto resourcePostDto) throws IOException {
        Resource resource = getUnderRootResource(resourcePostDto.getParentId());

        File file = new File(resource.getPath() + File.separator + resourcePostDto.getName());
        Files.createDirectory(file.toPath());

        return getResource(file);
    }

    public List<Resource> uploadResource(ResourcePostDto resourcePostDto) throws IOException {
        Resource resource = getUnderRootResource(resourcePostDto.getParentId());

        List<Resource> resources = new ArrayList<>();

        Arrays.stream(resourcePostDto.getFiles()).forEach(multipartFile -> {
            try {
                File file = new File(resource.getPath() + File.separator + multipartFile.getOriginalFilename());
                Files.copy(multipartFile.getInputStream(), file.toPath());

                resources.add(getResource(file));
            } catch (IOException e) {
                e.printStackTrace();
            }
        });

        return resources;
    }

    public Resource renameResource(String id, String name) throws IOException {
        Resource resource = getUnderRootResource(id);
        // attempt to rename root directory should fail
        if (resource.getParentId() == null) {
            throw new RuntimeException("Cannot rename root directory");
        }
        // trying to rename to the same name should return initial resource
        if (resource.getName().equals(name)) {
            return resource;
        }

        // check if name is sane
        if (name.contains("/")) {
            throw new RuntimeException("Name cannot contain forbidden symbols");
        }

        // check if name is already taken by neighbouring resources
        if (getChildren(resource.getParentId(), "name", "asc").stream().anyMatch(r -> r.getName().equals(name))) {
            throw new RuntimeException("Another resource with this name already exists");
        }

        String parentPath = getUnderRootResource(resource.getParentId()).getPath();

        Path oldPath = Path.of(parentPath).resolve(resource.getName());
        Path newPath = Path.of(parentPath).resolve(name);
        Files.move(oldPath, oldPath.resolveSibling(name));
        return getResource(newPath.toFile());
    }

    public void download(String[] ids, OutputStream outputStream) throws IOException {
        if (ids.length == 1) {
            Resource resource = getUnderRootResource(ids[0]);
            if (resource.getType().equals(ResourceService.TYPE_DIRECTORY)) {
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
                            zipOutputStream.putNextEntry(new ZipEntry(
                                FilenameUtils.separatorsToUnix(dirPath.relativize(dir).toString()) + "/"));
                            zipOutputStream.closeEntry();
                            return FileVisitResult.CONTINUE;
                        }
                    });
                }
            } else if (resource.getType().equals(ResourceService.TYPE_FILE)) {
                try (FileInputStream fileInputStream = new FileInputStream(new File(resource.getPath()))) {
                    IOUtils.copy(fileInputStream, outputStream);
                }
            }
        } else {
            try (ZipOutputStream zipOutputStream = new ZipOutputStream(outputStream)) {
                for (String id : ids) {
                    Resource resource = getUnderRootResource(id);
                    zipOutputStream.putNextEntry(new ZipEntry(resource.getName()));
                    try (FileInputStream fileInputStream = new FileInputStream(new File(resource.getPath()))) {
                        IOUtils.copy(fileInputStream, zipOutputStream);
                    }
                    zipOutputStream.closeEntry();
                }
            }
        }
    }

    private Resource getResource(File file) throws IOException {
        BasicFileAttributes attr = Files.readAttributes(file.toPath(), BasicFileAttributes.class);

        Long size = file.isDirectory() ? null : attr.size();

        String parentId = isRoot(file.toPath()) ? null : path2id(file.getParentFile().toPath());
        String id = path2id(file.toPath());
        String path = file.getPath();
        String name = isRoot(file.toPath()) ? rootName : file.getName();
        String type = file.isDirectory() ? TYPE_DIRECTORY : TYPE_FILE;
        ZonedDateTime createdTime = ZonedDateTime.ofInstant(attr.creationTime().toInstant(), ZoneId.systemDefault());
        ZonedDateTime modifiedTime = ZonedDateTime.ofInstant(attr.lastModifiedTime().toInstant(), ZoneId.systemDefault());

        Capabilities capabilities;

        if (file.isDirectory()) {
            if (isRoot(file.toPath())) {
                capabilities = Capabilities.ROOT_DIR;
            } else {
                capabilities = Capabilities.COMMON_DIR;
            }
        } else {
            capabilities = Capabilities.COMMON_FILE;
        }

        Deque<Resource> ancestors = new ArrayDeque<>();

        while (!isRoot(file.toPath())) {
            file = file.getParentFile();

            ancestors.addFirst(getResource(file));
        }

        return new Resource(size, parentId, id, name, type,
            path, createdTime, modifiedTime, capabilities, ancestors);
    }

    private String path2id(Path path) {
        if (isRoot(path)) {
            path = Paths.get(File.separator);
        } else {
            path = Paths.get(path.toString().substring(Paths.get(rootPath).toString().length()));
        }

        return Base64.getEncoder().withoutPadding().encodeToString(path.toString().getBytes());
    }

    private String id2path(String id) {
        return new String(Base64.getDecoder().decode(id));
    }

    private Boolean isRoot(Path path) {
        return Paths.get(rootPath).equals(path);
    }
}
