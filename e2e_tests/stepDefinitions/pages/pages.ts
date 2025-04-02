export const pages = {
    taskListConsiderRecall: (recommendationId: number) => {
        cy.visit(`/recommendations/${recommendationId}/task-list-consider-recall`)
    },

    taskListCounterSign: (recommendationId: number) => {
        cy.visit(`/recommendations/${recommendationId}/task-list`)
    }
}