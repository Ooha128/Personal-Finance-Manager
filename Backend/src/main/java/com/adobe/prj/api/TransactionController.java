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
import com.adobe.prj.dto.Email;
import com.adobe.prj.dto.EmailAndType;
import com.adobe.prj.dto.EmailTypeAndMonth;
import com.adobe.prj.dto.TransactionAndId;
import com.adobe.prj.entity.Transaction;
import com.adobe.prj.service.TransactionService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;


@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000/")
@Validated
public class TransactionController {
	@Autowired
	private TransactionService transactionService;
	
	@PostMapping("/addTransaction")
	public ResponseEntity<Object> addTransaction(@Valid @RequestBody Transaction transaction)
	{
		Map<String, Object> body=new LinkedHashMap<>();
		transactionService.addTransaction(transaction);
		body.put(Constants.STATUS,HttpStatus.CREATED);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Added new transaction successfully");
		return new ResponseEntity<Object>(body,HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
    public ResponseEntity<Object> getBudgetById(@PathVariable @Min(1) Long id) {
		Map<String, Object> body=new LinkedHashMap<>();
		Transaction transaction= transactionService.getTransactionById(id);
		body.put(Constants.STATUS,HttpStatus.OK);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Fetched Budget Successfully");
		body.put("transaction",transaction);
		return new ResponseEntity<Object>(body,HttpStatus.OK);
        
    }
	
	@PostMapping("/userTransactions")
	public ResponseEntity<Object> getTransactions(@Valid @RequestBody Email email)
	{
		Map<String, Object> body=new LinkedHashMap<>();
		List<Transaction> transactions=transactionService.getTransactionsByEmail(email.getEmail());
		body.put(Constants.STATUS,HttpStatus.OK);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Fetched User transactions successfully");
		body.put("transactions",transactions);
		return new ResponseEntity<Object>(body,HttpStatus.OK);
	}
	
	
	@PostMapping("/userTransactionsByType")
	public ResponseEntity<Object> getTransactionsByType(@Valid @RequestBody EmailAndType emailAndType)
	{
		Map<String, Object> body=new LinkedHashMap<>();
		List<Transaction> transactions=transactionService.getTransactionsByEmailAndType(emailAndType.getEmail(),emailAndType.getType());
		body.put(Constants.STATUS,HttpStatus.OK);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Fetched user transactions based on type successfully");
		body.put("transactions",transactions);
		return new ResponseEntity<Object>(body,HttpStatus.OK);

	}
	
	@PostMapping("/userTransactionsByMonthAndType")
	public ResponseEntity<Object> getTransactionsByMonthAndType(@Valid @RequestBody EmailTypeAndMonth emailTypeAndMonth)
	{
		Map<String, Object> body=new LinkedHashMap<>();
		List<Transaction> transactions=transactionService.getTransactionsByEmailTypeAndMonth(emailTypeAndMonth.getEmail(),emailTypeAndMonth.getType(),emailTypeAndMonth.getMonth());
		body.put(Constants.STATUS,HttpStatus.OK);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Fetched user Transactions based on month and type successfully");
		body.put("transactions",transactions);
		return new ResponseEntity<Object>(body,HttpStatus.OK);
	}
	
	@DeleteMapping("/deleteTransaction/{id}")
    public ResponseEntity<Object> deleteBudget(@PathVariable @Min(1) Long id) {
		Map<String, Object> body=new LinkedHashMap<>();
		transactionService.deleteTransaction(id);
		body.put(Constants.STATUS,HttpStatus.OK);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Deleted transaction Successfully");
		return new ResponseEntity<Object>(body,HttpStatus.OK);
        
    }
	
	@PutMapping("/updateTransaction")
	public ResponseEntity<Object> updateBudget(@Valid @RequestBody TransactionAndId transaction) {
		Map<String, Object> body=new LinkedHashMap<>();
		transactionService.updateTransaction(transaction.getId(), transaction.getTransaction());
		body.put(Constants.STATUS,HttpStatus.OK);
		body.put(Constants.TIMESTAMP,new Date());
		body.put(Constants.MESSAGE,"Updated the transaction Successfully");
		return new ResponseEntity<Object>(body,HttpStatus.OK);
        
    }
}
