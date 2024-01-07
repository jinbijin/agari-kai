describe('Schedule generator', () => {
  it('Generates a default schedule', () => {
    cy.visit('/');
    cy.get('form').find('button[type="submit"]').click();
    cy.get('table').should('exist');
  });
});
