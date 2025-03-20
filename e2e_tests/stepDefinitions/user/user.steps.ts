import { When } from "@badeball/cypress-cucumber-preprocessor"
import { UserType } from "../../support/commands"
import { loginAndSearchCrn } from "./user"

When('{userType} logs( back) in to update/view Recommendation', function (userType: UserType) {
  loginAndSearchCrn.call(this, userType)
  cy.clickLink('Update recommendation')
})

When('{userType} logs( back) in to view All Recommendations', function (userType: UserType) {
  loginAndSearchCrn.call(this, userType)
  cy.clickLink('Recommendations')
})

When('PO creates a new Recommendation for same CRN', function () {
  cy.clickLink(`Return to overview for ${this.offenderName}`)
  cy.clickLink('Make a recommendation', { parent: '#main-content' })
  cy.clickButton('Continue')
})

When('{userType}( has) logged/logs( back) in to/and download(ed) Part A', function (userType: UserType) {
  loginAndSearchCrn.call(this, userType)
  cy.clickLink('Update recommendation')
  cy.clickLink('Create Part A')
  cy.downloadDocX('Download the Part A').as('partAContent')
})

When('{userType}( has) logged/logs (back )in to Countersign', function (userType: UserType) {
  expect(userType, 'Checking only SPO/ACO user is passed!!').to.not.equal(UserType.PO)
  loginAndSearchCrn.call(this, userType)
  cy.clickLink('Countersign')
  if (userType === UserType.SPO) cy.clickLink('Line manager countersignature')
})

When('{userType} logs( back) in to add rationale', function (userType: UserType) {
  loginAndSearchCrn.call(this, userType)
  cy.clickLink('Consider a recall', { parent: '#main-content' })
})