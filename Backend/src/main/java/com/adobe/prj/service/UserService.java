package com.adobe.prj.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.adobe.prj.dao.UserDao;
import com.adobe.prj.entity.User;

@Service
public class UserService {
	
	@Autowired
	private UserDao userDao;
	
	public List<User> getUsers()
	{
		return userDao.findAll();
	}
	
	public User addUser(User u)
	{
		return userDao.save(u); 
	}
	
	public User getUserById(int id) 
	{
		return userDao.findById(id).get();
	}
	
	public User getUserByEmail(String email)
	{
		return userDao.findFirstByEmail(email);
	}
	
	public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) {
                return (UserDetails) userDao.findByEmail(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            }
        };
    }

}
 