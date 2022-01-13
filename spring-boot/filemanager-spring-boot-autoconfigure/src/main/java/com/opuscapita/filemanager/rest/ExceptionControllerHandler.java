package com.opuscapita.filemanager.rest;

import com.opuscapita.filemanager.error.ApiErrorResponse;
import com.opuscapita.filemanager.error.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.util.UrlPathHelper;

import javax.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class ExceptionControllerHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, HttpServletRequest request) {
        ApiErrorResponse response = new ApiErrorResponse(HttpStatus.NOT_FOUND.value(),
                HttpStatus.NOT_FOUND.getReasonPhrase(), "Resource not found with ID " + ex.getId(),
                new UrlPathHelper().getPathWithinApplication(request));

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
}
