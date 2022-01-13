package com.opuscapita.filemanager.rest;

import com.opuscapita.filemanager.converters.ResourceToGetDtoConverter;
import com.opuscapita.filemanager.dto.ResourceGetDto;
import com.opuscapita.filemanager.dto.ResourceListGetDto;
import com.opuscapita.filemanager.dto.ResourcePostDto;
import com.opuscapita.filemanager.service.FileManagerService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@CrossOrigin
@RequestMapping(value = "${filemanager.web.basePath:/}", produces = "application/json")
@Api("${filemanager.web.basePath:/")
public class FileManagerController {

    private final FileManagerService fileManagerService;
    private final ResourceToGetDtoConverter resourceToGetDtoConverter;

    public FileManagerController(final FileManagerService fileManagerService,
                                 final ResourceToGetDtoConverter resourceToGetDtoConverter) {
        this.fileManagerService = fileManagerService;
        this.resourceToGetDtoConverter = resourceToGetDtoConverter;
    }

    @GetMapping("/files")
    @ApiOperation(value = "Get the root directory.")
    public ResourceGetDto getRootResource() throws IOException {
        return resourceToGetDtoConverter.convert(fileManagerService.getRootResource());
    }

    @GetMapping("/files/{id}")
    @ApiOperation(value = "Get resource by id.")
    public ResourceGetDto getResource(@PathVariable String id) throws IOException {
        return resourceToGetDtoConverter.convert(fileManagerService.getUnderRootResource(id));
    }

    @GetMapping("/files/{id}/children")
    @ApiOperation(value = "Get directory children list.")
    public ResourceListGetDto getChildren(@PathVariable String id,
                                          @ApiParam(allowableValues = "name, modifiedTime", value = "Sort by property value.")
                                          @RequestParam(required = false, defaultValue = "name") String orderBy,
                                          @ApiParam(allowableValues = "asc, desc", value = "Sort direction: ascending/descending.")
                                          @RequestParam(required = false, defaultValue = "asc") String orderDirection) throws IOException {
        return resourceToGetDtoConverter.convert(fileManagerService.getChildren(id, orderBy, orderDirection));
    }

    @PostMapping(value = "/files")
    @ApiOperation(value = "Create new file or directory.",
            notes = "There are two responses for each request with 'application/json' and 'multipart/form-data' content type correspondingly:<ul>" +
                    "<li>ResourceGetDto schema - for 'application/json' request content type</li>" +
                    "<li>ResourceListGetDto schema - for 'multipart/form-data' request content type</li></ul>" +
                    "<p>At the moment swagger 3 doesn't fully support to declare some actions with the same path with different produce types/responses.</p>")
    public ResourceGetDto createDirectory(
            @RequestBody ResourcePostDto resourcePostDto) throws IOException {
        return resourceToGetDtoConverter.convert(fileManagerService.createDirectory(resourcePostDto));
    }

    @PostMapping(value = "/files", consumes = {"multipart/form-data"})
    public ResourceListGetDto uploadResource(ResourcePostDto resourcePostDto) throws IOException {
        return resourceToGetDtoConverter.convert(fileManagerService.uploadResource(resourcePostDto));
    }

    @DeleteMapping("/files/{id}")
    @ApiOperation(value = "Delete resource by id.")
    public void deleteResource(@PathVariable String id) throws IOException {
        fileManagerService.deleteResource(id);
    }

    // TODO: add PATCH for /files/*, add /download endpoint
}
