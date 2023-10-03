package com.adobe.prj.api;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.adobe.prj.constants.Constants;
import com.adobe.prj.service.EntityNotFoundException;

// this will be used when exceptions are thrown from controller
@ControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(EntityNotFoundException.class)
	public ResponseEntity<Object> handleEntityNotFoundException(EntityNotFoundException ex) {
		Map<String, Object> body = new LinkedHashMap<>();
		body.put(Constants.MESSAGE, ex.getMessage());
		body.put(Constants.STATUS, HttpStatus.NOT_FOUND);
		body.put(Constants.TIMESTAMP, new Date());
		return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Object> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
		Map<String, Object> body = new LinkedHashMap<>();
		
		List<String> errors = ex.getBindingResult().getFieldErrors()
					.stream().map(exception  -> exception.getDefaultMessage()).collect(Collectors.toList());
		
		body.put("errors", errors);
		body.put(Constants.STATUS, HttpStatus.BAD_REQUEST);
		body.put(Constants.TIMESTAMP, new Date());
		return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);	
	}
}