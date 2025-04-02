import { faker } from "@faker-js/faker"

export const textInputRandomText = (id: string, dataGen: () => string = faker.lorem.words) => {
    cy.get(`input[type="text"]#${id}`).then(textInput => {
        cy.wrap(textInput)
            .clear({ force: true })
            .type(dataGen())
    })
}