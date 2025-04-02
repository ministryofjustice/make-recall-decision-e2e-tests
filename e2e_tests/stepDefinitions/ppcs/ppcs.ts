import { YESNONA } from "../../utils/standardTypes"

// TODO it would be nice to pull these from source as a future improvement
type OptionValue = { text: string, value: string }

export const licenseConditionsStandard: OptionValue[] = [
    { text: "Be of good behaviour and not behave in a way which undermines the purpose of the licence period", value: "GOOD_BEHAVIOUR" },
    { text: "Not commit any offence", value: "NO_OFFENCE" },
    { text: "Keep in touch with the supervising officer in accordance with instructions given by the supervising officer", value: "KEEP_IN_TOUCH" },
    { text: "Receive visits from the supervising officer in accordance with instructions given by the supervising officer", value: "SUPERVISING_OFFICER_VISIT" },
    { text: "Reside permanently at an address approved by the supervising officer and obtain the prior permission of the supervising officer for any stay of one or more nights at a different address", value: "ADDRESS_APPROVED" },
    { text: "Not undertake work, or a particular type of work, unless it is approved by the supervising officer and notify the supervising officer in advance of any proposal to undertake work or a particular type of work", value: "NO_WORK_UNDERTAKEN" },
    { text: "Not travel outside the United Kingdom, the Channel Islands or the Isle of Man except with the prior permission of your supervising officer or for the purposes of immigration deportation or removal", value: "NO_TRAVEL_OUTSIDE_UK" },
    { text: "Tell your supervising officer if you use a name which is different to the name or names which appear on your licence", value: "NAME_CHANGE" },
    { text: "Tell your supervising officer if you change or add any contact details, including phone number or email", value: "CONTACT_DETAILS" }
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
    { text: "Detention for Public Protection (DPP) sentence", value: "DPP" }
]

export const recallTypes: OptionValue[] = [
    { text: "Standard recall", value: "STANDARD" },
    { text: "No recall", value: "NO_RECALL" }
]

export const indeterminateOrExtendedSentenceDetails: OptionValue[] = [
    { text: "{{ fullName }} has shown behaviour similar to the index offence", value: "BEHAVIOUR_SIMILAR_TO_INDEX_OFFENCE" },
    { text: "{{ fullName }} has shown behaviour that could lead to a sexual or violent offence", value: "BEHAVIOUR_LEADING_TO_SEXUAL_OR_VIOLENT_OFFENCE" },
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