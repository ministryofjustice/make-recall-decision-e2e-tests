import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor'
import { recommendationService } from '../../utils/recommendations/recommendationsService'
import { getApiAuth } from '../../utils/auth'
import { loginAndSearchForCrn, signOut } from '../user/user'
import { selectRandomOption } from '../../utils/inputs/select'
import { selectRadio, selectRandomRadio } from '../../utils/inputs/radios'
import { selectRandomAutocompleteOption } from '../../utils/inputs/accessibleAutocomplete'
import { pages } from '../pages/pages'
import { UserType } from '../../support/commands'
import { textAreaRandomText } from '../../utils/inputs/textArea'
import {
  createRecommendationRequest,
  initialRecomendationRequest,
  postPORecallRecommendationRequest,
  recordDecisionRecommendationRequest,
  spoSignatureRequestStatusRequest,
  startRecallRecommendationStatusRequest,
} from './ppcs.requests'
import { CUSTODY_GROUP } from '../../support/enums'

const LOCAL_TEST_PPCS_CRN = 'X738925'

let ppcsTestData: {
  crn: string,
  recommendationId: number
}

// TODO Expand for use in dev
const resolveTestCRN = () => LOCAL_TEST_PPCS_CRN

Given('a recommendation exists for use in PPCS', () => {
  const crn = resolveTestCRN()

  getApiAuth().then((authToken) => {
    recommendationService.createRecommendation(createRecommendationRequest(crn), authToken).then((recommedation) => {
      ppcsTestData = {
        crn: crn,
        recommendationId: recommedation.id,
      }
      recommendationService.updateRecommendation(ppcsTestData.recommendationId, initialRecomendationRequest(), authToken)
      recommendationService.updateRecommendationStatus(recommedation.id, startRecallRecommendationStatusRequest(), authToken)
    })
  })
})

Then('the PPCS recommendation is submitted by a PO', () => {
  pages.taskListConsiderRecall(ppcsTestData.recommendationId)

  cy.pageHeading().should('equal', 'Consider a recall')
  cy.compareSnapshot('the PPCS recommendation is submitted by a PO - Consider a recall')
  cy.clickButton('Continue')
  cy.pageHeading().should('equal', 'Record the consideration in NDelius')
  cy.compareSnapshot('the PPCS recommendation is submitted by a PO - Record the consideration in NDelius')
  cy.clickButton('Send to NDelius')

  cy.compareSnapshot('the PPCS recommendation is submitted by a PO - Continue to make a recommendation')
  cy.clickLink('Continue to make a recommendation')
  cy.pageHeading().should('equal', 'Discuss with your manager')
  cy.compareSnapshot('the PPCS recommendation is submitted by a PO - Discuss with your manager')
  cy.clickLink('Continue')

  getApiAuth().then((authToken) => {
    recommendationService.updateRecommendation(ppcsTestData.recommendationId, postPORecallRecommendationRequest(), authToken, ['previousReleases', 'previousRecalls'])
  })
})

Then('the PPCS recommendation has had a recall decision recorded', () => {
  getApiAuth().then((authToken) => {
    recommendationService.updateRecommendation(ppcsTestData.recommendationId, recordDecisionRecommendationRequest(), authToken)
  })

  signOut()
  loginAndSearchForCrn(UserType.ACO, ppcsTestData.crn)

  cy.compareSnapshot('The PPCS recommendation has had a recall decision recorded - 1')
  cy.get(`tr[data-qa="row-${ppcsTestData.crn}"] a[data-qa="name"]`).click()
  // The service root link is also a link with the text Consider a recall...
  // This makes the typical clickLink unsuitable
  // another good reason to make these proper link-as-buttons so they can be better idenfied
  cy.compareSnapshot('The PPCS recommendation has had a recall decision recorded - 2')
  cy.get('a.govuk-button').contains('Consider a recall').click()

  cy.pageHeading().should('equal', 'Consider a recall')
  cy.compareSnapshot('The PPCS recommendation has had a recall decision recorded - 3')
  cy.clickLink('Record the decision')
  cy.compareSnapshot('The PPCS recommendation has had a recall decision recorded - 4')
  cy.clickButton('Send to NDelius')
  cy.pageHeading().should('contains', 'Decision to recall')
})

Then('the PPCS recommendation is counter-signed and downloaded', () => {
  getApiAuth().then((authToken) => {
    recommendationService.updateRecommendationStatus(ppcsTestData.recommendationId, spoSignatureRequestStatusRequest(), authToken)
  })
  pages.taskListCounterSign(ppcsTestData.recommendationId)
  cy.pageHeading().should('contain', `CRN: ${ppcsTestData.crn}`)
  cy.pageHeading().should('contain', 'Part A for')

  const lineManagerLabel = 'Line manager countersignature'
  cy.compareSnapshot('The PPCS recommendation is counter-signed and downloaded - 1')
  cy.clickLink(lineManagerLabel)
  cy.pageHeading().should('equal', 'Enter your telephone number')
  cy.compareSnapshot('The PPCS recommendation is counter-signed and downloaded - 2')
  cy.clickButton('Continue')
  cy.pageHeading().should('equal', lineManagerLabel)
  textAreaRandomText('managerCountersignatureExposition')
  cy.compareSnapshot('The PPCS recommendation is counter-signed and downloaded - 3')
  cy.clickButton('Countersign')
  cy.pageHeading().should('contain', 'Part A countersigned')
  cy.compareSnapshot('The PPCS recommendation is counter-signed and downloaded - 4')
  cy.clickLink('Return to Part A')

  const seniorLineManagerLabel = 'Senior manager countersignature'
  cy.compareSnapshot('The PPCS recommendation is counter-signed and downloaded - 5')
  cy.clickLink(seniorLineManagerLabel)
  cy.pageHeading().should('contain', 'Enter your telephone number')
  cy.compareSnapshot('The PPCS recommendation is counter-signed and downloaded - 6')
  cy.clickButton('Continue')
  cy.pageHeading().should('equal', seniorLineManagerLabel)
  textAreaRandomText('managerCountersignatureExposition')
  cy.compareSnapshot('The PPCS recommendation is counter-signed and downloaded - 7')
  cy.clickButton('Countersign')
  cy.pageHeading().should('contain', 'Part A countersigned')
  cy.compareSnapshot('The PPCS recommendation is counter-signed and downloaded - 8')
  cy.clickLink('Return to Part A')

  cy.compareSnapshot('The PPCS recommendation is counter-signed and downloaded - 9')
  cy.clickLink('Create Part A')
  cy.downloadDocX('Download the Part A')
})

When('a PPCS user locates the existing recommendation ready to book', () => {
  loginAndSearchForCrn(UserType.PPCS, ppcsTestData.crn)
})

Then('the user proceeds to book a {custodyGroup} sentence recall', function(custodyGroup: CUSTODY_GROUP) {
  if (![CUSTODY_GROUP.DETERMINATE, CUSTODY_GROUP.INDETERMINATE].includes(custodyGroup)) {
    cy.contains(`Unexpected custody group encountered: ${custodyGroup}`).should('not.exist')
  }

  const editText = 'Edit'

  cy.pageHeading().should('equal', 'Search results')
  cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 1`)
  cy.clickLink('Continue') // TODO: this link should have the button role and should check for this

  cy.pageHeading().should('equal', 'Use these details to search PPUD')
  cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 2`)
  cy.clickButton('Continue')

  cy.pageHeading().should('equal', 'PPUD record found')
  if (custodyGroup === CUSTODY_GROUP.DETERMINATE) {
    cy.contains('span', 'What to do if you cannot find the right PPUD record').click()
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 3`)
    cy.get('form').find('button.govuk-button--secondary').click()
  } else {
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 4`)
    cy.get('form').find('button.govuk-button-as-link').click()
  }

  cy.pageHeading().should('contain', 'Check booking details for ')

  cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 5`)
  cy.clickLinkById('edit-gender', editText)
  cy.pageHeading().should('equal', 'Edit gender')
  selectRandomRadio('.govuk-radios') // Forced to select by class at the moment as govuk-radios doesn't allow providing an id
  cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 6`)
  cy.clickButton('Continue')

  cy.clickLinkById('edit-ethnicity', editText)
  cy.pageHeading().should('equal', 'Edit ethnicity')
  cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 7`)
  selectRandomOption('#ethnicity', true)
  cy.clickButton('Continue')

  cy.clickLinkById('edit-releasingprison', editText)
  cy.pageHeading().should('equal', 'Edit releasing prison')
  cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 8`)
  selectRandomAutocompleteOption('releasingPrison')
  cy.clickButton('Continue')
  if (custodyGroup === CUSTODY_GROUP.DETERMINATE) {
    cy.get('#edit-custodygroup').should('not.exist')
    cy.get('#check-booking-custody-details-list-determinate-or-indeterminate-row')
      .find('.govuk-summary-list__value')
      .should('contain', 'Determinate')
    cy.get('#edit-legislationreleasedunder').should('exist')
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 9`)
    cy.clickLinkById('edit-legislationreleasedunder', editText)
    cy.pageHeading().should('equal', 'Edit legislation released under')
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 10`)
    selectRandomOption('#legislationReleasedUnder', true)
    cy.clickButton('Continue')
  } else {
    cy.clickLinkById('edit-custodygroup', editText)
    cy.pageHeading().should('equal', 'Is the sentence determinate or indeterminate?')
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 11`)
    selectRadio('custodyGroup', custodyGroup)
    cy.clickButton('Continue')
    cy.get('#edit-legislationreleasedunder').should('not.exist')
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 12`)
  }

  cy.clickLinkById('edit-currentestablishment', editText)
  cy.pageHeading().should('equal', 'Edit current establishment')
  cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 13`)
  selectRandomAutocompleteOption('currentEstablishment')
  cy.clickButton('Continue')

  cy.clickLinkById('edit-probationarea', editText)
  cy.pageHeading().should('equal', 'Edit probation area')
  cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 14`)
  selectRandomOption('#probationArea', true)
  cy.clickButton('Continue')

  cy.clickLinkById('edit-policecontact', editText)
  cy.pageHeading().should('equal', 'Edit police local contact details')
  cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 15`)
  selectRandomOption('#policeForce', true)
  cy.clickButton('Continue')

  cy.clickLinkById('edit-mappalevel', editText)
  cy.pageHeading().should('equal', 'Edit MAPPA level')
  cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 16`)
  selectRandomRadio('.govuk-radios') // Forced to select by class at the moment as no id
  cy.clickButton('Continue')

  cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 17`)
  cy.clickButton('Continue')

  if (custodyGroup === CUSTODY_GROUP.DETERMINATE) {
    cy.pageHeading().should('contain', 'Select the index offence for ')
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 18`)
    selectRadio('indexOffence', '3934359')
    cy.clickButton('Continue')

    cy.pageHeading().should('equal', 'View the index offence and its consecutive sentences')
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 19`)
    cy.clickLink('Continue')

    cy.pageHeading().should('equal', 'Select a matching index offence in PPUD')
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 20`)
    selectRandomAutocompleteOption('indexOffence')
    cy.clickButton('Continue')

    cy.pageHeading().should('contain', 'Which custody type is ')
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 21`)
    selectRandomRadio('.govuk-radios')
    cy.clickButton('Continue')

    cy.pageHeading().should('contain', 'Your recall booking - ')
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 22`)
    // TODO Verify data that was set during the test once we have normalised the summary list
    // and can access direct data
    cy.clickButton('Continue')

    cy.pageHeading().should('contain', 'Create new PPUD record for ')
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 23`)
    cy.clickButton('Continue')
  } else if (custodyGroup === CUSTODY_GROUP.INDETERMINATE) {
    cy.pageHeading().should('contain', 'Select a sentence for your booking')
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 24`)

    // navigate to 'determinate ppud sentences' page and come back
    cy.get('body').then(($body) => {
      const $summary = $body.find('#determinateSentencesDetails summary')
      if ($summary.length) {
        cy.wrap($summary).click()
        cy.get('#determinate-sentences-link').click()
        cy.pageHeading().should('equal', 'Determinate sentences in PPUD')
        cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 25`)
        cy.contains('a', 'Return to indeterminate sentences').click()
      } else {
        cy.log('No determinate sentences summary found, skipping steps')
      }
    })

    // select random radio on the indeterminate page
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 26`)
    selectRandomRadio('.govuk-radios') // Forced to select by class at the moment as no id
    cy.clickButton('Continue')

    cy.pageHeading().should('contain', 'Your recall booking for ')
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 27`)
    cy.clickButton('Continue')

    cy.pageHeading().should('match', /Book \S.+? onto PPUD/)
    cy.compareSnapshot(`the user proceeds to book a ${custodyGroup} sentence recall - 28`)
    cy.clickButton('Continue')
  }
})

Then('the {custodyGroup} booking reports successfully sent to PPUD', function (custodyGroup: CUSTODY_GROUP) {
  if (custodyGroup in [CUSTODY_GROUP.DETERMINATE, CUSTODY_GROUP.INDETERMINATE]) {
    cy.pageHeading().should('contain', 'Your recall booking')
    cy.compareSnapshot(`the ${custodyGroup} booking reports successfully sent to PPUD - 29`)
  } else {
    cy.contains(`Unexpected custody group encountered: ${custodyGroup}`).should('not.exist')
  }
})
