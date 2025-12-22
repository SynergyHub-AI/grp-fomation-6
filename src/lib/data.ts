import type { User, Project, JoinRequest, Skill } from './types';
import { PlaceHolderImages } from './placeholder-images';

const avatar1 = PlaceHolderImages.find((img) => img.id === 'avatar1')?.imageUrl || '';
const avatar2 = PlaceHolderImages.find((img) => img.id === 'avatar2')?.imageUrl || '';
const avatar3 = PlaceHolderImages.find((img) => img.id === 'avatar3')?.imageUrl || '';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    jobTitle: 'Senior Full Stack Developer',
    bio: 'Full-stack developer with a passion for open-source and AI. Looking to contribute to impactful projects.',
    skills: [
      { id: 'skill-1', name: 'React', level: 'Advanced', mode: 'Expert', verification: { type: 'Link', url: 'https://github.com' } },
      { id: 'skill-2', name: 'Node.js', level: 'Advanced', mode: 'Expert', verification: { type: 'Self-Declared' } },
      { id: 'skill-3', name: 'Python', level: 'Intermediate', mode: 'Expert', verification: { type: 'Self-Declared' } },
      { id: 'skill-4', name: '3D Modeling', level: 'Beginner', mode: 'Learner', verification: { type: 'Self-Declared' } },
    ],
    interests: ['AI/ML', 'Web Development', 'Social Impact'],
    availability: 'Part-time',
    experienceLevel: 'Advanced',
    avatarUrl: avatar1,
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      portfolio: "https://example.com"
    }
  },
  {
    id: 'user-2',
    name: 'Brenda Smith',
    email: 'brenda.smith@example.com',
    bio: 'UX/UI Designer focused on creating intuitive and beautiful user experiences. Eager to learn front-end development.',
    skills: [
      { id: 'skill-5', name: 'Figma', level: 'Advanced', mode: 'Expert', verification: { type: 'Link', url: 'https://behance.net' } },
      { id: 'skill-6', name: 'User Research', level: 'Intermediate', mode: 'Expert', verification: { type: 'Self-Declared' } },
      { id: 'skill-7', name: 'HTML/CSS', level: 'Intermediate', mode: 'Expert', verification: { type: 'Self-Declared' } },
      { id: 'skill-8', name: 'React', level: 'Beginner', mode: 'Learner', verification: { type: 'Self-Declared' } },
    ],
    interests: ['Design Systems', 'Accessibility', 'SaaS'],
    availability: 'Full-time',
    experienceLevel: 'Intermediate',
    avatarUrl: avatar2,
  },
  {
    id: 'user-3',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    bio: 'Student and aspiring developer. Excited to gain real-world experience and contribute to a team.',
    skills: [
      { id: 'skill-9', name: 'Java', level: 'Intermediate', mode: 'Learner', verification: { type: 'Self-Declared' } },
      { id: 'skill-10', name: 'Project Management', level: 'Beginner', mode: 'Learner', verification: { type: 'Self-Declared' } },
    ],
    interests: ['Mobile Development', 'Hackathons', 'Startups'],
    availability: 'Flexible',
    experienceLevel: 'Beginner',
    avatarUrl: avatar3,
  },
];

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    creatorId: 'user-2',
    title: 'EcoTrack - Sustainability App',
    type: 'NGO',
    description: 'A mobile app to help users track and reduce their carbon footprint through daily challenges and community engagement.',
    requiredSkills: ['React Native', 'Firebase', 'UX/UI Design', 'Node.js'],
    requiredRoles: ['Developer', 'Designer'],
    teamSize: 4,
    timeCommitment: 'Part-time',
    location: 'Remote',
    team: [{ userId: 'user-2', role: 'Designer', isLearner: false }],
    joinRequests: [],
    status: 'Active',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 'proj-2',
    creatorId: 'user-1',
    title: 'AI-Powered Code Reviewer',
    type: 'Startup',
    description: 'A VS Code extension that uses AI to provide intelligent feedback on code quality, style, and potential bugs.',
    requiredSkills: ['Python', 'TypeScript', 'AI/ML', 'VS Code API'],
    requiredRoles: ['Developer', 'Team Lead'],
    teamSize: 3,
    timeCommitment: 'Full-time',
    team: [{ userId: 'user-1', role: 'Team Lead', isLearner: false }],
    joinRequests: [],
    status: 'Active',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 'proj-3',
    creatorId: 'user-404', // A non-existent user for demo
    title: 'Hackathon Project: HealthConnect',
    type: 'Hackathon',
    description: 'A platform to connect patients with rare diseases for support and information sharing. Built for the "Health for All" hackathon.',
    requiredSkills: ['React', 'Web Sockets', 'Figma', 'Project Management'],
    requiredRoles: ['Developer', 'Designer', 'Operations'],
    teamSize: 5,
    timeCommitment: 'Part-time',
    team: [],
    joinRequests: [],
    status: 'Active',
    createdAt: new Date(),
  },
];

export const mockJoinRequests: JoinRequest[] = [
  {
    id: 'req-1',
    userId: 'user-1',
    projectId: 'proj-3',
    status: 'Pending',
    timestamp: new Date(),
  },
  {
    id: 'req-2',
    userId: 'user-1',
    projectId: 'proj-1',
    status: 'Accepted',
    timestamp: new Date(),
  },
];

export const demoUser = mockUsers[0];
