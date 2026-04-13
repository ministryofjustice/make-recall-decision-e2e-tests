import { DateTime } from 'luxon'
import { proxy } from '@alfonso-presa/soft-assert'
import {
  changeDateFromLongFormatToShort,
  formatObjectDateToLongFormat,
  getTestDataPerEnvironment,
} from '../utils'
import {
  Alternatives,
  IndeterminateOrExtendedSentenceDetailType,
  LicenceConditions,
  NonIndeterminateRecallType,
  REGEXP_SPECIAL_CHAR,
  ROSHLevels,
  SentenceGroup,
  YesNoNAType,
  YesNoType,
} from '../support/enums'

const expectSoftly = proxy(expect)

const apiDataForCrn = getTestDataPerEnvironment()

const partASections = {
  1: '1. Is this an Emergency recall?',
  2: '2. Is the offender serving a life or IPP/DPP sentence?',
  3: '3. Is the offender serving an extended sentence?',
  4: '4. Offenders sentenced as a youth – Eligibility for a 14/28-day FTR',
  5: '5. To be eligible for a mandated 56-day FTR all answers must be “NO”',
  6: '6. Offender/Young Offender Details',
  7: '7. Sentence details',
  8: '8. VICTIMS: (Any information presented here should be disclosable to the prisoner)',
  9: '9. Police Information',
  10: '10. Last recorded address where s/he should be residing',
  11: '11. Could this recall affect any vulnerabilities or needs that the offender may have?',
  12: '12. Do you have any suspicions that the offender is using recall to bring contraband into the prison estate?',
  13: '13. Current MAPPA Management',
  14: '14. Current Risk of Serious Harm Assessment at time of this recall',
  15: '15. Provide details of the index offence(s) and write a succinct offence analysis',
  16: '16. Tick all standard licence conditions which have been breached',
  17: '17. If any additional licence condition(s) has been breached, write out each breached condition',
  18: '18. Detail the circumstances and behaviours leading to the recall and provide an analysis on why the risk is no longer manageable in the community.',
  19: '19. Describe any measures taken to continue to manage risk in the community',
  20: '20. Proposed recall type',
  21: '21. For Fixed Term Recalls, a new licence will be prepared by the prison.',
  22: '22. When recalling an ISP or ESP, the law requires that there is a link',
  23: '23. Probation Details – PS Probation Practitioner completing the Recall Report and Risk Assessment',
  24: '24. Endorsement of Recall Report and Risk Assessment by PS Line Manager',
  25: '25. Authorisation and comments by senior manager who is equivalent to the former ACO grade',
  26: '26. Attachments',
}

export const q1EmergencyRecall = (contents: string, answer: string) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[1]), contents.indexOf(partASections[2]))
  expectSoftly(contents, 'Emergency Recall').to.contain(`Is this an Emergency recall? ${answer}`)
}

export const q2IndeterminateSentenceType = (contents: string, answer: string) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[2]), contents.indexOf(partASections[3]))
  expectSoftly(contents, 'Indeterminate Sentence Type').to.contain(
    `Is the offender serving a life or IPP/DPP sentence? ${answer}`
  )
}

export const q3ExtendedSentence = (contents: string, answer: string) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[3]), contents.indexOf(partASections[4]))
  expectSoftly(contents, 'Extended Sentence').to.contain(`Is the offender serving an extended sentence? ${answer}`)
}

export const q4OffendersSentencedAsYouth = (contents: string, context: Record<string, string>) => {
  const sectionContents = contents.substring(contents.indexOf(partASections[4]), contents.indexOf(partASections[5]))
  const isYouthSentence = context.isYouthSentence ? YesNoType.YES : ''

  expectSoftly(sectionContents, 'Is under 18').to.contain(
    `Is the offender over 18 years old at the point of recall? ${isYouthSentence}`
  )
  expectSoftly(sectionContents, 'Is serving youth sentence').to.contain(
    `Is the offender only serving sentence(s) under s91 of the PCC(S)A 2000 or s.250 of the Sentencing Code? ${isYouthSentence}`
  )

  if (context.suitabilityForfixedTermRecall?.isYouthSentenceOver12Months == "NO") {
    expectSoftly(sectionContents, 'MAPPA level 2 or 3').to.contain(`Are they MAPPA level 2 or 3? ${context.mappa.mappaLevel === 'Level 2' || context.mappa.mappaLevel === 'Level 3' ? 'Yes' : 'No'}`)
    expectSoftly(sectionContents, 'Recalled due to charge of serious offence').to.contain(
    `Are they being recalled on account of being charged with a serious offence?  ${context.suitabilityForfixedTermRecall?.isYouthChargedWithSeriousOffence === "YES" ? 'Yes' : 'No'}`)
  } else {
    if (context.sentenceGroup === 'INDETERMINATE' || context.sentenceGroup === 'EXTENDED') {
      expectSoftly(sectionContents, 'MAPPA level 2 or 3').to.contain(`Are they MAPPA level 2 or 3? N/A - indeterminate or extended sentence`)
      expectSoftly(sectionContents, 'Recalled due to charge of serious offence').to.contain(
        `Are they being recalled on account of being charged with a serious offence?  N/A - indeterminate or extended sentence`)
    } else {
      expectSoftly(sectionContents, 'MAPPA level 2 or 3').to.contain(`Are they MAPPA level 2 or 3? Are they being recalled on account`)
      expectSoftly(sectionContents, 'Recalled due to charge of serious offence').to.contain(
      `Are they being recalled on account of being charged with a serious offence?  `)
    }
  }
}

export const q5FTR56AdultSuitabilityCriteria = (contents: string, context: Record<string, string>) => {
  const sectionContents = contents.substring(contents.indexOf(partASections[5]), contents.indexOf(partASections[6]))
  const { mappa, suitabilityForfixedTermRecall }: {
    mappa?: {
      mappaLevel: string;
      mappaCategory: string;
    }
    suitabilityForfixedTermRecall?: {
      isChargedWithOffence: keyof typeof YesNoType;
      isServingSOPCSentence: keyof typeof YesNoType;
      isServingDCRSentence: keyof typeof YesNoType;
      wasReferredToParoleBoard244ZB: keyof typeof YesNoType;
      wasRepatriatedForMurder: keyof typeof YesNoType;
      isAtRiskOfInvolvedInForeignPowerThreat: keyof typeof YesNoType;
      isServingTerroristOrNationalSecurityOffence: keyof typeof YesNoType;
    }
  } = context

  // These are undefined when it's a YOUTH_SDS flow, so assert that differently
  if (context.sentenceGroup === "ADULT_SDS") {
    expectSoftly(sectionContents, 'FTR56 suitability- MAPPA level 2 or 3').to.contain(
      `Is their MAPPA level 2 or 3? ${mappa?.mappaLevel === 'Level 2' || mappa?.mappaLevel === 'Level 3' ? YesNoType.YES : YesNoType.NO}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- Charged with offence').to.contain(
      `Are they being recalled on account of being charged with an offence?  ${suitabilityForfixedTermRecall ? YesNoType[suitabilityForfixedTermRecall.isChargedWithOffence] : ''}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- SOPC').to.contain(
      `Are they serving a sentence for offenders of particular concern (SOPC)? ${suitabilityForfixedTermRecall ? YesNoType[suitabilityForfixedTermRecall.isServingSOPCSentence] : ''}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- DCR').to.contain(
      `Are they serving a Discretionary Conditional Release (DCR) sentence? ${suitabilityForfixedTermRecall ? YesNoType[suitabilityForfixedTermRecall.isServingDCRSentence] : ''}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- Parole Board').to.contain(
      `Were they referred to the Parole Board under section 244ZB (power to detain) on this sentence? ${suitabilityForfixedTermRecall ? YesNoType[suitabilityForfixedTermRecall.wasReferredToParoleBoard244ZB] : ''}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- Repatriated for murder').to.contain(
      `Have they been repatriated to the UK following a sentence for murder? ${suitabilityForfixedTermRecall ? YesNoType[suitabilityForfixedTermRecall.wasRepatriatedForMurder] : ''}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- MAPPA category 4').to.contain(
      `Are they MAPPA category 4? ${mappa?.mappaCategory === "Category 4" ? 'Yes' : 'No'}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- Foreign power threat activity').to.contain(
      `Are they considered to be a person who may be at risk of involvement in foreign power threat activity? ${suitabilityForfixedTermRecall ? YesNoType[suitabilityForfixedTermRecall.isAtRiskOfInvolvedInForeignPowerThreat] : ''}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- Are they serving sentence for terrorist or national security offence?').to.contain(
      `Are they serving a sentence for a terrorist or national security offence? ${suitabilityForfixedTermRecall ? YesNoType[suitabilityForfixedTermRecall.isServingTerroristOrNationalSecurityOffence] : ''}`
    )
  } else if (context.sentenceGroup === 'INDETERMINATE' || context.sentenceGroup === 'EXTENDED') {
    const exclusionString = 'N/A - indeterminate or extended sentence'
    expectSoftly(sectionContents, 'FTR56 suitability- MAPPA level 2 or 3').to.contain(
      `Is their MAPPA level 2 or 3? ${exclusionString}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- Charged with offence').to.contain(
      `Are they being recalled on account of being charged with an offence?  ${exclusionString}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- SOPC').to.contain(
      `Are they serving a sentence for offenders of particular concern (SOPC)? ${exclusionString}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- DCR').to.contain(
      `Are they serving a Discretionary Conditional Release (DCR) sentence? ${exclusionString}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- Parole Board').to.contain(
      `Were they referred to the Parole Board under section 244ZB (power to detain) on this sentence? ${exclusionString}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- Repatriated for murder').to.contain(
      `Have they been repatriated to the UK following a sentence for murder? ${exclusionString}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- MAPPA category 4').to.contain(
      `Are they MAPPA category 4? ${exclusionString}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- Foreign power threat activity').to.contain(
      `Are they considered to be a person who may be at risk of involvement in foreign power threat activity? ${exclusionString}`
    )
    expectSoftly(sectionContents, 'FTR56 suitability- Are they serving sentence for terrorist or national security offence?').to.contain(
      `Are they serving a sentence for a terrorist or national security offence? ${exclusionString}`
    )
  } else {
    expectSoftly(sectionContents, 'FTR56 (Youth Flow) - suitability questions').to.contain(
      // This has been split up for readability's sake, template literals will cause unwanted spacing
      [
        'Is their MAPPA level 2 or 3? ',
        'Are they being recalled on account of being charged with an offence?  ',
        'Are they serving a sentence for offenders of particular concern (SOPC)? ',
        'Are they serving a Discretionary Conditional Release (DCR) sentence? ',
        'Were they referred to the Parole Board under section 244ZB (power to detain) on this sentence? ',
        'Have they been repatriated to the UK following a sentence for murder? ',
        'Are they MAPPA category 4? ',
        'Are they considered to be a person who may be at risk of involvement in foreign power threat activity? ',
        'Are they serving a sentence for a terrorist or national security offence?'
      ].join(''))
  }
}

export const q6OffenderDetails = function (
  contents: string,
  context: Record<string, string>,
  crn: string,
  dateOfRelease: Date
) {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[6]), contents.indexOf(partASections[7]))
  expectSoftly(contents, 'Offender-Full Name').to.contain(`Full name: ${context.fullName}`)
  expectSoftly(contents, 'Offender-Date of birth').to.contain(
    `Date of birth: ${changeDateFromLongFormatToShort(context.dateOfBirth)}`
  )
  expectSoftly(contents, 'Offender-Ethnicity').to.match(
    context.ethnicity
      ? new RegExp(`Ethnic category: ${context.ethnicity.replace(REGEXP_SPECIAL_CHAR, '\\$&')}`)
      : (apiDataForCrn.ethnicity as RegExp)
  )
  expectSoftly(contents, 'Offender-Written language').to.contain(`Written: ${context.writtenLanguage}`)
  expectSoftly(contents, 'Offender-Spoken language').to.contain(`Spoken: ${context.spokenLanguage}`)
  expectSoftly(contents, 'Offender-Gender').to.contain(`Gender: ${context.gender}`)
  expectSoftly(contents, 'Offender-CRN').to.contain(`CRN: ${crn}`)
  expectSoftly(contents, 'Offender-CRO').to.match(
    context.cro || context.cro === ''
      ? new RegExp(`CRO No: ${context.cro.replace(REGEXP_SPECIAL_CHAR, '\\$&')}`)
      : (apiDataForCrn.cro as RegExp)
  )
  expectSoftly(contents, 'Offender-PNC').to.match(
    context.pnc || context.pnc === ''
      ? new RegExp(`PNC No: ${context.pnc.replace(REGEXP_SPECIAL_CHAR, '\\$&')}`)
      : (apiDataForCrn.pnc as RegExp)
  )
  expectSoftly(contents, 'Offender-Prison Number').to.match(
    context.prisonNo || context.prisonNo === ''
      ? new RegExp(`Prison No: ${context.prisonNo.replace(REGEXP_SPECIAL_CHAR, '\\$&')}`)
      : (apiDataForCrn.prisonNo as RegExp)
  )
  expectSoftly(contents, 'Offender-Noms').to.match(
    context.noms || context.noms === ''
      ? new RegExp(`PNOMIS No: ${context.noms.replace(REGEXP_SPECIAL_CHAR, '\\$&')}`)
      : (apiDataForCrn.noms as RegExp)
  )
  expectSoftly(contents, 'Releasing prison or custodial establishment').to.contain(
    `Releasing prison/Custodial establishment: ${context.releasingPrison ? context.releasingPrison : ''}`
  )
  expectSoftly(contents, 'Release date').to.contain(
    `Date of Current Release: ${dateOfRelease ? DateTime.fromJSDate(dateOfRelease).toFormat('dd/MM/yyyy') : ''}`
  )
}

export const q7SentenceDetails = function (contents: string, context: Record<string, string>) {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[7]), contents.indexOf(partASections[8]))
  cy.log(`q7: ${JSON.stringify(context)} ${contents}`)
  expectSoftly(contents, 'Sentence Details-Index offence').to.contain(
    `Index offence of current sentence which has led to the offender’s recall: ${context.indexOffenceDescription}`
  )
  cy.log(`q7 from api-- ${apiDataForCrn.dateOfOriginalOffence}`)
  cy.log(`q7 from context---- ${context.dateOfOriginalOffence}`)

  expectSoftly(contents, 'Sentence Details-Dates of Original Offence').to.match(
    context.dateOfOriginalOffence
      ? new RegExp(
          `Date of original offence: \\t${changeDateFromLongFormatToShort(context.dateOfOriginalOffence).replace(
            REGEXP_SPECIAL_CHAR,
            '\\$&'
          )}`
        )
      : (apiDataForCrn.dateOfOriginalOffence as RegExp)
  )
  expectSoftly(contents, 'Sentence Details-Dates').to.match(
    context.dateOfSentence
      ? new RegExp(
          `Date of sentence: \\t${changeDateFromLongFormatToShort(context.dateOfSentence).replace(
            REGEXP_SPECIAL_CHAR,
            '\\$&'
          )}`
        )
      : (apiDataForCrn.dateOfSentence as RegExp)
  )
  expectSoftly(contents, 'Sentence Details-Length').to.match(
    context.lengthOfSentence
      ? new RegExp(`Length of sentence: \\t${context.lengthOfSentence.replace(REGEXP_SPECIAL_CHAR, '\\$&')}`)
      : (apiDataForCrn.lengthOfSentence as RegExp)
  )
  expectSoftly(contents, 'Sentence Details-Licence Expiry Date').to.match(
    // eslint-disable-next-line no-nested-ternary
    context.licenceExpiryDate === ''
      ? /Licence expiry date:/
      : context.licenceExpiryDate && context.licenceExpiryDate.length > 0
      ? new RegExp(
          `Licence expiry date: \\t${changeDateFromLongFormatToShort(context.licenceExpiryDate).replace(
            REGEXP_SPECIAL_CHAR,
            '\\$&'
          )}`
        )
      : (apiDataForCrn.licenceExpiryDate as RegExp)
  )
  expectSoftly(contents, 'Sentence Details-Sentence Expiry Date').to.match(
    // eslint-disable-next-line no-nested-ternary
    context.sentenceExpiryDate === ''
      ? /Sentence expiry date:/
      : context.sentenceExpiryDate && context.sentenceExpiryDate.length > 0
      ? new RegExp(
          `Sentence expiry date: \\t${changeDateFromLongFormatToShort(context.sentenceExpiryDate).replace(
            REGEXP_SPECIAL_CHAR,
            '\\$&'
          )}`
        )
      : (apiDataForCrn.sentenceExpiryDate as RegExp)
  )
  expectSoftly(contents, 'Sentence Details-Custodial Term').to.match(
    // eslint-disable-next-line no-nested-ternary
    context.custodialTerm === ''
      ? /Custodial term:/
      : context.custodialTerm && context.custodialTerm.length > 0
      ? new RegExp(`Custodial term: \\t${context.custodialTerm.replace(REGEXP_SPECIAL_CHAR, '\\$&')}`)
      : (apiDataForCrn.custodialTerm as RegExp)
  )
  expectSoftly(contents, 'Sentence Details-Extended Term').to.match(
    // eslint-disable-next-line no-nested-ternary
    context.extendedTerm === ''
      ? /Extended term:/
      : context.extendedTerm && context.extendedTerm.length > 0
      ? new RegExp(`Extended term: \\t${context.extendedTerm.replace(REGEXP_SPECIAL_CHAR, '\\$&')}`)
      : (apiDataForCrn.extendedTerm as RegExp)
  )
}

export const q8VLOContact = (contents: string, details) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[8]), contents.indexOf(partASections[9]))
  expectSoftly(contents, 'VLO status').to.contain(
    `Are any victim(s) eligible for the Victim Contact Scheme? ${YesNoNAType[details.inVLOScheme]}`
  )
  expectSoftly(contents, 'VLO Date').to.contain(
    `Date contact was made with the Victim Liaison Officer: ${
      details.vloDate
        ? formatObjectDateToLongFormat({
            day: details.vloDate.getDate().toString(),
            month: (details.vloDate.getMonth() + 1).toString(),
            year: details.vloDate.getFullYear().toString(),
          })
        : ''
    }`
  )
}

export const q9PoliceInformation = (
  contents: string,
  custodyStatus: string,
  localPoliceDetails: Record<string, string>,
  hasArrestIssues = '',
  arrestIssuesDetails = ''
) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[9]), contents.indexOf(partASections[10]))
  expectSoftly(contents, 'Custody Status').to.contain(
    `Is the offender currently in police custody or prison custody? ${custodyStatus}`
  )
  expectSoftly(contents, 'Arrests Police should be aware of').to.contain(
    `Are there any arrest issues of which police should be aware? ${hasArrestIssues}`
  )
  expectSoftly(contents, 'Additional arrests information').to.contain(
    `If yes, provide details below, including information about risks to staff, any children or vulnerable adults linked to any of the above addresses: ${arrestIssuesDetails}`
  )

  if (localPoliceDetails) {
    expectSoftly(contents, 'Local Police-Contact name').to.contain(
      `Police single point of contact name: ${localPoliceDetails.contact ?? ''}`
    )
    expectSoftly(contents, 'Local Police-Email').to.contain(`Email Address: ${localPoliceDetails.email ?? ''}`)
  }
}

// TODO not sure how to check address details (Q10), as they come from NDelius details, not from user input

export const q11Vulnerabilities = (contents: string, details: Record<string, string>[] | string[]) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[11]), contents.indexOf(partASections[12]))
  if (details && typeof details[0] === 'string') {
    if (details[0] === 'None') {
      expectSoftly(contents, 'Vulnerabilities status').to.contain(
        `Consider if you think this recall could affect any vulnerabilities or needs the offender may have No concerns about vulnerabilities or needs`
      )
      expectSoftly(contents, 'Vulnerabilities details').to.contain(`If yes, provide details:`)
    } else if (details[0] === 'Not known') {
      expectSoftly(contents, 'Vulnerabilities status').to.contain(
        `Consider if you think this recall could affect any vulnerabilities or needs the offender may have Do not know about vulnerabilities or needs`
      )
      expectSoftly(contents, 'Vulnerabilities details').to.contain(`If yes, provide details:`)
    }
  } else if (details && typeof details[0] === 'object') {
    details.forEach(detail => {
      expectSoftly(contents, 'Vulnerabilities status').to.contain(
        `Consider if you think this recall could affect any vulnerabilities or needs the offender may have Yes, has vulnerabilities or needs`
      )
      expectSoftly(contents, 'Vulnerabilities details').to.contain(
        `${detail.vulnerabilityName}:${detail.vulnerabilityNotes}`
      )
    })
  }
}

export const q12Contraband = (contents: string, details: Record<string, string>) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[12]), contents.indexOf(partASections[13]))
  expectSoftly(contents, 'Contraband risk').to.contain(
    `Do you have any suspicions that the offender is using recall to bring contraband into the prison estate? ${
      YesNoType[details.hasRisk]
    }`
  )
  expectSoftly(contents, 'Contraband details').to.contain(`If yes, provide details: ${details.riskDetails ?? ''}`)
}

export const q13MappaDetails = (contents: string, details?: Record<string, string>) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[13]), contents.indexOf(partASections[14]))
  expectSoftly(contents, 'MAPPA Category').to.match(
    details
      ? new RegExp(`MAPPA Category: ${details.mappaCategory.replace(REGEXP_SPECIAL_CHAR, '\\$&')}`)
      : (apiDataForCrn.mappaCategory as RegExp)
  )
  expectSoftly(contents, 'MAPPA Level').to.match(
    details
      ? new RegExp(`MAPPA Level: ${details.mappaLevel.replace(REGEXP_SPECIAL_CHAR, '\\$&')}`)
      : (apiDataForCrn.mappaLevel as RegExp)
  )
}

export const q14RoshLevels = (contents: string, details?: Record<string, string>) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[14]), contents.indexOf(partASections[15]))
  expectSoftly(contents, 'ROSH Level-Risk to public').to.contain(
    `Public: ${
      details?.riskToPublic ? ROSHLevels[details.riskToPublic] : apiDataForCrn.currentRoshForPartA.riskToPublic
    }`
  )
  expectSoftly(contents, 'ROSH Level-Risk to Known Adult').to.contain(
    `Known Adult: ${
      details?.riskToKnownAdult
        ? ROSHLevels[details.riskToKnownAdult]
        : apiDataForCrn.currentRoshForPartA.riskToKnownAdult
    }`
  )
  expectSoftly(contents, 'ROSH Level-Risk to Known Children').to.contain(
    `Children: ${
      details?.riskToChildren ? ROSHLevels[details.riskToChildren] : apiDataForCrn.currentRoshForPartA.riskToChildren
    }`
  )
  expectSoftly(contents, 'ROSH Level-Prisoners value').to.contain(
    `Prisoners: ${details?.riskToPrisoner ? ROSHLevels[details.riskToPrisoner] : 'N/A'}`
  )
  expectSoftly(contents, 'ROSH Level-Risk to Staff').to.contain(
    `Staff: ${details?.riskToStaff ? ROSHLevels[details.riskToStaff] : 'Very High'}`
  ) // case doesn't match with value in apiDataForCrn.currentRoshForPartA.riskToPublic
}

export const q15IndexOffenceDetails = (contents: string, answer: string = apiDataForCrn.offenceAnalysis) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[15]), contents.indexOf(partASections[16]))
  expectSoftly(contents, 'Offence Analysis').to.contain(answer)
}

export const q16LicenceConditions = (contents: string, details: string[]) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[16]), contents.indexOf(partASections[17]))
  Object.keys(LicenceConditions).forEach(licenceCondition => {
    expectSoftly(contents, 'Licence Conditions').to.contain(
      `${details.includes(licenceCondition) ? '☒' : '☐'} ${LicenceConditions[licenceCondition]}`
    )
  })
}

export const q17AdditionalConditions = (contents: string, details: string[]) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[17]), contents.indexOf(partASections[18]))
  details.forEach(detail => {
    expectSoftly(contents, 'Additional Licence Conditions').to.contain(detail)
  })
}

export const q18CircumstancesLeadingToRecall = (contents: string, details: string) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[18]), contents.indexOf(partASections[19]))
  expectSoftly(contents, 'Circumstance leading to recall').to.contain(details)
}

export const q19Alternatives = (contents: string, details: Record<string, string>[] | string[]) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[19]), contents.indexOf(partASections[20]))
  if (details && typeof details[0] === 'object') {
    details.forEach(detail => {
      expectSoftly(contents, 'Alternatives').to.contain(
        `${Alternatives[detail.alternativeName]}${detail.alternativeNotes}`
      )
    })
  } else if (details && typeof details[0] === 'string') {
    Object.keys(Alternatives).forEach(alternativeName => {
      expectSoftly(contents, 'Alternatives').to.match(
        new RegExp(`${Alternatives[alternativeName].replace(REGEXP_SPECIAL_CHAR, '\\$&')}[^\\s]`)
      )
    })
  }
}

export const q20RecallType = (contents: string, details: Record<string, any>) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[20]), contents.indexOf(partASections[21]))
  if (details.sentenceGroup !== SentenceGroup.INDETERMINATE && details.sentenceGroup !== SentenceGroup.EXTENDED) {
    // eslint-disable-next-line no-param-reassign
    details.type = NonIndeterminateRecallType[details.recallType]
    if (details.partARecallReason) {
      // eslint-disable-next-line no-param-reassign
      details.reason = details.partARecallReason
    } else {
      if (details.recallType === 'STANDARD') {
        // eslint-disable-next-line no-param-reassign
        details.reason = `${details.offenderDetails.fullName} must get a standard recall as they are excluded from getting a fixed term.`
      }
      if (details.recallType === 'FIXED_TERM') {
        // eslint-disable-next-line no-param-reassign
        details.reason = `${details.offenderDetails.fullName} must get a fixed term recall as they do not meet the exclusion criteria.`
      }
    }
  } else if (details.sentenceGroup === SentenceGroup.EXTENDED) {
    // eslint-disable-next-line no-param-reassign
    details.type = 'N/A (extended sentence recall)'
    // eslint-disable-next-line no-param-reassign
    details.reason = 'N/A (extended sentence recall)'
  } else if (details.sentenceGroup === SentenceGroup.INDETERMINATE) {
    // eslint-disable-next-line no-param-reassign
    details.type = 'N/A (not a determinate recall)'
    // eslint-disable-next-line no-param-reassign
    details.reason = 'N/A (not a determinate recall)'
  }
  expectSoftly(contents, 'Recall Type').to.contain(`Proposed recall type: ${details.type}`)
  expectSoftly(contents, 'Recall Type Reason').to.contain(`Explain the reasons for the recall type: ${details.reason}`)
}

export const q21LicenceConditionsToAdd = (contents: string, details: Record<string, string>) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[21]), contents.indexOf(partASections[22]))
  expectSoftly(contents, 'Licence Conditions to Add').to.contain(
    // eslint-disable-next-line no-nested-ternary
    details.recallType === 'STANDARD' && details.sentenceGroup === SentenceGroup.EXTENDED
      ? 'N/A (extended sentence recall)'
      : /* eslint-disable-next-line no-nested-ternary */
      details.recallType === 'STANDARD'
      ? 'N/A (standard recall)'
      : /* eslint-disable-next-line no-nested-ternary */
      details.recallType === 'FIXED_TERM' && details.fixedTermRecall === 'NO'
      ? ''
      : /* eslint-disable-next-line no-nested-ternary */
      details.sentenceGroup === SentenceGroup.INDETERMINATE
      ? 'N/A (not a determinate recall)'
      : details.sentenceGroup === SentenceGroup.EXTENDED
      ? 'N/A (extended sentence recall)'
      : details.fixedTermRecallNotes
  )
}

export const q22IndeterminateAndExtendedSentenceCircumstances = (contents: string, details: Record<string, string>) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[22]), contents.indexOf(partASections[23]))
  if (details) {
    Object.keys(IndeterminateOrExtendedSentenceDetailType).forEach(k => {
      if (details[k]) {
        expectSoftly(contents, `${k} Yes/No`).to.contain(`${IndeterminateOrExtendedSentenceDetailType[k]} Yes`)
        expectSoftly(contents, `${k} comments`).to.contain(`Provide details: ${details[k]}`)
      } else expectSoftly(contents, `${k} Yes/No`).to.contain(`${IndeterminateOrExtendedSentenceDetailType[k]} No`)
    })
    if (details.OUT_OF_TOUCH) {
      expectSoftly(contents, 'Out of Touch details').to.contain(
        `Where the offender is out of touch or their whereabouts is unknown, provide details on why the assumption can be made that (i), (ii) or (iii) may arise? ${details.OUT_OF_TOUCH}`
      )
    }
  }
}

export const q23ProbationDetailsWithCaseAdmin = (
  contents: string,
  whoCompletedPartADetails: Record<string, string>,
  probationPractitionerForPartADetails: Record<string, string>,
  date: Record<string, string>
) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[23]), contents.indexOf(partASections[24]))
  expectSoftly(contents, 'Probation-Officer-Name').to.contain(
    `Name of Probation Practitioner: ${probationPractitionerForPartADetails.name}`
  )
  expectSoftly(contents, 'Probation-Officer-Telephone').to.contain(
    `Telephone Number: ${probationPractitionerForPartADetails.telephone}`
  )
  expectSoftly(contents, 'Probation-Officer-Email').to.contain(
    `Email Address: ${probationPractitionerForPartADetails.email}`
  )
  expectSoftly(contents, 'Report-Author-Name').to.contain(
    `Name of Report Author (if different): ${whoCompletedPartADetails.name}`
  )
  expectSoftly(contents, 'Probation-Officer-Telephone').to.contain(
    `Report Author’s Telephone Number: ${whoCompletedPartADetails.telephone}`
  )
  expectSoftly(contents, 'Probation-Officer-Email').to.contain(
    `Report Author’s Email Address: ${whoCompletedPartADetails.email}`
  )
  expectSoftly(contents, 'Probation-Officer-Region').to.contain(`Region: ${whoCompletedPartADetails.region}`)
  expectSoftly(contents, 'Probation-Officer-LDU').to.contain(`LDU: ${whoCompletedPartADetails.LDU}`)
  expectSoftly(contents, 'Probation-Date of Decision').to.contain(
    `Date of decision to request revocation: ${DateTime.fromJSDate(date.recallDateBySPO as unknown as Date).toFormat(
      'dd/MM/yyyy'
    )}`
  )
  // TODO check PPCS responses e-mail address once task-list-consider-recall changes merged

  expectSoftly(contents, 'Probation-Time of Decision').to.contain(
    `Time (24 hour) of decision to request information: ${DateTime.fromJSDate(
      date.recallDateBySPO as unknown as Date
    ).toFormat('HH:mm')}`
  )
}

export const q24SPOEndorsement = function (
  contents: string,
  details: Record<string, string>,
  dateSPOAgreedRecall: Date
) {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[24]), contents.indexOf(partASections[25]))
  cy.log(`Q24: ${JSON.stringify(details)} ${contents}`)
  expectSoftly(contents, 'SPO Reason').to.contain(`Please provide your view on the recall:${details.reason}`)
  expectSoftly(contents, 'SPO Name').to.contain(`Name of person completing this form: ${this.SPO ? this.SPO.name : ''}`)
  expectSoftly(contents, 'SPO Email').to.contain(`Email address: ${this.SPO ? this.SPO.email : ''}`)
  expectSoftly(contents, 'SPO Telephone').to.contain(`Telephone Number: ${details.telephone ? details.telephone : ''}`)
  expectSoftly(contents, 'SPO Date and time of endorsement').to.contain(
    `Date and time (24 hour) SPO initiated the recall request: ${DateTime.fromJSDate(dateSPOAgreedRecall).toFormat(
      'dd/MM/yyyy HH:mm'
    )}`
  )
  // We don't check the date and time of countersignature, as they vary with each run and aren't accessible from the UI
}

export const q25ACOAuthorisation = function (contents: string, details: Record<string, string>) {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[25]), contents.indexOf(partASections[26]))
  cy.log(`Q25: ${JSON.stringify(details)} ${contents}`)
  expectSoftly(contents, 'ACO Reason').to.contain(`Provide details ${details.reason}`)
  expectSoftly(contents, 'ACO Name').to.contain(`Name of person completing this form: ${this.ACO ? this.ACO.name : ''}`)
  expectSoftly(contents, 'ACO Telephone').to.contain(`Telephone Number: ${details.telephone ? details.telephone : ''}`)
  expectSoftly(contents, 'ACO Email').to.contain(`Email Address: ${this.ACO ? this.ACO.email : ''}`)
  // We don't check the date and time of countersignature, as they vary with each run and aren't accessible from the UI
}

export const q26Attachments = (contents: string, details: Record<string, string>[] | string) => {
  // eslint-disable-next-line no-param-reassign
  contents = contents.substring(contents.indexOf(partASections[29]))
  cy.log(`Q26: ${JSON.stringify(details)} ${contents}`)
}
