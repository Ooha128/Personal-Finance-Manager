package com.adobe.prj.api;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.adobe.prj.dto.Email;
import com.adobe.prj.entity.Bills;
import com.adobe.prj.service.BillService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;

@SpringBootTest
@AutoConfigureMockMvc
public class BillsControllerTest {
	
	@MockBean
	private BillService service;
	
	@Autowired
	private MockMvc mockMvc;
	
	@Test
	@WithMockUser(username = "ooha@gmail.com")
	public void getBillssTest() throws Exception {
		List<Bills> bills = Arrays.asList(new Bills( 1L, "Bill1",null,null, 500.00,false, "ooha@gmail.com", 1),
				new Bills(2L, "Bill2" ,null,null, 400.00, true,"ooha@gmail.com",2)); // Mock Data
		
		Email email = new Email("ooha@gmail.com");

		    // Convert the emailAndMonth object to JSON
		ObjectMapper objectMapper = new ObjectMapper();
		String requestBody = objectMapper.writeValueAsString(email);
		// mocking
		when(service.getBillsByEmail("ooha@gmail.com")).thenReturn(bills); 
		
		mockMvc.perform(post("/api/bills/userBills")
			.contentType(MediaType.APPLICATION_JSON)
			.content(requestBody))
			.andExpect(status().isOk()) // 200
			.andExpect(jsonPath("$.budgets", hasSize(2)))
			.andExpect(jsonPath("$.budgets[0].name", is("Bill1")))
			.andExpect(jsonPath("$.budgets[0].amount", is(500.00)))
			.andExpect(jsonPath("$.budgets[1].name", is("Bill2")));
		
		verify(service, times(1)).getBillsByEmail("ooha@gmail.com");
	}
	
	@Test
	@WithMockUser(username = "ooha@gmail.com")
	public void addBillTest() throws Exception {
		Bills p = Bills.builder().name("test").amount(1500.00).repeats(1).email("ooha@gmail.com").build();
		ObjectMapper mapper = new ObjectMapper(); // JAva  <--> JSON
		String json = mapper.writeValueAsString(p); 

		when(service.addBill(Mockito.any(Bills.class)))
			.thenReturn(p); // mocking
		
		mockMvc.perform(post("/api/budgets/addBudget")
		 .content(json)
		 .contentType(MediaType.APPLICATION_JSON))
		.andExpect(jsonPath("$.bill.name", is("test") ))
		.andExpect(status().isOk());//200
		
		verify(service, times(1)).addBill(p);
	}
	

}
