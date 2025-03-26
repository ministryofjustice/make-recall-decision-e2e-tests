import { faker } from "@faker-js/faker"

type DetailsForValueSelector = (elem: HTMLElement) => string;

const defaultGetDetailsForValueSelector: DetailsForValueSelector = (elem: HTMLElement) => `#${elem.getAttribute('name')}Detail-${elem.getAttribute('value')}`

export const selectRandomCheckBoxes = (name: string) => {
    cy.get(`input[type="checkbox"][name="${name}"]`).then(checkboxes => {
        faker.helpers.arrayElements(checkboxes.toArray()).forEach(cb => cy.get(`#${cb.id}`).check())
    })
}

export const selectRandomCheckBoxesWithDetails = (name: string, ignoreOptionsIds: string[] = [], detailsForValueSelector: DetailsForValueSelector = defaultGetDetailsForValueSelector) => {
    cy.get(`input[type="checkbox"][name="${name}"]`).then(checkboxes => {
        const randomCBs = faker.helpers.arrayElements(checkboxes.toArray().filter(cb => !ignoreOptionsIds.includes(cb.id)))

        randomCBs.forEach(cb => {
            // Check the box
            cy.get(`#${cb.id}`).check()
            // Fill the details
            cy.get(detailsForValueSelector(cb)).type(faker.lorem.sentences())
        })
    })
}