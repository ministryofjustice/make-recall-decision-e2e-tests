import { openApp } from "..";
import { UserType } from "../../support/commands";

export function loginAndSearchCrn(userType: UserType) {
    signOut()
    cy.wait(1000)
    cy.reload(true)
    cy.pageHeading().should('equal', 'Sign in')
    openApp(
        {
            flagRecommendationsPage: 1,
            flagDeleteRecommendation: 1
        },
        userType
    )
    cy.compareSnapshot('Login and search CRN - 1')
    cy.clickLink('Start now')
    cy.compareSnapshot('Login and search CRN - 2')
    cy.clickLink('Search by case reference number (CRN)')
    cy.fillInputByName('crn', this.crn)
    cy.compareSnapshot('Login and search CRN - 3')
    cy.clickButton('Search')
    cy.compareSnapshot('Login and search CRN - 4')
    cy.clickLink(this.offenderName)
}

export const loginAndSearchForCrn = (userType: UserType, crn: string) => {
    signOut()
    cy.wait(1000)
    cy.reload(true)
    cy.pageHeading().should('equal', 'Sign in')
    openApp({}, userType)
    cy.clickLink('Start now') // TODO: this should check for the button role
    if(userType !== UserType.PPCS) {
        cy.compareSnapshot('Login and search CRN - 2')
        cy.clickLink('Search by case reference number (CRN)')
    }
    cy.fillInputByName('crn', crn)
    cy.compareSnapshot('Login and search CRN - 3')
    cy.clickButton('Search')
    // TODO Check details?
    cy.compareSnapshot('Login and search CRN - 4')
}

export const signOut = function () {
    cy.get('body').then($body => {
        const signOutSelector = '[data-qa="signOut"]'
        if ($body.find(signOutSelector).length > 0) cy.get(signOutSelector).click()
    })
    cy.clearAllCookies()
}
