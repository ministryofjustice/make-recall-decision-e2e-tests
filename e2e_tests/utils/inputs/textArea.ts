import { faker } from "@faker-js/faker"

export const textAreaRandomText = (id: string) => {
    cy.get(`textArea#${id}`).then(textArea => {
        cy.wrap(textArea)
            .clear({ force: true })
            .type(faker.lorem.paragraph())
    })
}