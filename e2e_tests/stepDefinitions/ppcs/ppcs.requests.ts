import { faker } from "@faker-js/faker";
import { CreateRecommendationRequest, UpdateRecommendationRequest, UpdateRecommendationStatusRequest } from "../../utils/recommendations/recommendations";
import * as OPTIONS from "./ppcs";
import { RECOMMENDATION_STATUSES } from "../../utils/recommendations/recommendationStatuses";
import { YESNONA } from "../../utils/standardTypes";

export const createRecommendationRequest: (crn: string) => CreateRecommendationRequest = (crn) => ({
        crn: crn, //TODO V2: toggle and crns for Dev/Pre prod that works for other services
})

export const initialRecomendationRequest: () => UpdateRecommendationRequest = () => ({
    triggerLeadingToRecall: faker.lorem.paragraphs(),
    responseToProbation: faker.lorem.paragraph(),
    licenceConditionsBreached: {
        standardLicenceConditions: {
            selected: faker.helpers.arrayElements(OPTIONS.licenseConditionsStandard).map(l => l.value),
            allOptions: OPTIONS.licenseConditionsStandard
        },
        additionalLicenceConditions: {
            selected: null,
            allOptions: OPTIONS.licenseConditionsAdditional,
            selectedOptions: faker.datatype.boolean()
                ? faker.helpers.arrayElements(OPTIONS.licenseConditionsAdditional).map(l => ({ subCatCode: l.subCatCode, mainCatCode: l.mainCatCode }))
                : []
        }
    },
    additionalLicenceConditionsText: faker.lorem.sentences(),
    alternativesToRecallTried: {
        selected: faker.helpers.arrayElements(OPTIONS.alternativesToRecallTried).map(a => ({
            value: a.value,
            details: faker.lorem.sentence()
        })),
        allOptions: OPTIONS.alternativesToRecallTried
    },
    isIndeterminateSentence: true,
    isExtendedSentence: false,
    indeterminateSentenceType: {
        selected: faker.helpers.arrayElement(OPTIONS.indeterminateSentenceTypes).value,
        allOptions: OPTIONS.indeterminateSentenceTypes
    },
    activeCustodialConvictionCount: 1
})

export const startRecallRecommendationStatusRequest: () => UpdateRecommendationStatusRequest = () => ({
            activate: [RECOMMENDATION_STATUSES.PO_START_RECALL],
            deActivate: []
})

export const postPORecallRecommendationRequest: () => UpdateRecommendationRequest = () => {
    const decisionDateTime = faker.date.recent(7) // Some time within the last week
    const decisionDateTimeReduced = [
        decisionDateTime.getFullYear(),
        decisionDateTime.getMonth() + 1,
        decisionDateTime.getDate(),
        decisionDateTime.getHours(),
        decisionDateTime.getMinutes()
    ]
    cy.log(decisionDateTime.toString(), decisionDateTimeReduced.reduce((a, b) => `${a} - ${b}`, "=> "))
    let selectedVulnerabilities: { value: string, details?: string}[]
    switch(faker.datatype.number({ min: 1, max: 3})) {
        case 1:
            selectedVulnerabilities = [{
                value: OPTIONS.vulnerabilities[0].value
            }];
        case 2:
            selectedVulnerabilities = [{
                value: OPTIONS.vulnerabilities[1].value
            }]
        default:
            selectedVulnerabilities =
                faker.helpers.arrayElements(OPTIONS.vulnerabilities.slice(2)).map(v => ({
                    value: v.value,
                    details: faker.lorem.sentence()
                }))
    }

    return {
        recallType: {
            selected: {
                value: "STANDARD",
            },
            allOptions: OPTIONS.recallTypes
        },
        isThisAnEmergencyRecall: true,
        indeterminateOrExtendedSentenceDetails: {
            selected: faker.helpers.arrayElements(OPTIONS.indeterminateOrExtendedSentenceDetails).map(a => ({
                value: a.value,
                details: faker.lorem.sentence()
            })),
            allOptions: OPTIONS.indeterminateOrExtendedSentenceDetails
        },
        custodyStatus: {
            selected: 'YES_PRISON',
            allOptions: OPTIONS.custodyStatus
        },
        decisionDateTime: decisionDateTimeReduced,
        whatLedToRecall: faker.lorem.sentences(),
        hasBeenReviewed: {
            personOnProbation: true,
            convictionDetail: true,
            mappa: true
        },
        offenceAnalysis: faker.lorem.sentence(),
        previousReleases: {
            hasBeenReleasedPreviously: false
        },
        previousRecalls: {
            hasBeenRecalledPreviously: false
        },
        vulnerabilities: {
            selected: selectedVulnerabilities,
            allOptions: OPTIONS.vulnerabilities
        },
        hasVictimsInContactScheme: {
            selected: YESNONA.notApplicable,
            allOptions: OPTIONS.YESNONAOptions
        },
        localPoliceContact: {
            faxNumber: "",
            contactName: faker.name.fullName(),
            phoneNumber: faker.phone.number(),
            emailAddress: faker.internet.email()
        },
        isUnderIntegratedOffenderManagement : {
            selected: YESNONA.notApplicable,
            allOptions: OPTIONS.YESNONAOptions
        },
        hasContrabandRisk: {
            selected: false
        },
        currentRoshForPartA: {
            riskToStaff: faker.helpers.arrayElement(OPTIONS.roshOptions),
            riskToPublic: faker.helpers.arrayElement(OPTIONS.roshOptions),
            riskToChildren: faker.helpers.arrayElement(OPTIONS.roshOptions),
            riskToPrisoners: faker.helpers.arrayElement(OPTIONS.roshOptions),
            riskToKnownAdult: faker.helpers.arrayElement(OPTIONS.roshOptions)
        },
        whoCompletedPartA: {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            region: 'N54',
            telephone: faker.phone.number(),
            localDeliveryUnit: faker.lorem.word(),
            isPersonProbationPractitionerForOffender: true
        },
        revocationOrderRecipients: [faker.internet.email()],
        ppcsQueryEmails: [faker.internet.email()]
    }
}

export const recordDecisionRecommendationRequest: () => UpdateRecommendationRequest = () => ({
    reviewPractitionersConcerns: true,
    reviewOffenderProfile: true,
    spoRecallType: 'RECALL',
    explainTheDecision: true,
    spoRecallRationale: faker.lorem.sentence()
})

export const spoSignatureRequestStatusRequest: () => UpdateRecommendationStatusRequest = () => ({
        activate: [RECOMMENDATION_STATUSES.SPO_SIGNATURE_REQUESTED],
        deActivate: []
})