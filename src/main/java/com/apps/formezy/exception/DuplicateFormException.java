package com.apps.formezy.exception;

public class DuplicateFormException extends RuntimeException {

	private static final long serialVersionUID = 1L;
	private final Exception error;
	
	public DuplicateFormException(Exception error) {
		this.error = error;
	}

	public Exception getError() {
		return error;
	}
}
