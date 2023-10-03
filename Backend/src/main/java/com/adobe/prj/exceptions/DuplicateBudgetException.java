package com.adobe.prj.exceptions;

import org.springframework.http.HttpStatus;

public class DuplicateBudgetException extends RuntimeException {
    private final HttpStatus status;
    private final String message;

    public DuplicateBudgetException(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
