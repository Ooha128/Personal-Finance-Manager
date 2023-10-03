package com.adobe.prj.api;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.adobe.prj.entity.Bills;
import com.adobe.prj.service.BillService;
import com.adobe.prj.service.ScheduledTasksService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

import com.adobe.prj.constants.Constants;
import com.adobe.prj.dto.BillAndId;
import com.adobe.prj.dto.Email;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:3000/")
@Validated
public class BillsController {
	
	@Autowired
	private BillService billService;



    @GetMapping("/{id}")
    public ResponseEntity<Object> getBillById(@PathVariable @Min(1) Long id) {
		Map<String, Object> body=new LinkedHashMap<>();
		Bills bill= billService.getBillById(id);
		body.put(Constants.STATUS,HttpStatus.OK);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Fetched Bill Successfully");
		body.put("bill",bill);
		return new ResponseEntity<Object>(body,HttpStatus.OK);
        
    }
    
    @PostMapping("/userBills")
	public ResponseEntity<Object> getBills(@Valid @RequestBody Email email)
	{
		Map<String, Object> body=new LinkedHashMap<>();
		List<Bills> bills=billService.getBillsByEmail(email.getEmail());
		body.put(Constants.STATUS,HttpStatus.OK);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Fetched All Bills successfully");
		body.put("bills",bills);
		return new ResponseEntity<Object>(body,HttpStatus.OK);

	}
    
    @PostMapping("/addBill")
	public ResponseEntity<Object> addBill(@Valid @RequestBody Bills bill)
	{
		Map<String, Object> body=new LinkedHashMap<>();
		billService.addBill(bill);
		body.put(Constants.STATUS,HttpStatus.CREATED);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Created Bill Successfully");
		body.put("bill",bill);
		return new ResponseEntity<Object>(body,HttpStatus.OK);
	}

    @PutMapping("/updateBill")
	public ResponseEntity<Object> updateBudget(@Valid @RequestBody BillAndId bill) {
		Map<String, Object> body=new LinkedHashMap<>();
		billService.updateBill(bill.getId(), bill.getBill());
		body.put(Constants.STATUS,HttpStatus.OK);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Updated the bill Successfully");
		return new ResponseEntity<Object>(body,HttpStatus.OK);
        
    }

    
    @DeleteMapping("/deleteBill/{id}")
    public ResponseEntity<Object> deleteBill(@PathVariable @Min(1) Long id) {
		Map<String, Object> body=new LinkedHashMap<>();
		billService.deleteBill(id);
		body.put(Constants.STATUS,HttpStatus.OK);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Deleted bill Successfully");
		return new ResponseEntity<Object>(body,HttpStatus.OK);
        
    }
    
    @RestController
    @RequestMapping("/api/scheduled")
    public class ScheduledTasksController {
        @Autowired
        private ScheduledTasksService scheduledTasksService;
        
        //trigger scheduled task to check if overdue bill is paid 
        @PostMapping("/update-overdue-bills-due-date")
        public ResponseEntity<String> triggerUpdateOverdueBillsDueDate() {
            scheduledTasksService.updateOverdueBillsDueDate();
            return ResponseEntity.ok("Scheduled task triggered successfully.");
        }
    }
}