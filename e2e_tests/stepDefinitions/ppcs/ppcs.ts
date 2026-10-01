import { YESNONA } from "../../utils/standardTypes"

// TODO it would be nice to pull these from source as a future improvement
type OptionValue = { text: string, value: string }

export const licenseConditionsStandard: OptionValue[] = [
    { value: 'GOOD_BEHAVIOUR', text: 'Behave well in a way that supports the purpose of you being on licence, and do not commit any crime.' },
    { value: 'KEEP_IN_TOUCH', text: 'Keep in touch and meet with your supervising officer in the way they tell you to. This includes meeting them where you live.'},
    { value: 'ADDRESS_APPROVED', text: 'Get permission from your supervising officer to stay at an address and if you want to stay somewhere else for one or more nights.' },
    { value: 'NO_WORK_UNDERTAKEN', text: 'Tell your supervising officer about any new work, or a type of work, you want to do. Get their approval before you start this work.' },
    { value: 'NO_TRAVEL_OUTSIDE_UK', text: 'Get permission from your supervising officer if you want to leave the United Kingdom, Isle of Man or the Channel Islands. This does not apply if you are being deported or removed for immigration purposes.' },
    { value: 'NAME_CHANGE', text: 'Tell your supervising officer about any names you use that are different to the names on this licence.' },
    { value: 'CONTACT_DETAILS', text: 'Inform your supervising officer if your contact details change. For example, your phone number or email address.'},
    { value: 'PASSPORT_DETAILS', text: 'Get permission from your supervising officer if you want to apply for a new passport. If requested, tell your supervising officer about any passports you have already.' }
]

export const licenseConditionsAdditional : { note: string, title: string, details: string, subCatCode: string, mainCatCode: string }[] = [
    {
        note: null,
        title: "Freedom of movement",
        details: "To only attend places of worship which have been previously agreed with your supervising officer.",
        subCatCode: "NSTT8",
        mainCatCode: "NLC8"
    }
]

export const alternativesToRecallTried: OptionValue[] = [
    { text: "None", value: "NONE" },
    { text: "Warnings / licence breach letters", value: "WARNINGS_LETTER" },
    { text: "Increased frequency of reporting", value: "INCREASED_FREQUENCY" },
    { text: "Additional licence conditions", value: "EXTRA_LICENCE_CONDITIONS" },
    { text: "Referral to other teams (e.g. IOM, MAPPA, Gangs Unit)", value: "REFERRAL_TO_OTHER_TEAMS" },
    { text: "Referral to partnership agencies", value: "REFERRAL_TO_PARTNERSHIP_AGENCIES" },
    { text: "Referral to approved premises", value: "REFERRAL_TO_APPROVED_PREMISES" },
    { text: "Drug testing", value: "DRUG_TESTING" },
    { text: "Other", value: "ALTERNATIVE_TO_RECALL_OTHER" }
]

export const indeterminateSentenceTypes: OptionValue[] = [
    { text: "Life sentence", value: "LIFE" },
    { text: "Imprisonment for Public Protection (IPP) sentence", value: "IPP" },
    { text: "Detention for Public Protection (DPP) sentence", value: "DPP" },
    { text: "Detention at His Majesty’s pleasure", value: "DHMP" },
]

export const recallTypes: OptionValue[] = [
    { text: "Standard recall", value: "STANDARD" },
    { text: "No recall", value: "NO_RECALL" }
]

export const indeterminateOrExtendedSentenceDetails: OptionValue[] = [
    { text: "{{ fullName }} has shown behaviour similar to the index offence", value: "BEHAVIOUR_SIMILAR_TO_INDEX_OFFENCE" },
    { text: "{{ fullName }} has shown behaviour that could lead to a sexual or violent offence", value: "BEHAVIOUR_LEADING_TO_SEXUAL_OR_VIOLENT_OFFENCE" },
    { text: "{{ fullName }} has shown behaviour likely to result in a sexual or violent offence, or that could be associated with committing one", value: "BEHAVIOUR_LIKELY_TO_RESULT_SEXUAL_OR_VIOLENT_OFFENCE" },
    { text: "{{ fullName }} is out of touch", value: "OUT_OF_TOUCH" }
]

export const custodyStatus: OptionValue[] = [
    { text: "Yes, prison custody", value: "YES_PRISON" },
    { text: "Yes, police custody", value: "YES_POLICE" },
    { text: "No", value: "NO" }
]

export const vulnerabilities: OptionValue[] = [
    { text: "None", value: "NONE" },
    { text: "Not known", value: "NOT_KNOWN" },
    { text: "Risk of suicide or self-harm", value: "RISK_OF_SUICIDE_OR_SELF_HARM" },
    { text: "Relationship breakdown", value: "RELATIONSHIP_BREAKDOWN" },
    { text: "Domestic abuse", value: "DOMESTIC_ABUSE" },
    { text: "Drug or alcohol abuse", value: "DRUG_OR_ALCOHOL_USE" },
    { text: "Bullying others", value: "BULLYING_OTHERS" },
    { text: "Being bullied by others", value: "BEING_BULLIED_BY_OTHERS" },
    { text: "Being at risk of serious harm from others", value: "BEING_AT_RISK_OF_SERIOUS_HARM_FROM_OTHERS" },
    { text: "Adult or child safeguarding concerns", value: "ADULT_OR_CHILD_SAFEGUARDING_CONCERNS" },
    { text: "Mental health concerns", value: "MENTAL_HEALTH_CONCERNS" },
    { text: "Physical health concerns", value: "PHYSICAL_HEALTH_CONCERNS" },
    { text: "Medication taken, including compliance with medication", value: "MEDICATION_TAKEN_INCLUDING_COMPLIANCE_WITH_MEDICATION" },
    { text: "Bereavement issues", value: "BEREAVEMENT_ISSUES" },
    { text: "Learning difficulties", value: "LEARNING_DIFFICULTIES" },
    { text: "Physical disabilities", value: "PHYSICAL_DISABILITIES" },
    { text: "Cultural or language differences", value: "CULTURAL_OR_LANGUAGE_DIFFERENCES" }
]

export const roshOptions: string[] = ['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH', 'NOT_APPLICABLE']

export const YESNONAOptions: OptionValue[] = [
    { text: "Yes", value: YESNONA.yes },
    { text: "No", value: YESNONA.no },
    { text: "Not applicable", value: YESNONA.notApplicable }
]