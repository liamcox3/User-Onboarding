describe("Testing our form inputs", function () {
    beforeEach(function () {
        cy.visit("http://localhost:3000/");
    });
    it("Adds text to inputs and submits form", function () {
        cy.get('input[name="name"]').type("Liam").should("have.value", "Liam");
        cy.get('input[name="email"]')
            .type("ja@gmail.com")
            .should("have.value", "ja@gmail.com");
        cy.get('input[name="password"]')
            .type("kghjhgjf")
            .should("have.value", "kghjhgjf");
        cy.get('[type="checkbox"]').check();
        cy.get("button").click();
    });
});
