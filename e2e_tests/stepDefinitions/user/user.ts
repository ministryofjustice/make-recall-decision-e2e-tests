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

    // Confirm the fallback header isn't displaying outside of a local environment
    if (!Cypress.env('INTEGRATION_TEST') || Cypress.env('ENV')?.toString() !== "local") {
        cy.get('.probation-common-fallback-header').should('not.exist')
    }

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
        // Handle the fallback header
        if ($body.find('.probation-common-fallback-header__link').length > 0) {
            cy.get(signOutSelector).click()
        } else if($body.find('.probation-common-header').length > 0) {
            cy.get('.probation-common-header__user-menu-toggle')
              .click()
              .get('a[href="/sign-out"]').click()
        }
    })
    cy.clearAllCookies()
}
