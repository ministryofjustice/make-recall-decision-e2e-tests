import { Given, Then, DataTable, When } from '@badeball/cypress-cucumber-preprocessor'
import {Regions} from "../support/enums";


Given('the offender is found on PPUD', () => {
    cy.clickButton("John Teal")
})

When('PPCS user checks booking details for the offender', () => {
    cy.get(`[href="edit-gender"]`).click()
    cy.get(`[id="gender"]`).click()
    cy.clickButton("Continue")
    cy.get(`[href="edit-ethnicity"]`).click()
    cy.get(`#ethnicity`).select("Chinese")
    cy.clickButton("Continue")


})

When('selects the index offence', () => {
})

When('selects the matching index offence in PPUD', () => {
})

Then('PPCS user can book the offender in PPUD', () => {
})