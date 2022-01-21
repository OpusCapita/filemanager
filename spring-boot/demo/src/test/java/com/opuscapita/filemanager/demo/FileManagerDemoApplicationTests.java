package com.opuscapita.filemanager.demo;

import com.opuscapita.filemanager.rest.FileManagerController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = FileManagerDemoApplication.class)
@AutoConfigureMockMvc(printOnlyOnFailure = false)
class FileManagerDemoApplicationTests {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ApplicationContext applicationContext;

    @Test
    void autoConfigurationWorks() {
        applicationContext.getBean(FileManagerController.class);
    }

    @Test
    void rootDirectoryListingWorks() throws Exception {
        mockMvc.perform(get("/myfilemanager/files"))
            .andExpect(status().isOk());
    }
}
