package com.adobe.prj.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adobe.prj.dto.JwtAuthenticationResponse;
import com.adobe.prj.dto.SignUpRequest;
import com.adobe.prj.dto.SigninRequest;
import com.adobe.prj.dto.UserForgotPassword;
import com.adobe.prj.service.AuthenticationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000/")
@Validated
public class AuthenticationController {
	@Autowired
	private AuthenticationService authenticationService;
	
	
	@PutMapping("/resetPassword")
	public ResponseEntity<Object> updatePassword(@RequestBody UserForgotPassword user)
	{
		return authenticationService.updatePassword(user.getEmail(), user.getNewPassword());
	}
	
	@PostMapping("/signup")
	public ResponseEntity<JwtAuthenticationResponse> signup(@Valid @RequestBody SignUpRequest request) {
		return ResponseEntity.ok(authenticationService.signup(request));
	}

	@PostMapping("/signin")
	public ResponseEntity<JwtAuthenticationResponse> signin(@Valid @RequestBody SigninRequest request) {
		return ResponseEntity.ok(authenticationService.signin(request));
	}
}