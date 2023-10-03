package com.adobe.prj.exceptions;

public class DuplicateBillNameException extends RuntimeException {
    public DuplicateBillNameException(String message) {
        super(message);
    }
}
