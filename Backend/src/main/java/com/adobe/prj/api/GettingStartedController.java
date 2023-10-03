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
import com.adobe.prj.dto.GettingStartedDetails;
import com.adobe.prj.service.GettingStartedService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/gettingStarted")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class GettingStartedController {
	@Autowired
	private GettingStartedService gettingStartedService;
	
	@PostMapping("/updateDetails")
	public ResponseEntity<Object> updateDetails(@Valid @RequestBody GettingStartedDetails gettingStartedDetails)
	{
		Map<String, Object> body=new LinkedHashMap<>();	
		try {
			gettingStartedService.updateDetails(gettingStartedDetails.getEmail(),gettingStartedDetails.getBankName(), gettingStartedDetails.getBankBalance());	
			body.put(Constants.STATUS,HttpStatus.OK);
			body.put(Constants.TIMESTAMP,new Date());
			body.put(Constants.MESSAGE,"Updated Bank Details Successfully");
			return new ResponseEntity<Object>(body,HttpStatus.OK);
		} catch (Exception e) {
			body.put(Constants.STATUS,HttpStatus.INTERNAL_SERVER_ERROR);
			body.put(Constants.TIMESTAMP,new Date());
			body.put(Constants.MESSAGE,"Error: Could not update details");	
			return new ResponseEntity<Object>(body,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		
	}
}

