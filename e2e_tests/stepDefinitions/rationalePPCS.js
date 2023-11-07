import { Given, Then, DataTable, When } from '@badeball/cypress-cucumber-preprocessor'
import { faker } from '@faker-js/faker/locale/en_GB'
import { proxy } from '@alfonso-presa/soft-assert'
import {
    appointmentDate,
    appointmentOptions,
    futureActionDetails,
    letterSubject,
    licenceBreachDetails,
    licenceBreachExplanation,
    noRecallReasonDetails,
    offendersPhoneNumber,
    progressDetails,
    whyRecall,
} from './assertionsDNTR'

import { crns, deleteOpenRecommendation } from './index'

import {
    IndeterminateOrExtendedSentenceDetailType,
    IndeterminateRecallType,
    NonIndeterminateRecallType,
    YesNoType,
    CustodyType,
    YesNoNAType,
    Vulnerabilities,
    ROSHLevels,
    WhyConsiderRecall,
    ApptOptions,
    Regions,
} from '../support/enums'
import { formatDateToCompletedDocumentFormat } from '../utils'
import expect from "expect";
import {UserType} from "../support/commands";

const expectSoftly = proxy(expect)


