export const addDateAndTime = (id: string, dateTime: Date) => {
    cy.get(`#${id}-day`).type(dateTime.getDay().toString())
    cy.get(`#${id}-month`).type(dateTime.getMonth().toString())
    cy.get(`#${id}-year`).type(dateTime.getFullYear().toString())
    cy.get(`#${id}-hour`).type(dateTime.getHours().toString())
    cy.get(`#${id}-minute`).type(dateTime.getMinutes().toString())
}