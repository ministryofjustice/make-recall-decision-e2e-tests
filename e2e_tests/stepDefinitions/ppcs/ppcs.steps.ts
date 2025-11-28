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
  cy.clickButton('Continue')
  cy.pageHeading().should('equal', 'Record the consideration in NDelius')
  cy.clickButton('Send to NDelius')

  cy.clickLink('Continue to make a recommendation')
  cy.pageHeading().should('equal', 'Discuss with your manager')
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
  cy.get(`tr[data-qa="row-${ppcsTestData.crn}"] a[data-qa="name"]`).click()
  // The service root link is also a link with the text Consider a recall...
  // This makes the typical clickLink unsuitable
  // another good reason to make these proper link-as-buttons so they can be better idenfied
  cy.get('a.govuk-button').contains('Consider a recall').click()

  cy.pageHeading().should('equal', 'Consider a recall')
  cy.clickLink('Record the decision')
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
  cy.clickLink(lineManagerLabel)
  cy.pageHeading().should('equal', 'Enter your telephone number')
  cy.clickButton('Continue')
  cy.pageHeading().should('equal', lineManagerLabel)
  textAreaRandomText('managerCountersignatureExposition')
  cy.clickButton('Countersign')
  cy.pageHeading().should('contain', 'Part A countersigned')
  cy.clickLink('Return to Part A')

  const seniorLineManagerLabel = 'Senior manager countersignature'
  cy.clickLink(seniorLineManagerLabel)
  cy.pageHeading().should('contain', 'Enter your telephone number')
  cy.clickButton('Continue')
  cy.pageHeading().should('equal', seniorLineManagerLabel)
  textAreaRandomText('managerCountersignatureExposition')
  cy.clickButton('Countersign')
  cy.pageHeading().should('contain', 'Part A countersigned')
  cy.clickLink('Return to Part A')

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
  cy.clickLink('Continue') // TODO: this link should have the button role and should check for this

  cy.pageHeading().should('equal', 'Use these details to search PPUD')
  cy.clickButton('Continue')

  cy.pageHeading().should('equal', 'PPUD record found')
  if (custodyGroup === CUSTODY_GROUP.DETERMINATE) {
    cy.contains('span', 'What to do if you cannot find the right PPUD record').click()
    cy.contains('a', 'Create a determinate PPUD record').should('have.attr', 'role', 'button').click()
  } else {
    cy.get('form').find('button').click()
  }

  cy.pageHeading().should('contain', 'Check booking details for ')

  cy.clickLinkById('edit-gender', editText)
  cy.pageHeading().should('equal', 'Edit gender')
  selectRandomRadio('.govuk-radios') // Forced to select by class at the moment as govuk-radios doesn't allow providing an id
  cy.clickButton('Continue')

  cy.clickLinkById('edit-ethnicity', editText)
  cy.pageHeading().should('equal', 'Edit ethnicity')
  selectRandomOption('#ethnicity', true)
  cy.clickButton('Continue')

  cy.clickLinkById('edit-releasingprison', editText)
  cy.pageHeading().should('equal', 'Edit releasing prison')
  selectRandomAutocompleteOption('releasingPrison')
  cy.clickButton('Continue')

  cy.get('#edit-legislationreleasedunder').should('not.exist')

  cy.clickLinkById('edit-custodygroup', editText)
  cy.pageHeading().should('equal', 'Is the sentence determinate or indeterminate?')
  selectRadio('custodyGroup', custodyGroup)
  cy.clickButton('Continue')

  if (custodyGroup === CUSTODY_GROUP.DETERMINATE) {
    cy.clickLinkById('edit-legislationreleasedunder', editText)
    cy.pageHeading().should('equal', 'Edit legislation released under')
    selectRandomOption('#legislationReleasedUnder', true)
    cy.clickButton('Continue')

    cy.get('#edit-legislationreleasedunder').should('exist')
  } else {
    cy.get('#edit-legislationreleasedunder').should('not.exist')
  }

  cy.clickLinkById('edit-currentestablishment', editText)
  cy.pageHeading().should('equal', 'Edit current establishment')
  selectRandomAutocompleteOption('currentEstablishment')
  cy.clickButton('Continue')

  cy.clickLinkById('edit-probationarea', editText)
  cy.pageHeading().should('equal', 'Edit probation area')
  selectRandomOption('#probationArea', true)
  cy.clickButton('Continue')

  cy.clickLinkById('edit-policecontact', editText)
  cy.pageHeading().should('equal', 'Edit police local contact details')
  selectRandomOption('#policeForce', true)
  cy.clickButton('Continue')

  cy.clickLinkById('edit-mappalevel', editText)
  cy.pageHeading().should('equal', 'Edit MAPPA level')
  selectRandomRadio('.govuk-radios') // Forced to select by class at the moment as no id
  cy.clickButton('Continue')

  cy.clickButton('Continue')

  if (custodyGroup === CUSTODY_GROUP.DETERMINATE) {
    cy.pageHeading().should('contain', 'Select the index offence for ')
    selectRadio('indexOffence', '3934359')
    cy.clickButton('Continue')

    cy.pageHeading().should('equal', 'View the index offence and its consecutive sentences')
    cy.clickLink('Continue')

    cy.pageHeading().should('equal', 'Select a matching index offence in PPUD')
    selectRandomAutocompleteOption('indexOffence')
    cy.clickButton('Continue')

    cy.pageHeading().should('contain', 'Which custody type is ')
    selectRandomRadio('.govuk-radios')
    cy.clickButton('Continue')

    cy.pageHeading().should('contain', 'Your recall booking - ')
    // TODO Verify data that was set during the test once we have normalised the summary list
    // and can access direct data
    cy.clickButton('Continue')

    cy.pageHeading().should('contain', 'Create new PPUD record for ')
    cy.clickButton('Continue')
  } else if (custodyGroup === CUSTODY_GROUP.INDETERMINATE) {
    cy.pageHeading().should('contain', 'Select or add a sentence for your booking')

    // navigate to 'determinate ppud sentences' page and come back
    cy.get('body').then(($body) => {
      const $summary = $body.find('#determinateSentencesDetails summary')
      if ($summary.length) {
        cy.wrap($summary).click()
        cy.get('#determinate-sentences-link').click()
        cy.pageHeading().should('equal', 'Determinate sentences in PPUD')
        cy.contains('a', 'Return to indeterminate sentences').click()
      } else {
        cy.log('No determinate sentences summary found, skipping steps')
      }
    })

    // select random radio on the indeterminate page
    selectRandomRadio('.govuk-radios') // Forced to select by class at the moment as no id
    cy.clickButton('Continue')

    cy.pageHeading().should('contain', 'Your recall booking for ')
    cy.clickButton('Continue')

    cy.pageHeading().should('match', /Book \S.+? onto PPUD/)
    cy.clickButton('Continue')
  }
})

Then('the {custodyGroup} booking reports successfully sent to PPUD', function (custodyGroup: CUSTODY_GROUP) {
  if (custodyGroup in [CUSTODY_GROUP.DETERMINATE, CUSTODY_GROUP.INDETERMINATE]) {
    cy.pageHeading().should('contain', 'Your recall booking')
  } else {
    cy.contains(`Unexpected custody group encountered: ${custodyGroup}`).should('not.exist')
  }
})
