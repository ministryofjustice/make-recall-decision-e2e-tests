import { Buffer } from 'buffer'

export const getApiAuth = () => {
    return cy.request({
        method: 'POST',
        url: `${Cypress.env('HMPPS_AUTH_EXTERNAL_URL')}/oauth/token?grant_type=client_credentials`,
        headers: {
            Authorization: `Basic ${Buffer.from(`${Cypress.env('API_CLIENT_ID')}:${Cypress.env('API_CLIENT_SECRET')}`).toString('base64')}`,
        }
    }).then(async (res) => {
        expect(res.isOkStatusCode).to.be.true
        const apiAuth = { type: res.body['token_type'], token: res.body['access_token'] }
        return `${apiAuth.type} ${apiAuth.token}`
    })
}