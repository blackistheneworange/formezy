package com.apps.formezy.exception;

public class CustomException extends RuntimeException {

	private static final long serialVersionUID = 1L;
	private final Exception error;
	
	public CustomException(Exception error) {
		this.error = error;
	}

	public Exception getError() {
		return error;
	}
}
