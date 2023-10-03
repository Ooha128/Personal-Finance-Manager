package com.adobe.prj.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adobe.prj.dao.TransactionDao;
import com.adobe.prj.dao.UserDao;
import com.adobe.prj.entity.Bills;
import com.adobe.prj.entity.Budget;
import com.adobe.prj.entity.Transaction;
import com.adobe.prj.entity.User;

import jakarta.transaction.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.text.DateFormat;
@Service
public class TransactionService {

  
    private final TransactionDao transactionDao;
    private final BillService billService; 
    private final BudgetsService budgetService;
    private final UserService userService;
    
    // Constructor injection
    @Autowired
    public TransactionService(TransactionDao transactionDao,BillService billService,BudgetsService budgetService,UserService userService) {
        this.transactionDao=transactionDao;
        this.billService = billService;
		this.budgetService = budgetService;
		this.userService=userService;
    }


    public List<Transaction> getTransactionsByEmailAndMonth(String email, int year, int month) {
        return transactionDao.findByEmailAndMonth(email, year, month);
    }
    
    @Autowired UserDao userDao;
	
	public List<Transaction> getTransactionsByEmail(String email)
	{
		return transactionDao.findByEmail(email);
	}
	
	public List<Transaction> getTransactionsByEmailAndType(String email,String type)
	{
		return transactionDao.findByEmailAndType(email, type);
	}
	
	public List<Transaction> getTransactionsByEmailTypeAndMonth(String email,String type, String month)
	{
		return transactionDao.findByEmailTypeAndMonth(email, type, month);
	}
	
	@SuppressWarnings("deprecation")
	public List<Transaction> getTransactionsByEmailAndTypeAndMonthAndYear(String email,String type,int month,int year)
	{
		return transactionDao.findByEmailAndType(email, type).stream().filter((transaction)->{
			String inputString = transaction.getDate().toString();
			DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			Date inputDate = null;
			try {
				inputDate = dateFormat.parse(inputString);
			} catch (ParseException e) {
				e.printStackTrace();
			}
			return inputDate.getMonth()==month && inputDate.getYear()==year;}
		).toList();
	}
	
	@Transactional
	public void updateTransaction(Long id,Transaction transaction) {
		Optional<Transaction> bud=transactionDao.findById(id);
		if(bud.isPresent()) {
			Transaction b=bud.get();
			b.setTitle(transaction.getTitle());
			b.setAmount(transaction.getAmount());
			b.setBudget(transaction.getBudget());
			b.setBills(transaction.getBills());
			b.setType(transaction.getType());
			b.setSourceAccount(transaction.getSourceAccount());
			b.setDate(transaction.getDate());
			b.setDestAccount(transaction.getDestAccount());
			b.setMonth(transaction.getMonth());
		}		
	}
	
	@Transactional
	public void deleteTransaction(Long id) {
		Transaction transaction = transactionDao.findById(id).get();
		User user = userService.getUserByEmail(transaction.getEmail());
        if (user != null) {
            Double balance = user.getBankBalance();   
            balance+=transaction.getAmount();
            user.setBankBalance(balance);
            }         
        transactionDao.deleteById(id);
    }
	
	public Transaction getTransactionById(Long id) {
		return transactionDao.findById(id).get();
	}
	
    @Transactional //ensures ACID properties of DBMS
    public Transaction addTransaction(Transaction transaction) {
    	
     

        // Save the transaction
        Transaction newTransaction = transactionDao.save(transaction);

        // Update user's balance based on the transaction
        User user = userService.getUserByEmail(transaction.getEmail());
        if (user != null) {
            Double balance = user.getBankBalance();                     
            //if money is credited
            if(transaction.getType().equals("Revenue")) {        
            	balance+=transaction.getAmount();
            }
            else  {            
            	balance-=transaction.getAmount();  	
            
            }
            
         // Update user's balance in the database
            user.setBankBalance(balance);          
        }
            
            
          // Change the status of bill to paid if transaction is a bill
          if(transaction.getBills()!=0) {
             Bills bill = billService.getBillById(transaction.getBills());
            	
             if (bill != null) {
            	 bill.setPaid(true);
                 billService.updateBill(transaction.getBills(),bill); 
             } else {
           	  System.out.println("Couldnt find a bill with the same name as  " + transaction.getBills());
             }
            	
          }
            
            
          // Update budget variables according to transaction
            
          if(transaction.getBudget()!=0) {
        	  //Fetch the budget 
        	  Budget budget = budgetService.getBudgetById(transaction.getBudget());
              if (budget != null) {
            		
            	  double spentThisMonth = budget.getSpentThisMonth() + transaction.getAmount();
            	  double leftForMonth = budget.getAllottedAmount() - spentThisMonth;
                    
                  budget.setSpentThisMonth(spentThisMonth);
                  budget.setLeftForMonth(leftForMonth);
                    
                  budgetService.updateBudget(transaction.getBudget(), budget); // Update the budget in the database
              }
              else {
            	  System.out.println("Couldnt find a budget with the same name as  " + transaction.getBudget());
              }
            	
           }
                       
           return newTransaction;
    }


	public List<Transaction> getAllTransactions() {
		
		return transactionDao.findAll();
	}


	public List<Transaction> getTransactionsForBudget(Budget budget) {
	    List<Transaction> transactionsForBudget = new ArrayList<>();
	    
	    // Iterate through all transactions to filter those matching the budget
	    for (Transaction transaction : getAllTransactions()) {
	        if (transaction.getBudget().equals(budget.getCategory())) {
	            transactionsForBudget.add(transaction);
	        }
	    }
	    
	    return transactionsForBudget;
	}










    // Other methods...
}
