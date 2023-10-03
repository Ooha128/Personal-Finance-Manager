package com.adobe.prj.service;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.adobe.prj.dao.UserDao;
import com.adobe.prj.entity.User;

import jakarta.transaction.Transactional;

@Service
public class UserLoginService {
	@Autowired
	private UserDao userDao;
	
	public User getUser(String email)
	{
		return userDao.findFirstByEmail(email);
	}
	
	public User addUser(User user)
	{
		return userDao.save(user);
	}
	
	public List<User> getUsers()
	{
		return userDao.findAll();
	}
	
	public User validateCredentials(String email,String password)
	{
		return userDao.findFirstByEmailAndPassword(email, password);
		
	}
	
	@Transactional
	public ResponseEntity<Object> updatePassword(String email,String newPassword)
	{
		Map<String, Object> body=new LinkedHashMap<>();
		User user = userDao.findFirstByEmail(email);
		if(user==null)
		{
			body.put("status",HttpStatus.FORBIDDEN);
			body.put("timestamp",new Date());
			body.put("message","Invalid Email Address");
			return new ResponseEntity<Object>(body,HttpStatus.FORBIDDEN);
		}
		else {
			user.setPassword(newPassword);
			body.put("status",HttpStatus.OK);
			body.put("timestamp",new Date());
			body.put("message","");
			return new ResponseEntity<Object>(body,HttpStatus.OK);
		}
	}
}
