describe("Testing Add New Budget Workflow", () => {

    it("Creating new budget", () => {
        cy.visit("http://localhost:3000/newBudget");
        cy.get("input[id='budgetName']")
            .type("New Budget 1")
        cy.get("input[id='budgetAmt']")
            .type("30000")
        cy.get("input[id='spentAmt']")
            .clear()
            .type("10000")
        // cy.get('button[id="autoBudget"]').click()
        // cy.get('item').first().click({force:true})
        cy.get("button[id='addBudgetButton']")
            .click()
                
    })
});