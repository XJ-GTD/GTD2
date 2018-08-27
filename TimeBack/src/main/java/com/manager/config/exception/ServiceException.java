package com.manager.config.exception;

import java.io.Serializable;

public class ServiceException extends RuntimeException implements Serializable {

    private static final long serialVersionUID = -6407329278732909643L;

    public ServiceException() {

    }

    public ServiceException(String message) {
        super(message);
    }

    public ServiceException(String message, Throwable cause) {
        super(message, cause);
    }

}
