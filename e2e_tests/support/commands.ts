/// <reference path = "../../cypress_shared/index.d.ts" />
import '../../cypress_shared/commands'

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
})

export enum UserType {
  PO = 'PO',
  SPO = 'SPO',
  ACO = 'ACO',
  PPCS = 'PPCS'
}

const userName = Cypress.env('USERNAME')
const password = Cypress.env('PASSWORD')

const userNameSpo = Cypress.env('USERNAME_SPO')
const passwordSpo = Cypress.env('PASSWORD_SPO')

const userNameAco = Cypress.env('USERNAME_ACO')
const passwordAco = Cypress.env('PASSWORD_ACO')

const userNamePpcs = Cypress.env('USERNAME_PPCS')
const passwordPpcs = Cypress.env('PASSWORD_PPCS')

const getUserDetails = function (userType: UserType) {
  let userDetails = {}
  cy.visit('/account-details')
  cy.getText('name').then(text => {
    userDetails['name'] = text
  })
  cy.getText('username').then(text => {
    userDetails['username'] = text
  })
  cy.getText('email').then(text => {
    userDetails['email'] = text
  })
  cy.go('back')
  cy.on("uncaught:exception", (e, runnable) => {
    console.log("uncaught:exception error", e)
    console.log("runnable", runnable)
    console.log("error", e.message)
    return false
  });
  return cy.wrap(userDetails).as(UserType[userType])
}

Cypress.Commands.add('visitPage', (url, isSpoUser = false) => {
  cy.clearCookies()
  cy.visit(url)
  cy.pageHeading().should('equal', 'Sign in')
  cy.get('#username').type(isSpoUser ? userNameSpo : userName, { log: false })
  cy.get('#password').type(isSpoUser ? passwordSpo : password, { log: false })
  cy.get('#submit').click()
  getUserDetails(isSpoUser ? UserType.SPO : UserType.PO)
})

const resolveUserDetails: (userType: UserType) => { username: string, password: string } = (userType) => {
  switch (userType) {
    case UserType.ACO:
      return { username: Cypress.env('USERNAME_ACO'), password: Cypress.env('PASSWORD_ACO') }
    case UserType.SPO:
      return { username: Cypress.env('USERNAME_SPO'), password: Cypress.env('PASSWORD_SPO') }
    case UserType.PPCS:
      return { username: Cypress.env('USERNAME_PPCS'), password: Cypress.env('PASSWORD_PPCS') }
    case UserType.PO:
    default:
      return { username: Cypress.env('USERNAME'), password: Cypress.env('PASSWORD') }
  }
}

Cypress.Commands.add('visitPageAndLogin', function (url, userType = UserType.PO) {
  cy.clearCookies()
  cy.visit(url)
  cy.pageHeading().should('equal', 'Sign in')
  const userDetails = resolveUserDetails(userType)
  cy.get('#username').type(userDetails.username)
  cy.get('#password').type(userDetails.password, { log: false })
  cy.get('#submit').click()
  getUserDetails(userType)
})
