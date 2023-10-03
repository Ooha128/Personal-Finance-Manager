package com.adobe.prj.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class GettingStartedDetails {
	private String email;
	private String bankName;
	private double bankBalance;
}
