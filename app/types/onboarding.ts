export interface School {
  id: string;
  name: string;
  shortName?: string;
}

export interface Department {
  id: string;
  name: string;
}

export type InterestCategory =
  | "ACADEMICS"
  | "CAREER_SKILLS"
  | "LIFESTYLE"
  | "CREATIVITY"
  | "ENTERTAINMENT"
  | "READING";

export interface Interest {
  id: string;
  name: string;
  category: InterestCategory;
  icon?: string;
}

export type InterestsResponse = Record<InterestCategory, Interest[]>;

export interface OnboardingCompleteRequest {
  schoolId: string;
  departmentId: string;
  interestIds: string[];
}

export interface OnboardingCompleteResponse {
  message: string;
  user: {
    id: string;
    onboardingCompleted: boolean;
  };
}
