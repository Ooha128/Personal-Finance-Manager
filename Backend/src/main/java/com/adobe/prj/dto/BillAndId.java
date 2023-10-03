package com.adobe.prj.dto;

import com.adobe.prj.entity.Bills;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class BillAndId {
	Long id;
	Bills bill;
}
