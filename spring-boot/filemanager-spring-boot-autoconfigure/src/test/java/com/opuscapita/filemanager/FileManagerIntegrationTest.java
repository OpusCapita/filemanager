package com.opuscapita.filemanager;

import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(
    classes = FileManagerIntegrationTest.TestConfig.class,
    properties = {
        "filemanager.web.basePath = /filemanager",
        "filemanager.filesystem.rootPath = ./test-files",
        "filemanager.filesystem.rootName = Root directory"
    })
@AutoConfigureMockMvc(printOnlyOnFailure = false)
public class FileManagerIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    // it should be the same as filemanager.web.basePath in configuration properties
    private static final String basePath = "/filemanager";

    @Test
    void getRequestsWorkAsExpected() throws Exception {
        MvcResult res1 = mockMvc.perform(get(basePath + "/files"))
            .andExpect(status().isOk())
            .andReturn();
        String json1 = res1.getResponse().getContentAsString();
        String id1 = (String) new JSONObject(json1).get("id");

        MvcResult res2 = mockMvc.perform(get(basePath + "/files/" + id1 + "/children"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.items", hasSize(2)))
            .andExpect(jsonPath("$.items[0].type", is("dir")))
            .andExpect(jsonPath("$.items[0].name", is("123")))
            .andExpect(jsonPath("$.items[1].type", is("dir")))
            .andExpect(jsonPath("$.items[1].name", is("1231")))
            .andReturn();

        String json2 = res2.getResponse().getContentAsString();
        String id2 = (String) new JSONObject(json2).getJSONArray("items").getJSONObject(0).get("id");

        mockMvc.perform(get(basePath + "/files/" + id2 + "/children"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.items", hasSize(2)))
            .andExpect(jsonPath("$.items[0].type", is("file")))
            .andExpect(jsonPath("$.items[0].name", is("1.txt")))
            .andExpect(jsonPath("$.items[1].type", is("file")))
            .andExpect(jsonPath("$.items[1].name", is("2.txt")));
    }

    @SpringBootConfiguration
    @EnableAutoConfiguration
    @EnableWebMvc
    public static class TestConfig {
    }
}
