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

import com.adobe.prj.dto.EmailAndMonth;
import com.adobe.prj.entity.Budget;
import com.adobe.prj.service.BudgetsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;

@SpringBootTest
@AutoConfigureMockMvc
public class BudgetControllerTest {
	
	@MockBean
	private BudgetsService service;
	
	@Autowired
	private MockMvc mockMvc;
	
	@Test
	@WithMockUser(username = "ooha@gmail.com")
	public void getBudgetsTest() throws Exception {
		List<Budget> budgets = Arrays.asList(new Budget( 1L, "Budget1", 500.00, 400.00, 100.00, "ooha@gmail.com", "August"),
				new Budget(2L, "Budget2", 1500.00, 1100.00, 400.00, "ooha@gmail.com", "August")); // Mock Data
		
		EmailAndMonth emailAndMonth = new EmailAndMonth("ooha@gmail.com", "August");

		    // Convert the emailAndMonth object to JSON
		ObjectMapper objectMapper = new ObjectMapper();
		String requestBody = objectMapper.writeValueAsString(emailAndMonth);
		// mocking
		when(service.getBudgetsByEmailAndMonth("ooha@gmail.com","August")).thenReturn(budgets); 
		
		mockMvc.perform(post("/api/budgets/userBudgets")
			.contentType(MediaType.APPLICATION_JSON)
			.content(requestBody))
			.andExpect(status().isOk()) // 200
			.andExpect(jsonPath("$.budgets", hasSize(2)))
			.andExpect(jsonPath("$.budgets[0].category", is("Budget1")))
			.andExpect(jsonPath("$.budgets[0].allottedAmount", is(500.00)))
			.andExpect(jsonPath("$.budgets[1].category", is("Budget2")));
		
		verify(service, times(1)).getBudgetsByEmailAndMonth("ooha@gmail.com","August");
	}
	
	@Test
	@WithMockUser(username = "ooha@gmail.com")
	public void addBudgetTest() throws Exception {
		Budget p = Budget.builder().category("test").allottedAmount(1500.00).spentThisMonth(100.00).leftForMonth(1400.00).build();
		ObjectMapper mapper = new ObjectMapper(); // JAva  <--> JSON
		String json = mapper.writeValueAsString(p); 

		when(service.addBudget(Mockito.any(Budget.class)))
			.thenReturn(p); // mocking
		
		mockMvc.perform(post("/api/budgets/addBudget")
		 .content(json)
		 .contentType(MediaType.APPLICATION_JSON))
		.andExpect(jsonPath("$.budget.category", is("test") ))
		.andExpect(status().isOk());//200
		
		verify(service, times(1)).addBudget(p);
	}
	

}
