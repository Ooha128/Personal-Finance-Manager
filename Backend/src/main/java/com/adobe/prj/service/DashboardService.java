package com.adobe.prj.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adobe.prj.dao.BillsDao;
import com.adobe.prj.dao.BudgetDao;
import com.adobe.prj.dao.TransactionDao;
import com.adobe.prj.dao.UserDao;
import com.adobe.prj.dto.RevenueAndExpense;
import com.adobe.prj.entity.Bills;
import com.adobe.prj.entity.Budget;
import com.adobe.prj.entity.Transaction;

@Service
public class DashboardService {
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private BudgetDao budgetDao;
	
	@Autowired
	private BillsDao billsDao;
	
	@Autowired
	private TransactionDao transactionDao;
	
	public double getBalance(String email)
	{
		return userDao.findFirstByEmail(email).getBankBalance();
	}
	
	public double getSpentAmount(String email) {
		double spent=0.0;
		List<Budget> budgets = budgetDao.findByEmail(email);
		for(Budget b: budgets) {
			spent+= b.getSpentThisMonth();
		}
		return spent;
	}
	
	public double getBillsToPay(String email) {
		double bill=0.0;
		List<Bills> bills = billsDao.findByEmail(email);
		for(Bills b:bills) {
			if(b.isPaid()==false) {
				bill+=b.getAmount();
			}
		}
		return bill;
	}
	
	public RevenueAndExpense getRevenueAndExpense(String email) {
		RevenueAndExpense re = new RevenueAndExpense();
		double revenue=0;
		double expense=0;
		List<Transaction> transactions = transactionDao.findByEmail(email);
		for(Transaction t: transactions) {
			if(t.getType().equals("Revenue")) {
				revenue+=t.getAmount();
			}
			else {
				expense+=t.getAmount();
			}
		}
		re.setRevenue(revenue);
		re.setExpense(expense);
		return re;
		
	}
}
