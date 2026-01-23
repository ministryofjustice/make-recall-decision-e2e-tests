/// <reference path = "../../cypress_shared/index.d.ts" />
import '../../cypress_shared/commands'
import { addCompareSnapshotCommand } from 'cypress-visual-regression/dist/command'

addCompareSnapshotCommand({
    capture: 'fullPage',
    errorThreshold: 0.05,
})

Cypress.Commands.overwrite('compareSnapshot', (originalFn, ...args) => {
  return cy
    .document()
    .then((doc) => {
      return new Cypress.Promise((resolve) => {
        setTimeout(() => {
          // Prevent task list from overflow issues
          doc.body.querySelectorAll("p[data-qa='spo-exposition']").forEach((element) => {
            const updatedElement = element
            updatedElement.innerHTML = 'XXXXX'
          })

          resolve()
        }, 300)
      })
    })
    .then(() => originalFn(...args))
})

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
})

export enum UserType {
  PO = 'PO',
  SPO = 'SPO',
  ACO = 'ACO',
  PPCS = 'PPCS'
}

const userNamePo = Cypress.env('USERNAME_PO')
const passwordPo = Cypress.env('PASSWORD_PO')

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
  cy.get('#username').type(isSpoUser ? userNameSpo : userNamePo, { log: false })
  cy.get('#password').type(isSpoUser ? passwordSpo : passwordPo, { log: false })
  cy.get('#submit').click()
  getUserDetails(isSpoUser ? UserType.SPO : UserType.PO)
})

const resolveUserDetails: (userType: UserType) => { username: string, password: string } = (userType) => {
  switch (userType) {
    case UserType.ACO:
      return { username: userNameAco, password: passwordAco }
    case UserType.SPO:
      return { username: userNameSpo, password: passwordSpo }
    case UserType.PPCS:
      return { username: userNamePpcs, password: passwordPpcs }
    case UserType.PO:
    default:
      return { username: userNamePo, password: passwordPo }
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
