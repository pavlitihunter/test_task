describe('Add task', () => {
	it('should add task', () => {
		cy.visit('http://localhost:8080')
		cy.get('.task-list__button_add').click();
		cy.get('.task-list__field-time')
			.type('2359');

		cy.wait(2000);

		cy.get('.task-list__field-text')
			.type('New task');

		cy.get('.task-list__events-item')
			.should('have.length', 0);

		cy.get('.task-list__button_save')
			.click();

		cy.get('.task-list__events-item')
    	.should(($item) => {
    		expect($item).to.have.length(1)
    		expect($item).to.contain('23:59')
    		expect($item).to.contain('New task')
    	});
	})
})
