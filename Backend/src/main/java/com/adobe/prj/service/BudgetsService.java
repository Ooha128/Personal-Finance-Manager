package com.adobe.prj.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adobe.prj.dao.BudgetDao;
import com.adobe.prj.entity.Budget;

import jakarta.transaction.Transactional;

@Service
public class BudgetsService {
	@Autowired
	private BudgetDao budgetsDao;
	

    public Budget createBudget(Budget budget) {
       
        return budgetsDao.save(budget);
    }
    
    public void deleteBudget(Long id) {
        budgetsDao.deleteById(id);
    }
    
	public List<Budget> getBudgetsByEmail(String email) {
		
		return budgetsDao.findByEmail(email);
	}
	
	 public Budget getBudgetById(Long i) {
	        return budgetsDao.findById(i).get();
	    }

	@Transactional
	public void updateBudget(Long id,Budget budget) {
		Optional<Budget> bud=budgetsDao.findById(id);
		if(bud.isPresent()) {
			Budget b=bud.get();
			b.setCategory(budget.getCategory());
			b.setAllottedAmount(budget.getAllottedAmount());
			b.setSpentThisMonth(budget.getSpentThisMonth());
		}		
	}
	
	
	public List<Budget> getBudgetsByEmailAndMonth(String email,String month)
	{
		return budgetsDao.findByEmailAndMonth(email,month);
	}
	
	public Budget addBudget(Budget budget)
	{
		return budgetsDao.save(budget);
	}
	
	public double getLeftToSpend(String email,String month)
	{
		List<Budget> budgets=getBudgetsByEmailAndMonth(email, month);
		double leftToSpend=0;
		for(int i=0;i<budgets.size();i++)leftToSpend+=(budgets.get(i).getAllottedAmount()-budgets.get(i).getSpentThisMonth());
		return leftToSpend;
	}
	

		public List<Budget> getAllBudgets(String email) {
			// TODO Auto-generated method stub
			return budgetsDao.findByEmail(email);
		}
	
	public Budget createRolloverBudgetIfLeftover(Budget budget) {
		
		//find budget in the database
        Budget existingBudget = budgetsDao.findByCategoryAndMonth(budget.getCategory(), budget.getMonth());
        if (existingBudget != null) {
            double leftoverAmount = existingBudget.getLeftForMonth();
            if (leftoverAmount > 0) {
                // Create a new budget with the same properties as the original budget
                Budget rolloverBudget = new Budget();
                rolloverBudget.setCategory(existingBudget.getCategory());
                rolloverBudget.setAllottedAmount(existingBudget.getAllottedAmount()+leftoverAmount);
                rolloverBudget.setLeftForMonth(rolloverBudget.getAllottedAmount());
                rolloverBudget.setSpentThisMonth(0.0);
               
             // Increment the month for the rollover budget
                String existingMonth = existingBudget.getMonth();
                String newMonth = incrementMonth(existingMonth);
                rolloverBudget.setMonth(newMonth);

                
                // Additional logic for rollover budgets
                
                return budgetsDao.save(rolloverBudget);
            }
        }
        return null; // No leftover money or no existing budget, so no rollover budget created
    }
	
	private String incrementMonth(String month) {
	    String[] months = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};
	    int index = -1;
	    for (int i = 0; i < months.length; i++) {
	        if (months[i].equalsIgnoreCase(month)) {
	            index = i;
	            break;
	        }
	    }
	    if (index != -1) {
	        index = (index + 1) % months.length;
	        return months[index];
	    }
	    return month; // Return the original month if not found in the list
	}
	
}