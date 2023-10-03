package com.adobe.prj.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import com.adobe.prj.entity.Budget;

@Repository
public interface BudgetDao extends JpaRepository<Budget, Long> {

	@Query(value = "select * from budgets where month = :month", nativeQuery = true)
    List<Budget> findByMonth(@Param("month") String month);

    // Custom query method to find a budget by category
    Budget findByCategory(String name);

    // Custom query method to find a budget by category and month
    Budget findByCategoryAndMonth(String category, String month);
    
    List<Budget> findByEmailAndMonth(String email, String month);
    
    List<Budget> findByEmail(String email);
    
    Optional<Budget> findById(Long id);
}
