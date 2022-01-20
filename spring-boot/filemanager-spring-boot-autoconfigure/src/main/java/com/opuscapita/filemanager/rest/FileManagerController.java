package com.opuscapita.filemanager.rest;

import com.opuscapita.filemanager.converters.ResourceToGetDtoConverter;
import com.opuscapita.filemanager.dto.ResourceGetDto;
import com.opuscapita.filemanager.dto.ResourceListGetDto;
import com.opuscapita.filemanager.dto.ResourcePostDto;
import com.opuscapita.filemanager.resource.Resource;
import com.opuscapita.filemanager.service.FileManagerService;
import com.opuscapita.filemanager.service.ResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLConnection;
import java.util.Objects;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping(value = "${filemanager.web.base-path:/}", produces = "application/json")
@Tag(
    name = "FileManager API",
    description = "CRUD operations against file system"
)
public class FileManagerController {

    private final FileManagerService fileManagerService;
    private final ResourceToGetDtoConverter resourceToGetDtoConverter;

    public FileManagerController(final FileManagerService fileManagerService,
                                 final ResourceToGetDtoConverter resourceToGetDtoConverter) {
        this.fileManagerService = fileManagerService;
        this.resourceToGetDtoConverter = resourceToGetDtoConverter;
    }

    @Operation(
        summary = "Get the root directory",
        responses = {@ApiResponse(responseCode = "200")}
    )
    @GetMapping("/files")
    public ResourceGetDto getRootResource() throws IOException {
        return resourceToGetDtoConverter.convert(fileManagerService.getRootResource());
    }

    @Operation(
        summary = "Get resource by id",
        responses = {@ApiResponse(responseCode = "200")}
    )
    @GetMapping("/files/{id}")
    public ResourceGetDto getResource(@PathVariable String id) throws IOException {
        return resourceToGetDtoConverter.convert(fileManagerService.getUnderRootResource(id));
    }

    @Operation(
        summary = "Get directory children list",
        responses = {@ApiResponse(responseCode = "200")}
    )
    @GetMapping("/files/{id}/children")
    public ResourceListGetDto getChildren(@PathVariable String id,
                                          @Parameter(in = ParameterIn.QUERY,
                                              description = "Sort by property value",
                                              schema = @Schema(type = "string", allowableValues = {"name", "modifiedTime"})
                                          )
                                          @RequestParam(required = false, defaultValue = "name") String orderBy,
                                          @Parameter(in = ParameterIn.QUERY,
                                              description = "Sort direction: ascending/descending",
                                              schema = @Schema(type = "string", allowableValues = {"asc", "desc"})
                                          )
                                          @RequestParam(required = false, defaultValue = "asc") String orderDirection) throws IOException {
        return resourceToGetDtoConverter.convert(fileManagerService.getChildren(id, orderBy, orderDirection));
    }

    @Operation(summary = "Create new file or directory",
        description = "There are two responses for each request with 'application/json' and 'multipart/form-data' " +
            "content type correspondingly. At the moment swagger 3 doesn't fully support to declare some actions " +
            "with the same path with different produce types/responses.")
    @PostMapping(value = "/files", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResourceGetDto createDirectory(@RequestBody ResourcePostDto resourcePostDto) throws IOException {
        return resourceToGetDtoConverter.convert(fileManagerService.createDirectory(resourcePostDto));
    }

    @Operation(summary = "Upload a file", description = "There are two responses for each request with 'application/json' and 'multipart/form-data' " +
        "content type correspondingly. At the moment swagger 3 doesn't fully support to declare some actions " +
        "with the same path with different produce types/responses.")
    @PostMapping(value = "/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResourceListGetDto uploadResource(ResourcePostDto resourcePostDto) throws IOException {
        return resourceToGetDtoConverter.convert(fileManagerService.uploadResource(resourcePostDto));
    }

    @Operation(summary = "Delete resource by id")
    @DeleteMapping("/files/{id}")
    public void deleteResource(@PathVariable String id) throws IOException {
        fileManagerService.deleteResource(id);
    }

    @Operation(summary = "Download a file or a directory, or multiple files")
    @GetMapping("/download")
    public void download(
        @RequestParam String[] items,
        @RequestParam(defaultValue = "false", required = false) Boolean preview,
        HttpServletResponse response) throws IOException {

        response.setStatus(HttpServletResponse.SC_OK);

        if (items.length == 1) {
            Resource resource = fileManagerService.getUnderRootResource(items[0]);
            if (preview) {
                response.setHeader(HttpHeaders.CONTENT_DISPOSITION,
                    ContentDisposition.inline().filename(resource.getName()).build().toString());
                return;
            } else if (resource.getType().equals(ResourceService.TYPE_DIRECTORY)) {
                String outName = resource.getName() + ".zip";
                response.setHeader(HttpHeaders.CONTENT_DISPOSITION,
                    ContentDisposition.attachment().filename(outName).build().toString());
                response.setHeader(HttpHeaders.CONTENT_TYPE, guessMimeType(outName));
            } else if (resource.getType().equals(ResourceService.TYPE_FILE)) {
                response.setHeader(HttpHeaders.CONTENT_DISPOSITION,
                    ContentDisposition.attachment().filename(resource.getName()).build().toString());
                response.setHeader(HttpHeaders.CONTENT_TYPE, guessMimeType(resource.getName()));
            }
        } else {
            response.setStatus(HttpServletResponse.SC_OK);
            String outName = "archive.zip";
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION,
                ContentDisposition.attachment().filename(outName).build().toString());
            response.setHeader(HttpHeaders.CONTENT_TYPE, guessMimeType(outName));
        }

        fileManagerService.download(items, response.getOutputStream());
    }

    @Operation(summary = "Rename resource by id")
    @PatchMapping("/files/{id}")
    public ResourceGetDto renameResource(@PathVariable String id, @RequestBody RenameRequestBody req) throws IOException {
        return resourceToGetDtoConverter.convert(fileManagerService.renameResource(id, req.getName()));
    }

    @Data
    private static class RenameRequestBody {
        String name;
    }

    private String guessMimeType(String name) {
        return Objects.requireNonNullElse(
            URLConnection.guessContentTypeFromName(name),
            MediaType.APPLICATION_OCTET_STREAM_VALUE);
    }
}
