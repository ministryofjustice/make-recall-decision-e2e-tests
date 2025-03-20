import { faker } from "@faker-js/faker"

export const selectRandomAutocompleteOption = (id: string) => {
    cy.log('Before -select')
    cy.get(`#${id}-select`).then(async select => {
        const options = select.find('option').toArray().flatMap(o => o.textContent === '' ? [] : [o.textContent])
        cy.log(options.reduce((a, b) => `${a} - ${b}`, 'Options: '))
        return options
    }).then(async options => {
        cy.get(`#${id}`)
            .click()
            .type(faker.helpers.arrayElement(options))
            .type('{enter}')
    })
}