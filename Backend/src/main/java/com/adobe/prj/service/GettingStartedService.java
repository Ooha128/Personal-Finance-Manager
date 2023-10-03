package com.adobe.prj.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adobe.prj.dao.UserDao;
import com.adobe.prj.entity.User;

import jakarta.transaction.Transactional;

@Service
public class GettingStartedService {
	@Autowired
	private UserDao userDao;
	
	@Transactional
	public void updateDetails(String email,String bankName,Double balance)
	{
		User user=userDao.findFirstByEmail(email);
		user.setBankName(bankName);
		user.setBankBalance(balance);
		user.setInitial_balance(balance);
		user.setBalance_updated_date(new Date().toString());
	}
}
