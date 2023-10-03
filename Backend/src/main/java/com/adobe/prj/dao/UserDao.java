package com.adobe.prj.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.adobe.prj.entity.User;

public interface UserDao extends JpaRepository<User, Integer> {
	User findFirstByEmail(String email);
	Optional<User> findByEmail(String email);
	User findFirstByEmailAndPassword(String email,String password);
	
}
