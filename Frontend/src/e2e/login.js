describe("Login as an existing user", () => {

    it("Login as a user", () => {
        cy.visit("http://localhost:3000");
        cy.get("input[type='text']")
            .type("abc@gmail.com")
        cy.get("input[type='password']")
            .type("admin123")
        cy.get("button > span").contains("Login").click()    
    })
});