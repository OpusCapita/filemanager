package com.opuscapita.filemanager.error;

import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;

@Getter
@Setter
public class ApiErrorResponse {

    private ZonedDateTime time;

    private int statusCode;

    private String error;
    private String message;
    private String apiPath;

    public ApiErrorResponse(final int statusCode,
                            final String error,
                            final String message,
                            final String apiPath) {
        this.time = ZonedDateTime.now();
        this.statusCode = statusCode;
        this.error = error;
        this.message = message;
        this.apiPath = apiPath;
    }
}
