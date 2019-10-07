describe('Time validation', () => {
	it('should pass time validation', () => {
		cy.visit('http://localhost:8080')
		cy.get('.task-list__button_add').click();

		cy.get('.task-list__field-text')
			.should('have.attr', 'disabled');

		cy.get('.task-list__field-time')
			.type('2359');

		cy.wait(2000);

		cy.get('.task-list__field-text')
			.should('not.have.attr', 'disabled');
	})
})