package com.adobe.prj.dao;

import java.time.LocalDate;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adobe.prj.entity.Bills;


@Repository
public interface BillsDao extends JpaRepository<Bills, Long> {
    // Additional methods can be added here based on business needs

    // Method to find bills with due date before a specified date
    List<Bills> findByDueDateBefore(LocalDate now);

    // Method to find a bill by its id
    Optional<Bills> findById(Long id);
    
    
    List<Bills> findByEmail(String email);
    
}