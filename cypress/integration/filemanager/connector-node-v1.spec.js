/// <reference types="Cypress" />

let {
  visit,
  ROOT,
  FILE_MANAGER,
  FILE_NAVIGATOR,
  TOOLBAR,
  getToolbarItem,
  callToolbarItem
} = require('../utils')

context('Connector Node V1', () => {
  before(() => {
    visit()
  })

  context('Create folder capability', () => {
    it('should allow to create a new folder', () => {
      cy.get(getToolbarItem('createFolder')).should('not.be.disabled')
      callToolbarItem('createFolder')
    })
  })

  context('Upload capability', () => {
    it('should allow to upload a single file', () => {
      cy.get(getToolbarItem('upload')).should('not.be.disabled')
    })
  })

  context('Rename capability', () => {
    it('should allow to rename a file or folder', () => {
      cy.get(getToolbarItem('rename')).should('be.disabled')
    })
  })

  context('Download capability', () => {
    it('should allow to download a single file', () => {
      cy.get(getToolbarItem('download')).should('be.disabled')
    })
  })

  context('Delete capability', () => {
    it('should allow to delete a single file', () => {
      cy.get(getToolbarItem('delete')).should('be.disabled')
    })
  })
})
