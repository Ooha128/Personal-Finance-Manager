package com.adobe.prj.entity;


import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    private String title;

    private Long budget;
    
    private Long bills;
    
    private String type;
    
    @Column
    private Double amount;
    
    private String sourceAccount;

    private String destAccount;

    @JsonFormat(pattern="dd-MM-yyyy")
	@Temporal(TemporalType.TIMESTAMP)
    private Date date;
    
    private String month;
    
    
    
}
