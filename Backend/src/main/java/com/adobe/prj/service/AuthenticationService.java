package com.adobe.prj.service;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.adobe.prj.dao.UserDao;
import com.adobe.prj.dto.JwtAuthenticationResponse;
import com.adobe.prj.dto.SignUpRequest;
import com.adobe.prj.dto.SigninRequest;
import com.adobe.prj.entity.User;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
	private final UserDao userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    public JwtAuthenticationResponse signup(SignUpRequest request) {
        var user = User.builder().email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).name(request.getName()).bankName(null).bankBalance(0.0).build();
        userRepository.save(user);
        var jwt = jwtService.generateToken(user);
        return JwtAuthenticationResponse.builder().token(jwt).user(user).hasAccount(false).build();
    }

    public JwtAuthenticationResponse signin(SigninRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        var jwt = jwtService.generateToken(user);
        return JwtAuthenticationResponse.builder().token(jwt).user(user).hasAccount(user.getBankName()!=null?true:false).build();
    }
    
    @Transactional
	public ResponseEntity<Object> updatePassword(String email,String newPassword)
	{
		Map<String, Object> body=new LinkedHashMap<>();
		User user = userRepository.findFirstByEmail(email);
		if(user==null)
		{
			body.put("status",HttpStatus.FORBIDDEN);
			body.put("timestamp",new Date());
			body.put("message","Invalid Email Address");
			return new ResponseEntity<Object>(body,HttpStatus.FORBIDDEN);
		}
		else {
			user.setPassword(passwordEncoder.encode(newPassword));
			body.put("status",HttpStatus.OK);
			body.put("timestamp",new Date());
			body.put("message","");
			body.put("user",user);
			return new ResponseEntity<Object>(body,HttpStatus.OK);
		}
	}

}
