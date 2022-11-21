package com.apps.formezy.exception;

public class NotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;
	private final Exception error;
	
	public NotFoundException(Exception error) {
		this.error = error;
	}

	public Exception getError() {
		return error;
	}
}
