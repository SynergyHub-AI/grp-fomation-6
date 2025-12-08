export type User = {
  id: string;
  name: string;
  email: string;
  bio: string;
  skills: Skill[];
  interests: string[];
  availability: 'Part-time' | 'Full-time' | 'Flexible';
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  avatarUrl: string;
};

export type Skill = {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  mode: 'Expert' | 'Learner';
  verification: {
    type: 'Link' | 'Self-Declared';
    url?: string;
  };
};

export type Project = {
  id: string;
  creatorId: string;
  title: string;
  type: 'Hackathon' | 'NGO' | 'Startup' | 'Social';
  description: string;
  requiredSkills: string[];
  requiredRoles: ('Team Lead' | 'Developer' | 'Designer' | 'Operations')[];
  teamSize: number;
  timeCommitment: 'Part-time' | 'Full-time';
  location?: string;
  team: TeamMember[];
  joinRequests: JoinRequest[];
  status: 'Active' | 'Inactive' | 'Completed';
  createdAt: Date;
};

export type TeamMember = {
  userId: string;
  role: 'Team Lead' | 'Developer' | 'Designer' | 'Operations' | 'Learner';
  isLearner: boolean;
};

export type JoinRequest = {
  id: string;
  userId: string;
  projectId: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  timestamp: Date;
};

export type RecommendedProject = {
  project: Project;
  matchPercentage: number;
  role: 'Expert' | 'Learner';
};

export type RecommendedCandidate = {
  user: User;
  matchPercentage: number;
  reasoning: string;
};
