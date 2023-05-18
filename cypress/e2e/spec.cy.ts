describe('Under construction', () => {
  it('Displays the under construction message', () => {
    cy.visit('/');
    cy.get('[data-test-id="v0-marker"]').contains('This app is under construction...');
  });
});
