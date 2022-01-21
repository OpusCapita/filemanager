package com.opuscapita.filemanager.service;

import com.opuscapita.filemanager.dto.ResourcePostDto;
import com.opuscapita.filemanager.resource.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

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
        resourceService.download(ids, outputStream);
    }

    public Resource renameResource(String id, String name) throws IOException {
        return resourceService.renameResource(id, name);
    }
}
