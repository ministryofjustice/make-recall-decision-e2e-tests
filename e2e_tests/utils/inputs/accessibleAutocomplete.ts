import { faker } from "@faker-js/faker"

export const selectRandomAutocompleteOption = (id: string) => {
    cy.get(`#${id}-select`).then(async select => {
        const options = select.find('option').toArray().flatMap(o => o.textContent === '' ? [] : [o.textContent])
        return options
    }).then(async options => {
        cy.get(`#${id}`)
            .click()
            .type(faker.helpers.arrayElement(options))
            .type('{enter}')
    })
}