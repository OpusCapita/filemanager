/// <reference types="Cypress" />

context('Toolbar', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/?currentComponentName=FileManager&maxContainerWidth=100%25&showSidebar=true')

    cy.get('#filemanager-cusomization-area').as('filemanager')
    cy.get('@filemanager').get('[data-test-id="filenavigator"]').as('filenavigator')

    cy.get('@filenavigator').get('[data-test-id="toolbar"]').as('toolbar')

    cy.get('@toolbar').get('button[data-test-id="toolbar-item--createFolder"]').as('toolbar-item--createFolder')
    cy.get('@toolbar').get('button[data-test-id="toolbar-item--upload"]').as('toolbar-item--upload')
    cy.get('@toolbar').get('button[data-test-id="toolbar-item--rename"]').as('toolbar-item--rename')
    cy.get('@toolbar').get('button[data-test-id="toolbar-item--download"]').as('toolbar-item--download')
    cy.get('@toolbar').get('button[data-test-id="toolbar-item--delete"]').as('toolbar-item--delete')
  })

  it('should have not disabled "create folder" button', () => {
    cy.get('@toolbar-item--createFolder').should('not.be.disabled')
  })

  it('should have not disabled "upload" button', () => {
    cy.get('@toolbar-item--createFolder').should('not.be.disabled')
  })

  it('should have disabled "rename" button', () => {
    cy.get('@toolbar-item--rename').should('be.disabled')
  })

  it('should have disabled "rename" button', () => {
    cy.get('@toolbar-item--download').should('be.disabled')
  })

  it('should have disabled "delete" button', () => {
    cy.get('@toolbar-item--delete').should('be.disabled')
  })
})
