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
    cy.clickLink('Start now')
    cy.clickLink('Search by case reference number (CRN)')
    cy.fillInputByName('crn', this.crn)
    cy.clickButton('Search')
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
        cy.clickLink('Search by case reference number (CRN)')
    }
    cy.fillInputByName('crn', crn)
    cy.clickButton('Search')
    // TODO Check details?
}

export const signOut = function () {
    cy.get('body').then($body => {
        const signOutSelector = '[data-qa="signOut"]'
        if ($body.find(signOutSelector).length > 0) cy.get(signOutSelector).click()
    })
    cy.clearAllCookies()
}
