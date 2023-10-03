package com.adobe.prj.service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adobe.prj.dao.UserDao;
import com.adobe.prj.entity.Transaction;
import com.adobe.prj.entity.User;

@Service
public class ReportsService {
	private final String[] monthNames=new String[]{"January","February","March","April","May","June","July","August","September","October","November","December"};
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private TransactionService transactionService;
	
	public Map<String,Map<String,Double>> getIncomeAndExpenses(String email)
	{
		User user=userDao.findFirstByEmail(email);
		if(user==null)return null;
		Map<String,Map<String,Double>> barChartData=new LinkedHashMap<>();
		String inputString = user.getBalance_updated_date();
		DateFormat dateFormat = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy");
		Date inputDate = null;
		try {
			inputDate = dateFormat.parse(inputString);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		for(int i=0;i<monthNames.length;i++)
		{
			if(i<=new Date().getMonth())
			{
				List<Transaction> revenueTransactions=transactionService.getTransactionsByEmailAndTypeAndMonthAndYear(email,"Revenue",i,new Date().getYear());
				List<Transaction> expenseTransactions=transactionService.getTransactionsByEmailAndTypeAndMonthAndYear(email,"Expense",i,new Date().getYear());
				List<Transaction> transferTransactions=transactionService.getTransactionsByEmailAndTypeAndMonthAndYear(email,"Transfer",i,new Date().getYear());
		
				Map<String,Double> incomeAndExpensesMap=new LinkedHashMap<>();
				Double income=(double) 0;
				Double expense=(double) 0;
				
				for(int j=0;j<revenueTransactions.size();j++)income+=revenueTransactions.get(j).getAmount();
				for(int j=0;j<expenseTransactions.size();j++)expense+=expenseTransactions.get(j).getAmount();
				for(int j=0;j<transferTransactions.size();j++)expense+=transferTransactions.get(j).getAmount();

				incomeAndExpensesMap.put("income",income);
				incomeAndExpensesMap.put("expense",expense);
				barChartData.put(monthNames[i],incomeAndExpensesMap);
		
			}
		}
		
		return barChartData;
		
	}
	
	public Map<String,Double> getNetWorth(String email)
	{
		Map<String,Map<String,Double>> data=getIncomeAndExpenses(email);
		User user=userDao.findFirstByEmail(email);
		if(user==null)return null;
		else {
			Double initial_balance=user.getInitial_balance();
			String inputString = user.getBalance_updated_date();
			DateFormat dateFormat = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy");
			Date inputDate = null;
			try {
				inputDate = dateFormat.parse(inputString);
			} catch (ParseException e) {
				e.printStackTrace();
			}
			Map<String,Double> lineChartData=new LinkedHashMap<>();
			Double prev_balance=initial_balance;
			for(int i=0;i<monthNames.length;i++)
			{
				if(i<=new Date().getMonth())
				{
					if(i<inputDate.getMonth())
					{
						lineChartData.put(monthNames[i],(double) 0);
					}
					else {
						Map<String,Double> incomeAndExpenses=data.get(monthNames[i]);
						Double current_balance=prev_balance+(incomeAndExpenses.get("income")-incomeAndExpenses.get("expense"));
						lineChartData.put(monthNames[i],current_balance);
						prev_balance=current_balance;
					}
				}
			}
			return lineChartData;
		}
	}
}