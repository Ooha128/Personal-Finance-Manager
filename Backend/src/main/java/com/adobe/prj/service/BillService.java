package com.adobe.prj.service;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.adobe.prj.entity.Bills;

import jakarta.transaction.Transactional;

import com.adobe.prj.dao.BillsDao;

@Service
public class BillService {
	
	@Autowired
	private BillsDao billDao;
    private boolean billIsPaid;
    
    public void updateOverdueBillsDuedate() {
    	
        List<Bills> overdueBills = billDao.findByDueDateBefore(LocalDate.now());

        for (Bills bill : overdueBills) {
            if (bill.isPaid()) {                                
            	// Reset the due date based on repeats
            	billIsPaid=bill.isPaid();
                LocalDate newDueDate;
                Integer repeats = bill.getRepeats();
                if (repeats == 1) {
                    newDueDate = bill.getDueDate().plusMonths(1);
                } else if (repeats == 2) {
                    newDueDate = bill.getDueDate().plusMonths(6);
                } else {
                    newDueDate = bill.getDueDate().plusMonths(12);
                }
                bill.setDueDate(newDueDate);
                
                //set bill paid to false 
                billIsPaid=false;
                bill.setPaid(billIsPaid);
            }
        }
    }
    
    @Transactional
    public Bills addBill(Bills bill)
	{
    	LocalDate newDueDate;
        Bills newBill = billDao.save(bill);
        Integer repeats = bill.getRepeats();
        LocalDate billDate = bill.getBillDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        if (repeats == 1) {
            newDueDate = billDate.plusMonths(1);
        } else if (repeats == 2) {
            newDueDate = billDate.plusMonths(6);
        } else {
            newDueDate = billDate.plusMonths(12);
        }
        
        newBill.setDueDate(newDueDate);
        newBill.setPaid(false);
        return newBill;
	}

    public Bills getBillById(Long id) {
        return billDao.findById(id).get();
    }

    public List<Bills> getBillsByEmail(String email) {
		
		return billDao.findByEmail(email);
	}
    
    public void deleteBill(Long id) {
        billDao.deleteById(id);
    }
    
    @Transactional
	public void updateBill(Long id,Bills bill) {
		Optional<Bills> bud=billDao.findById(id);
		if(bud.isPresent()) {
			Bills b=bud.get();
			b.setName(bill.getName());
			b.setDueDate(bill.getDueDate());
			b.setAmount(bill.getAmount());
			b.setRepeats(bill.getRepeats());
			LocalDate newDueDate;
	        Integer repeats = bill.getRepeats();
	        LocalDate billDate = bill.getBillDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

	        if (repeats == 1) {
	            newDueDate = billDate.plusMonths(1);
	        } else if (repeats == 2) {
	            newDueDate = billDate.plusMonths(6);
	        } else {
	            newDueDate = billDate.plusMonths(12);
	        }
	        
	        b.setDueDate(newDueDate);
		}		
	}
}











