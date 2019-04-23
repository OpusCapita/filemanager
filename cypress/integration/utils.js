const url = 'http://localhost:3000/?currentComponentName=FileManager&maxContainerWidth=100%25&showSidebar=false'

export const visit = () => cy.visit(url)

export const ROOT = '#filemanager-cusomization-area'

export const FILE_MANAGER = '[data-test-id="filemanager"]'

export const FILE_NAVIGATOR = '[data-test-id="filemanager"]'

export const TOOLBAR = '[data-test-id="toolbar"]'

export const getToolbarItem = (id) => `button[data-test-id="toolbar-item--${id}`

export const callToolbarItem = (id) => cy.get(`button[data-test-id="toolbar-item--${id}`).click()

export const MODAL_DIALOG = '[data-test-id="modal-dialog"]'
export const CONFIRMATION_DIALOG = '[data-test-id="confirm-dialog"]'
