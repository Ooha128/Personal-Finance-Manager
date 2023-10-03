package com.adobe.prj.dto;

import com.adobe.prj.entity.Transaction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionAndId {
	Long id;
	Transaction transaction;

}
