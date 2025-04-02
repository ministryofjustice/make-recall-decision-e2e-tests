import { faker } from "@faker-js/faker"

export const selectRandomOption = (locator: string, ignorePlaceHolder: boolean = false) => {
    cy.get(locator).then(async select => {
        const allOptions = select.find('option').toArray()
        const optionValues = (
            ignorePlaceHolder
                ? allOptions.slice(1)
                : allOptions
        ).map(o => o.textContent)
        return optionValues
    }).then(async options => {
        cy.get(locator).select(faker.helpers.arrayElement(options))
    })
}