import { After, Before, defineParameterType, Then, When } from '@badeball/cypress-cucumber-preprocessor'
import { flush } from '@alfonso-presa/soft-assert'
import { UserType } from '../support/commands'
import {
  q11Vulnerabilities,
  q12Contraband,
  q13MappaDetails,
  q8VLOContact,
  q14RoshLevels,
  q15IndexOffenceDetails,
  q16LicenceConditions,
  q17AdditionalConditions,
  q18CircumstancesLeadingToRecall,
  q1EmergencyRecall,
  q19Alternatives,
  q20RecallType,
  q21LicenceConditionsToAdd,
  q22IndeterminateAndExtendedSentenceCircumstances,
  q23ProbationDetailsWithCaseAdmin,
  q24SPOEndorsement,
  q25ACOAuthorisation,
  q26Attachments,
  q2IndeterminateSentenceType,
  q3ExtendedSentence,
  q6OffenderDetails,
  q7SentenceDetails,
  q9PoliceInformation,
  q4OffendersSentencedAsYouth,
  q5FTR56AdultSuitabilityCriteria,
} from './assertionsPartA'
import { CUSTODY_GROUP, CustodyType, SentenceGroup, YesNoType } from '../support/enums'
import { loginAndSearchCrn } from './user/user'

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
  q2IndeterminateSentenceType(
    contents,
    YesNoType[this.testData.sentenceGroup === SentenceGroup.INDETERMINATE ? 'YES' : 'NO']
  )
  q3ExtendedSentence(contents, YesNoType[this.testData.sentenceGroup === SentenceGroup.EXTENDED ? 'YES' : 'NO'])
  q4OffendersSentencedAsYouth(contents, this.testData)
  q5FTR56AdultSuitabilityCriteria(contents, this.testData)
  q6OffenderDetails(contents, this.testData.offenderDetails, this.testData.crn, this.testData.ecslDateOfRelease) // TODO date of release may need to change with MRD-3090
  q7SentenceDetails(contents, this.testData.offenceDetails)
  q8VLOContact(contents, this.testData.vlo)
  q9PoliceInformation(
    contents,
    CustodyType[this.testData.inCustody],
    this.testData.localPoliceDetails,
    YesNoType[this.testData.hasArrestIssues],
    this.testData.arrestIssueDetails
  )
  q11Vulnerabilities(contents, this.testData.vulnerabilities)
  q12Contraband(contents, this.testData.contraband)
  q13MappaDetails(contents, this.testData.mappa)
  q14RoshLevels(contents, this.testData.currentRoshForPartA)
  q15IndexOffenceDetails(contents, this.testData.offenceAnalysis)
  q16LicenceConditions(contents, this.testData.licenceConditions.standard)
  q17AdditionalConditions(contents, this.testData.licenceConditions.advanced)
  q18CircumstancesLeadingToRecall(contents, this.testData.reasonForRecall)
  q19Alternatives(contents, this.testData.alternativesTried)
  q20RecallType(contents, this.testData)
  q21LicenceConditionsToAdd(contents, {
    fixedTermRecallNotes: this.testData.fixedTermRecallNotes,
    recallType: this.testData.recallType,
    fixedTermRecall: this.testData.fixedTermRecall,
    sentenceGroup: this.testData.sentenceGroup,
  })
  q22IndeterminateAndExtendedSentenceCircumstances(contents, this.testData.indeterminateOrExtendedSentenceDetails)
  q23ProbationDetailsWithCaseAdmin(
    contents,
    this.testData.thePersonCompletingTheForm,
    this.testData.offenderManager,
    this.testData
  )
  if (
    Cypress.env('ENV')?.toString().toUpperCase() === 'PREPROD' ||
    Cypress.env('ENV')?.toString().toUpperCase() === 'DEV'
  )
    q24SPOEndorsement.call(this, contents, this.testData.spoCounterSignature, this.testData.recallDateBySPO)
  if (
    Cypress.env('ENV')?.toString().toUpperCase() === 'PREPROD' ||
    Cypress.env('ENV')?.toString().toUpperCase() === 'DEV'
  )
    q25ACOAuthorisation.call(this, contents, this.testData.acoCounterSignature)
  q26Attachments(contents, this.testData.localPoliceDetails)
})

When('PO returns to Recommendations page of CRN', function () {
  cy.clickLink(`Back`)
  cy.clickLink('Back')
  cy.clickLink('Recommendations')
})

Then('SPO can no longer record rationale', function () {
  loginAndSearchCrn.call(this, UserType.SPO)
  cy.get('#main-content a:contains("Consider a recall")').should('not.exist')
})

Then('SPO can see the case is closed on the Overview page', function () {
  cy.clickLink('Return to overview')
  cy.get('#main-content a:contains("Consider a recall")').should('not.exist')
})

Then('PO can see the case is closed on the Overview page', function () {
  cy.clickLink(`Return to overview for ${this.offenderName}`)
  cy.get('#main-content a:contains("Consider a recall")').should('not.exist')
})
