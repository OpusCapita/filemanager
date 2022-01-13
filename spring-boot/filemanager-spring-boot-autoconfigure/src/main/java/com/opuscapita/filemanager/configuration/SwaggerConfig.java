//package com.opuscapita.filemanager.configuration;
//
//import com.fasterxml.classmate.TypeResolver;
//import com.opuscapita.filemanager.dto.ResourcePostDtoJson;
//import com.opuscapita.filemanager.dto.ResourcePostDtoMultipart;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import springfox.documentation.builders.PathSelectors;
//import springfox.documentation.builders.RequestHandlerSelectors;
//import springfox.documentation.oas.annotations.EnableOpenApi;
//import springfox.documentation.service.ApiInfo;
//import springfox.documentation.service.Contact;
//import springfox.documentation.spi.DocumentationType;
//import springfox.documentation.spring.web.plugins.Docket;
//
//import java.time.ZonedDateTime;
//import java.util.Collections;
//
//@Configuration
//@EnableOpenApi
//public class SwaggerConfig {
//
//    @Bean
//    public Docket api() {
//        TypeResolver typeResolver = new TypeResolver();
//
//        return new Docket(DocumentationType.OAS_30)
//                .apiInfo(apiInfo())
//                .select()
//                .apis(RequestHandlerSelectors.basePackage("com.opuscapita.filemanager.rest"))
//                .paths(PathSelectors.regex("/filemanager/api.*"))
//                .build()
//                .additionalModels(typeResolver.resolve(ResourcePostDtoJson.class), typeResolver.resolve(ResourcePostDtoMultipart.class))
//                .directModelSubstitute(ZonedDateTime.class, String.class);
//    }
//
//    private ApiInfo apiInfo() {
//        return new ApiInfo(
//                "File manager API",
//                "File manager API",
//                "1.0",
//                null,
//                new Contact("Dmitriy Aksutik", null, "aksutik@scand.com"),
//                null,
//                null,
//                Collections.emptyList());
//    }
//}
