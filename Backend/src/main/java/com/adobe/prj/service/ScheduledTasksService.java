
package com.adobe.prj.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.adobe.prj.entity.Budget;
@Service
public class ScheduledTasksService {
    @Autowired
    private BillService billService;
    
    @Autowired
    private BudgetsService budgetService;
    
    @Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
    public void updateOverdueBillsDueDate() {
        billService.updateOverdueBillsDuedate();
    }
    
    @Scheduled(cron = "0 0 1 1 * ?") // Runs on the first day of every month at 1:00 AM
    public void createRolloverBudgetsForAllBudgets() {
        List<Budget> allBudgets = budgetService.getAllBudgets(null);
        for (Budget existingBudget : allBudgets) {
            budgetService.createRolloverBudgetIfLeftover(existingBudget);
        }
    }
    
	
}

