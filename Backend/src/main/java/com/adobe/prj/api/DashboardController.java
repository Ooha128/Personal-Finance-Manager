package com.adobe.prj.api;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adobe.prj.constants.Constants;
import com.adobe.prj.dto.Email;
import com.adobe.prj.dto.RevenueAndExpense;
import com.adobe.prj.service.DashboardService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class DashboardController {
	@Autowired
	private DashboardService dashboardService;
	
	@PostMapping("/getDashboardDetails")
	public ResponseEntity<Object> getUserBalance(@Valid @RequestBody Email email)
	{
		Map<String, Object> body=new LinkedHashMap<>();	
		try {
			double balance=dashboardService.getBalance(email.getEmail());
			double spent=dashboardService.getSpentAmount(email.getEmail());
			double billsToPay=dashboardService.getBillsToPay(email.getEmail());
			RevenueAndExpense re = dashboardService.getRevenueAndExpense(email.getEmail());
			body.put(Constants.STATUS,HttpStatus.OK);
			body.put(Constants.TIMESTAMP,new Date());
			body.put(Constants.MESSAGE,"Fetched Dashboard details successfully");
			body.put("bankBalance",balance);
			body.put("spent",spent);
			body.put("billsToPay",billsToPay);
			body.put("revenue",re.getRevenue());
			body.put("expense",re.getExpense());
			return new ResponseEntity<Object>(body,HttpStatus.OK);
		} catch (Exception e) {
			body.put(Constants.STATUS,HttpStatus.INTERNAL_SERVER_ERROR);
			body.put(Constants.TIMESTAMP,new Date());
			body.put(Constants.MESSAGE,"Error: Could not update details");	
			return new ResponseEntity<Object>(body,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
}
