import { faker } from "@faker-js/faker"

export const selectRandomRadio = (locator: string) => {
    cy.get(locator).find('input[type="radio"]').then(radios => {
            faker.helpers.arrayElement(radios.toArray()).click()
    })
}

export const selectRadio = (name: string, value: string) => {
    cy.get(`input[type="radio"][name="${name}"]`).check(value)
}