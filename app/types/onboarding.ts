export interface School {
  id: string;
  name: string;
  shortName?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Interest {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export interface InterestsResponse {
  [category: string]: Interest[];
}

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
