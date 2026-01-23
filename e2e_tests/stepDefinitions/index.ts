import { After, Before, defineParameterType, Then, When } from '@badeball/cypress-cucumber-preprocessor'
import { flush } from '@alfonso-presa/soft-assert'
import { UserType } from '../support/commands'
import {
  q10Vulnerabilities,
  q11Contraband,
  q12MappaDetails,
  q13RegisteredPPOIOM,
  q14VLOContact,
  q15RoshLevels,
  q16IndexOffenceDetails,
  q17LicenceConditions,
  q18AdditionalConditions,
  q19CircumstancesLeadingToRecall,
  q1EmergencyRecall,
  q20ResponseToSupervision,
  q21Alternatives,
  q22RecallType,
  q23LicenceConditionsToAdd,
  q24ISPESP,
  q25ProbationDetailsWithCaseAdmin,
  q26OffenderManager,
  q27SPOEndorsement,
  q28ACOAuthorisation,
  q29Attachments,
  q2IndeterminateSentenceType,
  q3ExtendedSentence,
  q4OffenderDetails,
  q5SentenceDetails,
  q6CustodyStatus,
  q7Addresses,
  q8ArrestIssues,
  q9LocalPoliceDetails,
} from './assertionsPartA'
import { CUSTODY_GROUP, CustodyType, YesNoType } from '../support/enums'
import { loginAndSearchCrn } from "./user/user"

export const crns = {
  1: Cypress.env('CRN') || 'X514364',
  2: Cypress.env('CRN2') || 'X514364',
  3: Cypress.env('CRN3') || 'X487027',
  4: Cypress.env('CRN4') || 'X487027',
  // 5: Cypress.env('CRN5') || 'D002399', // Removed temporarily. This CRN doesn't have an address, and causes an error on the addressDetails page
}
export const deleteOpenRecommendation = () => {
  cy.clickLink('Recommendations')
  // check if Delete button is available (the flag is enabled)
  cy.get('body').then($body => {
    const { length } = $body.find('[data-qa="delete-recommendation"]')
    if (length) {
      // If the first Recommendation is Open then delete it so that a new recommendation can be created
      // Cypress stops the tests if the screen redirects to same page more than 20 times, so limiting the deletes to first 10, if more exists
      for (let i = 0; i < (length > 10 ? 10 : length); i += 1) {
        cy.getRowValuesFromTable({ tableCaption: 'Recommendations', rowSelector: 'tr[data-qa]:first-child' }).then(
          // eslint-disable-next-line no-loop-func
          () => {
            cy.compareSnapshot('Delete open recommendation - 2')
            cy.get('[data-qa] [data-qa="delete-recommendation"]').first().click()
          }
        )
      }
    }
  })
}

export const openApp = function (queryParams: object, userType?: UserType, newUrl?: string) {
  let queryParameters = ''
  Object.keys(queryParams).forEach(keyName => {
    queryParameters = `${queryParameters + keyName}=${queryParams[keyName]}&`
  })
  cy.visitPageAndLogin(`${newUrl || ''}?${queryParameters}`, userType || UserType.PO)
}

/* ---- Cucumber glue ---- */

defineParameterType({ name: 'userType', regexp: /PO|SPO|ACO|PPCS/, transformer: s => UserType[s] })

defineParameterType({
  name: 'managersDecision',
  regexp: /RECALL|NO_RECALL/,
  transformer: s => s,
})

defineParameterType({ name: 'custodyGroup', regexp: /DETERMINATE|INDETERMINATE/, transformer: s => CUSTODY_GROUP[s] })
Before(() => {
  openApp({ flagRecommendationsPage: 1, flagDeleteRecommendation: 1 })
})

After(function () {
  cy.log(`this.testData@End--> ${JSON.stringify(this.testData)}`)
  flush()
})

Then('the page heading contains {string}', heading => {
  cy.pageHeading().should('contains', heading)
})

Then('PO/SPO/ACO can create Part A', function () {
  cy.clickLink('Create Part A')
  cy.compareSnapshot('PO/SPO/ACO can create Part A')
})

Then('PO/SPO/ACO can download Part A', function () {
  cy.downloadDocX('Download the Part A').as('partAContent')
})

Then('PO/SPO/ACO can download preview of Part A', function () {
  cy.downloadDocX('Download preview of Part A').as('partAContent')
})

Then('Part A details are correct', function () {
  cy.log(`this.testData--> ${JSON.stringify(this.testData)}`)
  const contents = this.partAContent.toString()
  q1EmergencyRecall(contents, YesNoType[this.testData.emergencyRecall])
  q2IndeterminateSentenceType(contents, YesNoType[this.testData.indeterminate])
  q3ExtendedSentence(contents, YesNoType[this.testData.extended])
  q4OffenderDetails(contents, this.testData.offenderDetails)
  q5SentenceDetails(contents, this.testData.offenceDetails)
  q6CustodyStatus(contents, CustodyType[this.testData.inCustody])
  q7Addresses(contents, this.testData.custodyAddress)
  q8ArrestIssues(contents, YesNoType[this.testData.hasArrestIssues], this.testData.arrestIssueDetails)
  q9LocalPoliceDetails(contents, this.testData.localPoliceDetails)
  q10Vulnerabilities(contents, this.testData.vulnerabilities)
  q11Contraband(contents, this.testData.contraband)
  q12MappaDetails(contents, this.testData.mappa)
  q13RegisteredPPOIOM(contents, this.testData.iom)
  q14VLOContact(contents, this.testData.vlo)
  q15RoshLevels(contents, this.testData.currentRoshForPartA)
  q16IndexOffenceDetails(contents, this.testData.offenceAnalysis)
  q17LicenceConditions(contents, this.testData.licenceConditions.standard)
  q18AdditionalConditions(contents, this.testData.licenceConditions.advanced)
  q19CircumstancesLeadingToRecall(contents, this.testData.reasonForRecall)
  q20ResponseToSupervision(contents, this.testData.probationResponse)
  q21Alternatives(contents, this.testData.alternativesTried)
  q22RecallType(contents, this.testData)
  q23LicenceConditionsToAdd(contents, {
    fixedTermRecallNotes: this.testData.fixedTermRecallNotes,
    recallType: this.testData.recallType,
    fixedTermRecall: this.testData.fixedTermRecall,
    indeterminate: this.testData.indeterminate,
    extended: this.testData.extended,
  })
  q24ISPESP(contents, this.testData.indeterminateOrExtendedSentenceDetails)
  q25ProbationDetailsWithCaseAdmin(contents, this.testData.thePersonCompletingTheForm, this.testData)
  if ((Cypress.env('ENV')?.toString().toUpperCase() !== 'PREPROD' && Cypress.env('ENV')?.toString().toUpperCase() !== 'DEV')) q26OffenderManager(contents, this.testData.offenderManager)
  if ((Cypress.env('ENV')?.toString().toUpperCase() === 'PREPROD' || Cypress.env('ENV')?.toString().toUpperCase() === 'DEV')) q27SPOEndorsement.call(this, contents, this.testData.spoCounterSignature)
  if ((Cypress.env('ENV')?.toString().toUpperCase() === 'PREPROD' || Cypress.env('ENV')?.toString().toUpperCase() === 'DEV')) q28ACOAuthorisation.call(this, contents, this.testData.acoCounterSignature)
  q29Attachments(contents, this.testData.localPoliceDetails)
})

When('PO returns to Recommendations page of CRN', function () {
  cy.compareSnapshot('PO returns to Recommendations page of CRN - 1')
  cy.clickLink(`Back`)
  // @TODO - Fix this when GitHub Actions migration complete
  // cy.compareSnapshot('PO returns to Recommendations page of CRN - 2')
  cy.clickLink('Back')
  cy.compareSnapshot('PO returns to Recommendations page of CRN - 3')
  cy.clickLink('Recommendations')
})

Then('SPO can no longer record rationale', function () {
  loginAndSearchCrn.call(this, UserType.SPO)
  cy.compareSnapshot('SPO can no longer record rationale - 1')
  cy.get('#main-content a:contains("Consider a recall")').should('not.exist')
})

Then('SPO can see the case is closed on the Overview page', function () {
  cy.clickLink('Return to overview')
  cy.compareSnapshot('SPO can see the case is closed on the Overview page - 1')
  cy.get('#main-content a:contains("Consider a recall")').should('not.exist')
})

Then('PO can see the case is closed on the Overview page', function () {
  cy.clickLink(`Return to overview for ${this.offenderName}`)
  cy.compareSnapshot('PO can see the case is closed on the Overview page - 1')
  cy.get('#main-content a:contains("Consider a recall")').should('not.exist')
})
