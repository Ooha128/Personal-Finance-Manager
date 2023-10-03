describe("Testing Add New Bill Workflow", () => {

    it("Creating new bill", () => {
        cy.visit("http://localhost:3000/newBill");
        cy.get("input[id='billName']")
            .type("New Bill 1")
        cy.get("input[id='billAmt']")
            .clear()
            .type("30000")
        cy.get('div[role="spinbutton"] > span').contains("dd").first().type("03",{force:true})
        cy.get('div[role="spinbutton"] > span').contains("mm").first().type("08",{force:true})
        cy.get('div[role="spinbutton"] > span').contains("yyyy").first().type("2023",{force:true})
        cy.get("button[id='addBillButton']")
            .click()                
    })
});