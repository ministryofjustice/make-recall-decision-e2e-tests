// Partial definition of the API recommendation, expand as necceasary to retrieve required elements
export type Recommendation = {
  id: number
}

export type CreateRecommendationRequest = {
    crn?: string;
};

export type UpdateRecommendationRequest = Record<string, any>

export type UpdateRecommendationStatusRequest = {
  activate: string[],
  deActivate: string[]
}

export type FeatureFlags = {
  [key: string]: boolean
}