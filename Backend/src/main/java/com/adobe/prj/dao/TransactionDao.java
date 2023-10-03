package com.adobe.prj.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.adobe.prj.entity.Transaction;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface TransactionDao extends JpaRepository<Transaction, Long> {
	
	//Find all transactions for a particular user
    List<Transaction> findByEmail(String email);

    //Find all transactions for the given user, year and month
    @Query("SELECT t FROM Transaction t WHERE t.email = ?1 AND YEAR(t.date) = ?2 AND MONTH(t.date) = ?3")
    List<Transaction> findByEmailAndMonth(String email, int year, int month);
    
	List<Transaction> findByEmailAndType(String email,String type);
	
	@Query("SELECT t FROM Transaction t WHERE t.email = ?1 AND t.type = ?2 AND t.month = ?3")
	List<Transaction> findByEmailTypeAndMonth(String email, String type, String month);
	
	Optional<Transaction> findById(Long id);
}
