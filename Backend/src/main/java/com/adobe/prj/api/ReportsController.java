package com.adobe.prj.api;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adobe.prj.dto.Email;
import com.adobe.prj.service.ReportsService;

@RestController
@RequestMapping("api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportsController {
	@Autowired
	private ReportsService reportsService;
	
	@PostMapping("/getIncomeAndExpenses")
	public ResponseEntity<Object> getIncomeAndExpenses(@RequestBody Email email)
	{
		Map<String, Object> body=new LinkedHashMap<>();	
		try {
			Map<String,Map<String,Double>> barChartData=reportsService.getIncomeAndExpenses(email.getEmail());
			if(barChartData==null)throw new Exception();
			
			else {
				body.put("status",HttpStatus.OK);
				body.put("timestamp",new Date());
				body.put("message","");
				body.put("barChartData",barChartData);
			}
			return new ResponseEntity<Object>(body,HttpStatus.OK);
		} catch (Exception e) {
			System.out.println(e.getMessage());
			body.put("status",HttpStatus.OK);
			body.put("timestamp",new Date());
			body.put("message","Error: Could not get income and expense details");	
			return new ResponseEntity<Object>(body,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		
	}
	
	@PostMapping("/getNetWorth")
	public ResponseEntity<Object> getNetWorth(@RequestBody Email email)
	{
		Map<String, Object> body=new LinkedHashMap<>();	
		try {
			Map<String,Double> lineChartData=reportsService.getNetWorth(email.getEmail());
			if(lineChartData==null)throw new Exception();
			else {
				body.put("status",HttpStatus.OK);
				body.put("timestamp",new Date());
				body.put("message","");
				body.put("lineChartData",lineChartData);
			}
			return new ResponseEntity<Object>(body,HttpStatus.OK);
		} catch (Exception e) {
			System.out.println(e.getMessage());
			body.put("status",HttpStatus.OK);
			body.put("timestamp",new Date());
			body.put("message","Error: Could not get income and expense details");	
			return new ResponseEntity<Object>(body,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		
	}
	
	
	
}