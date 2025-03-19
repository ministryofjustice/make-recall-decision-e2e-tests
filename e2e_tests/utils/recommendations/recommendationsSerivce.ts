import { CreateRecommendationRequest, FeatureFlags, Recommendation, UpdateRecommendationRequest, UpdateRecommendationStatusRequest } from "./recommendations.d"

const MRD_URL_KEY = 'MAKE_RECALL_DECISION_API_URL'

const createRecommendation = (data: CreateRecommendationRequest, authToken: string, featureFlags?: FeatureFlags) => {
    return cy.request({
        method: 'POST',
        url: `${Cypress.env(MRD_URL_KEY)}/recommendations`,
        body: data,
        headers: {
            Authorization: authToken,
            ...featureFlags
        }
    }).then(async (res) => {
        expect(res.status).to.equal(201)
        return res.body as Recommendation
    })
}

const updateRecommendation = (recommedationId: number, data: UpdateRecommendationRequest, authToken: string, propertiesToRefresh?: string[]) => {
    return cy.request({
        method: 'PATCH',
        url: `${Cypress.env(MRD_URL_KEY)}/recommendations/${recommedationId}${propertiesToRefresh ? `?refreshProperty=${propertiesToRefresh.join(',')}` : ''}`,
        body: data,
        headers: {
            Authorization: authToken
        }
    }).then(async (res) => {
        expect(res.status).to.equal(200)
    })
}

const updateRecommendationStatus = (recommendationId: number, data: UpdateRecommendationStatusRequest, authToken: string) => {
    return cy.request({
        method: 'PATCH',
        url: `${Cypress.env(MRD_URL_KEY)}/recommendations/${recommendationId}/status`,
        body: data,
        headers: {
            Authorization: authToken
        }
    })
}

export const recommendationService = {
    createRecommendation,
    updateRecommendation,
    updateRecommendationStatus
}