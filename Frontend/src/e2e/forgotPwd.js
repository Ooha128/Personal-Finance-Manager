describe("Testing Forgot Password Workflow", () => {

    it("Forgot password", () => {
        cy.visit("http://localhost:3000");
        cy.get("a").contains("Forgot Password").click()
        cy.get("input[id='email']")
            .type("abc@gmail.com")
        cy.get("input[id='new_pwd']")
            .type("Admin1234")
        cy.get("input[id='passwordField']")
            .type("admin123")
        cy.get("input[id='reEnterPasswordField']")
            .type("admin123")
        cy.get("button[id='signUpButton']")
            .click()             
    })
});