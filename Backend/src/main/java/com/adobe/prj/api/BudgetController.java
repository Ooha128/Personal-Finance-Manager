package com.adobe.prj.api;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adobe.prj.constants.Constants;
import com.adobe.prj.dto.BudgetAndId;
import com.adobe.prj.dto.EmailAndMonth;
import com.adobe.prj.entity.Budget;
import com.adobe.prj.entity.Transaction;
import com.adobe.prj.service.BudgetsService;
import com.adobe.prj.service.ScheduledTasksService;
import com.adobe.prj.service.TransactionService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("api/budgets")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class BudgetController {
	
	@Autowired
	private BudgetsService budgetsService;
	private TransactionService transactionService;
	
	@GetMapping("/{id}")
    public ResponseEntity<Object> getBudgetById(@PathVariable @Min(1) Long id) {
		Map<String, Object> body=new LinkedHashMap<>();
		Budget budget= budgetsService.getBudgetById(id);
		body.put(Constants.STATUS,HttpStatus.OK);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Fetched Budget Successfully");
		body.put("budget",budget);
		return new ResponseEntity<Object>(body,HttpStatus.OK);
        
    }
	
	@PostMapping("/userBudgets")
	public ResponseEntity<Object> getBudgets(@Valid @RequestBody EmailAndMonth emailAndMonth)
	{
		Map<String, Object> body=new LinkedHashMap<>();
		List<Budget> budgets;
		if(emailAndMonth.getMonth()==null)
		{
			 budgets=budgetsService.getBudgetsByEmail(emailAndMonth.getEmail());
		}
		else {
			
			budgets=budgetsService.getBudgetsByEmailAndMonth(emailAndMonth.getEmail(),emailAndMonth.getMonth());
		}
		body.put(Constants.STATUS,HttpStatus.OK);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Fetched All Budgets successfully");
		body.put("budgets",budgets);
		return new ResponseEntity<Object>(body,HttpStatus.OK);

	}
	
	@PostMapping("/addBudget")
	public ResponseEntity<Object> addBudget(@Valid @RequestBody Budget budget)
	{
		Map<String, Object> body=new LinkedHashMap<>();
		budgetsService.addBudget(budget);
		body.put(Constants.STATUS,HttpStatus.OK);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Created Budget Successfully");
		return new ResponseEntity<Object>(body,HttpStatus.OK);
	}
	
	@PutMapping("/updateBudget")
	public ResponseEntity<Object> updateBudget(@Valid @RequestBody BudgetAndId budget) {
		Map<String, Object> body=new LinkedHashMap<>();
		budgetsService.updateBudget(budget.getId(), budget.getBudget());
		body.put(Constants.STATUS,HttpStatus.OK);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Updated the budget Successfully");
		return new ResponseEntity<Object>(body,HttpStatus.OK);
        
    }
	
	@DeleteMapping("/deleteBudget/{id}")
    public ResponseEntity<Object> deleteBudget(@PathVariable @Min(1) Long id) {
		Map<String, Object> body=new LinkedHashMap<>();
		budgetsService.deleteBudget(id);
		body.put(Constants.STATUS,HttpStatus.OK);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Deleted Budget Successfully");
		return new ResponseEntity<Object>(body,HttpStatus.OK);
        
    }
	
	@RequestMapping("/tasks")
    public class ScheduledTasksController {
    	
    	//Triggers rollover budget api 

        @Autowired
        private ScheduledTasksService scheduledTasksService;

        @PostMapping("/createRolloverBudgets")
        public ResponseEntity<String> triggerCreateRolloverBudgets() {
            scheduledTasksService.createRolloverBudgetsForAllBudgets();
            return ResponseEntity.ok("Rollover budgets creation triggered.");
        }

        // Other controller methods...
    }
    
    @GetMapping("/{budgetId}/transactions")
    public ResponseEntity<List<Transaction>> getTransactionsForBudget(@PathVariable long budgetId) {
    	
    	//Retrieves all transactions for a particular budget
        Budget budget = budgetsService.getBudgetById(budgetId);
        if (budget != null) {
			List<Transaction> transactions = transactionService.getTransactionsForBudget(budget);
            return ResponseEntity.ok(transactions);
        } else {
            return ResponseEntity.notFound().build();
          }
    }
}
