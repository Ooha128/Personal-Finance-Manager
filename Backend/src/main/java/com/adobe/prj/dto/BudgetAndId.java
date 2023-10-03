package com.adobe.prj.dto;

import com.adobe.prj.entity.Budget;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class BudgetAndId {
	Long id;
	Budget budget;
}
