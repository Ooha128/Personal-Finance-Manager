describe("Register as a new user", () => {

    it("Register workflow", () => {
        cy.visit("http://localhost:3000");
        cy.get("a").contains("Register").click()
        cy.get("input[id='nameField']")
            .type("Sakshi Ramsinghani")
        cy.get("input[id='emailField']")
            .type("abc@gmail.com")
        cy.get("input[id='passwordField']")
            .type("admin123")
        cy.get("input[id='reEnterPasswordField']")
            .type("admin123")
        cy.get("button[id='signUpButton']")
            .click()            
    })
});