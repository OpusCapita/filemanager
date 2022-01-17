package com.opuscapita.filemanager.service;

import com.opuscapita.filemanager.configuration.FileManagerConfigurationProperties;
import com.opuscapita.filemanager.resource.Resource;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@Slf4j
public class FileManagerServiceTest {

    private FileManagerService service;

    @BeforeEach
    void setup() throws IOException {

        Path tmpdir = Files.createTempDirectory("fmRoot");

        new File(tmpdir.resolve("one").toString()).mkdirs();
        new File(tmpdir.resolve("one/1.txt").toString()).createNewFile();
        new File(tmpdir.resolve("one/2.txt").toString()).createNewFile();
        new File(tmpdir.resolve("two").toString()).mkdirs();
        File abcFile = new File(tmpdir.resolve("two/abc.txt").toString());
        abcFile.createNewFile();
        FileUtils.writeStringToFile(abcFile, "abc", StandardCharsets.UTF_8);

        service = new FileManagerService(new ResourceService(
            new FileManagerConfigurationProperties(
                new FileManagerConfigurationProperties.WebProperties("/"),
                new FileManagerConfigurationProperties.FileSystemProperties(tmpdir.toString(), "Root directory"))));
        log.debug(tmpdir.toString());
    }

    @Test
    void readingFilesystemTreeWorks() throws IOException {
        Resource root = service.getRootResource();
        assertEquals("Root directory", root.getName());
        assertNull(root.getParentId());
        assertTrue(root.getAncestors().isEmpty());

        List<Resource> rootChildren = service.getChildren(root.getId(), "name", "asc");
        assertEquals(2, rootChildren.size());
        assertEquals("one", rootChildren.get(0).getName());
        assertEquals("dir", rootChildren.get(0).getType());
        assertEquals("two", rootChildren.get(1).getName());
        assertEquals("dir", rootChildren.get(1).getType());

        List<Resource> dirOneChildren = service.getChildren(rootChildren.get(0).getId(), "name", "asc");
        assertEquals(2, dirOneChildren.size());
        assertEquals("1.txt", dirOneChildren.get(0).getName());
        assertEquals("file", dirOneChildren.get(0).getType());
        assertEquals("2.txt", dirOneChildren.get(1).getName());
        assertEquals("file", dirOneChildren.get(1).getType());

        List<Resource> dirTwoChildren = service.getChildren(rootChildren.get(1).getId(), "name", "asc");
        assertEquals(1, dirTwoChildren.size());
        assertEquals("abc.txt", dirTwoChildren.get(0).getName());
        assertEquals("file", dirTwoChildren.get(0).getType());
    }

    @Test
    void downloadFileWorks() throws IOException {
        String rootId = service.getRootResource().getId();
        String twoId = service.getChildren(rootId, "name", "asc").get(1).getId();
        String abcId = service.getChildren(twoId, "name", "asc").get(0).getId();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        service.download(new String[]{abcId}, out);

        assertEquals(out.toString(), "abc");
    }

    @Test
    void downloadDirectoryReturnsZip() throws IOException {
        String rootId = service.getRootResource().getId();
        String oneId = service.getChildren(rootId, "name", "asc").get(0).getId();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        service.download(new String[]{oneId}, out);

        ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(out.toByteArray()));
        ZipEntry zEntry = null;
        List<String> entries = new ArrayList<>();
        while ((zEntry = zis.getNextEntry()) != null) {
            entries.add(zEntry.getName());
        }
        zis.close();

        assertTrue(entries.containsAll(Arrays.asList("1.txt", "2.txt", "/")));
    }

    @Test
    void downloadMultipleFilesReturnsZip() throws IOException {
        String rootId = service.getRootResource().getId();
        String oneId = service.getChildren(rootId, "name", "asc").get(0).getId();
        List<Resource> files = service.getChildren(oneId, "name", "asc");

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        service.download(new String[]{files.get(0).getId(), files.get(1).getId()}, out);

        ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(out.toByteArray()));
        ZipEntry zEntry = null;
        List<String> entries = new ArrayList<>();
        while ((zEntry = zis.getNextEntry()) != null) {
            entries.add(zEntry.getName());
        }
        zis.close();

        log.debug(entries.toString());

        assertEquals(2, entries.size());
        assertTrue(entries.containsAll(Arrays.asList("1.txt", "2.txt")));
    }

    @Test
    void renameFileWorks() throws IOException {
        String rootId = service.getRootResource().getId();
        String oneId = service.getChildren(rootId, "name", "asc").get(0).getId();
        List<Resource> files = service.getChildren(oneId, "name", "asc");

        Resource firstFile = files.get(0);
        assertEquals("1.txt", firstFile.getName()); // sanity check

        service.renameResource(firstFile.getId(), "boo.png");

        files = service.getChildren(oneId, "name", "asc");
        assertTrue(files.stream().map(Resource::getName).collect(Collectors.toList()).containsAll(Arrays.asList("2.txt", "boo.png")));
    }

    @Test
    void renameDirWorks() throws IOException {
        String rootId = service.getRootResource().getId();
        List<Resource> dirs = service.getChildren(rootId, "name", "asc");
        assertTrue(dirs.stream().map(Resource::getName).collect(Collectors.toList()).containsAll(Arrays.asList("one", "two")));
        String oneId = dirs.get(0).getId();
        assertEquals("one", dirs.get(0).getName()); // sanity check


        List<String> fileNamesInOneDir = service.getChildren(oneId, "name", "asc")
            .stream().map(Resource::getName).collect(Collectors.toList());

        service.renameResource(oneId, "renamedOne");

        dirs = service.getChildren(rootId, "name", "asc");
        log.debug(dirs.toString());
        assertTrue(dirs.stream().map(Resource::getName).collect(Collectors.toList()).containsAll(Arrays.asList("renamedOne", "two")));

        // assert that same files exist in renamed directory (e.g. renaming doesn't remove files inside directory)
        List<String> fileNamesInOneDirAfterRenaming = service.getChildren(dirs.get(0).getId(), "name", "asc")
            .stream().map(Resource::getName).collect(Collectors.toList());
        assertEquals(fileNamesInOneDirAfterRenaming.size(), fileNamesInOneDir.size());
        assertTrue(fileNamesInOneDirAfterRenaming.containsAll(fileNamesInOneDir));
    }
}
