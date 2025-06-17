
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePhoto: string;
  skills: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    color: string;
  }>;
  experienceLevel: 'junior' | 'mid' | 'senior' | 'lead';
  location: string;
  availability: 'available' | 'interviewing' | 'unavailable';
  lastInterviewDate: string;
  overallRating: number;
  performanceMetrics: {
    codeQuality: number;
    communication: number;
    technicalSkills: number;
    problemSolving: number;
  };
  interviewHistory: Array<{
    id: string;
    date: string;
    position: string;
    interviewer: string;
    status: 'completed' | 'scheduled' | 'cancelled';
    score: number;
    feedback: string;
    technicalQuestions: Array<{
      question: string;
      answer: string;
      score: number;
    }>;
  }>;
  notes: Array<{
    id: string;
    date: string;
    author: string;
    content: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: 'resume' | 'portfolio' | 'cover_letter' | 'assessment';
    url: string;
    uploadDate: string;
  }>;
  experienceTimeline: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
}

const skillColors = {
  'JavaScript': '#f7df1e',
  'React': '#61dafb',
  'Node.js': '#68a063',
  'Python': '#3776ab',
  'Java': '#ed8b00',
  'TypeScript': '#3178c6',
  'CSS': '#1572b6',
  'HTML': '#e34f26',
  'Angular': '#dd0031',
  'Vue.js': '#4fc08d',
  'SQL': '#336791',
  'MongoDB': '#47a248',
  'Docker': '#2496ed',
  'AWS': '#232f3e',
  'Git': '#f05032',
  'C++': '#00599c',
  'C#': '#239120',
  'PHP': '#777bb4',
  'Ruby': '#cc342d',
  'Go': '#00add8',
  'Rust': '#000000',
  'Swift': '#fa7343',
  'Kotlin': '#7f52ff',
  'Flutter': '#02569b',
  'React Native': '#61dafb',
  'GraphQL': '#e10098',
  'Redis': '#dc382d',
  'Kubernetes': '#326ce5',
  'Jenkins': '#d33833',
  'Figma': '#f24e1e',
  'Machine Learning': '#ff6f00',
  'Data Science': '#8e44ad',
  'DevOps': '#326ce5',
  'Blockchain': '#f7931a'
};

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face',
    skills: [
      { name: 'React', level: 'expert', color: skillColors['React'] },
      { name: 'TypeScript', level: 'advanced', color: skillColors['TypeScript'] },
      { name: 'Node.js', level: 'advanced', color: skillColors['Node.js'] },
      { name: 'GraphQL', level: 'intermediate', color: skillColors['GraphQL'] },
      { name: 'AWS', level: 'intermediate', color: skillColors['AWS'] }
    ],
    experienceLevel: 'senior',
    location: 'San Francisco, CA',
    availability: 'available',
    lastInterviewDate: '2024-06-10',
    overallRating: 4.8,
    performanceMetrics: {
      codeQuality: 92,
      communication: 88,
      technicalSkills: 95,
      problemSolving: 90
    },
    interviewHistory: [
      {
        id: 'int-1',
        date: '2024-06-10',
        position: 'Senior Frontend Developer',
        interviewer: 'John Smith',
        status: 'completed',
        score: 4.5,
        feedback: 'Excellent technical skills and problem-solving approach. Strong communication.',
        technicalQuestions: [
          { question: 'Implement a debounced search function', answer: 'Used setTimeout with clearTimeout', score: 9 },
          { question: 'Explain React hooks lifecycle', answer: 'Detailed explanation of useEffect dependencies', score: 10 }
        ]
      }
    ],
    notes: [
      {
        id: 'note-1',
        date: '2024-06-10',
        author: 'John Smith',
        content: 'Very impressive candidate. Strong technical background with React and modern JavaScript.'
      }
    ],
    documents: [
      { id: 'doc-1', name: 'Resume_Sarah_Johnson.pdf', type: 'resume', url: '#', uploadDate: '2024-06-01' },
      { id: 'doc-2', name: 'Portfolio_Website.pdf', type: 'portfolio', url: '#', uploadDate: '2024-06-01' }
    ],
    experienceTimeline: [
      { company: 'TechCorp', position: 'Senior Frontend Developer', duration: '2022-Present', description: 'Led React development team, implemented microservices architecture' },
      { company: 'StartupXYZ', position: 'Frontend Developer', duration: '2020-2022', description: 'Built responsive web applications using React and TypeScript' }
    ]
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    skills: [
      { name: 'Python', level: 'expert', color: skillColors['Python'] },
      { name: 'Machine Learning', level: 'advanced', color: skillColors['Machine Learning'] },
      { name: 'Django', level: 'advanced', color: skillColors['Python'] },
      { name: 'PostgreSQL', level: 'intermediate', color: skillColors['SQL'] },
      { name: 'Docker', level: 'intermediate', color: skillColors['Docker'] }
    ],
    experienceLevel: 'senior',
    location: 'New York, NY',
    availability: 'interviewing',
    lastInterviewDate: '2024-06-08',
    overallRating: 4.6,
    performanceMetrics: {
      codeQuality: 88,
      communication: 85,
      technicalSkills: 94,
      problemSolving: 92
    },
    interviewHistory: [
      {
        id: 'int-2',
        date: '2024-06-08',
        position: 'Senior Python Developer',
        interviewer: 'Alice Cooper',
        status: 'completed',
        score: 4.6,
        feedback: 'Strong algorithmic thinking and Python expertise. Good cultural fit.',
        technicalQuestions: [
          { question: 'Implement a LRU cache', answer: 'Used OrderedDict with proper eviction logic', score: 9 },
          { question: 'Design a scalable web crawler', answer: 'Discussed async/await, rate limiting, and distributed architecture', score: 8 }
        ]
      }
    ],
    notes: [
      {
        id: 'note-2',
        date: '2024-06-08',
        author: 'Alice Cooper',
        content: 'Solid backend experience with Python and ML. Would be great for our data team.'
      }
    ],
    documents: [
      { id: 'doc-3', name: 'Michael_Chen_Resume.pdf', type: 'resume', url: '#', uploadDate: '2024-05-28' },
      { id: 'doc-4', name: 'ML_Portfolio.pdf', type: 'portfolio', url: '#', uploadDate: '2024-05-28' }
    ],
    experienceTimeline: [
      { company: 'DataTech Inc', position: 'Senior Python Developer', duration: '2021-Present', description: 'Developed ML pipelines and data processing systems' },
      { company: 'Analytics Pro', position: 'Python Developer', duration: '2019-2021', description: 'Built data analysis tools and APIs using Django' }
    ]
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    skills: [
      { name: 'Java', level: 'expert', color: skillColors['Java'] },
      { name: 'Spring Boot', level: 'advanced', color: skillColors['Java'] },
      { name: 'Microservices', level: 'advanced', color: skillColors['Java'] },
      { name: 'Kubernetes', level: 'intermediate', color: skillColors['Kubernetes'] },
      { name: 'MySQL', level: 'advanced', color: skillColors['SQL'] }
    ],
    experienceLevel: 'senior',
    location: 'Austin, TX',
    availability: 'available',
    lastInterviewDate: '2024-06-05',
    overallRating: 4.7,
    performanceMetrics: {
      codeQuality: 90,
      communication: 92,
      technicalSkills: 89,
      problemSolving: 94
    },
    interviewHistory: [
      {
        id: 'int-3',
        date: '2024-06-05',
        position: 'Senior Backend Developer',
        interviewer: 'David Wilson',
        status: 'completed',
        score: 4.7,
        feedback: 'Exceptional system design skills and Java expertise. Great leadership potential.',
        technicalQuestions: [
          { question: 'Design a distributed messaging system', answer: 'Comprehensive design with proper partitioning and fault tolerance', score: 10 },
          { question: 'Optimize database queries', answer: 'Discussed indexing strategies and query optimization techniques', score: 9 }
        ]
      }
    ],
    notes: [
      {
        id: 'note-3',
        date: '2024-06-05',
        author: 'David Wilson',
        content: 'Outstanding candidate with strong architecture and system design skills.'
      }
    ],
    documents: [
      { id: 'doc-5', name: 'Emily_Rodriguez_CV.pdf', type: 'resume', url: '#', uploadDate: '2024-05-25' }
    ],
    experienceTimeline: [
      { company: 'Enterprise Solutions', position: 'Senior Java Developer', duration: '2020-Present', description: 'Led microservices migration and system architecture' },
      { company: 'TechStart', position: 'Java Developer', duration: '2018-2020', description: 'Developed REST APIs and database systems' }
    ]
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@email.com',
    phone: '+1 (555) 456-7890',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    skills: [
      { name: 'DevOps', level: 'expert', color: skillColors['DevOps'] },
      { name: 'AWS', level: 'expert', color: skillColors['AWS'] },
      { name: 'Terraform', level: 'advanced', color: skillColors['AWS'] },
      { name: 'Jenkins', level: 'advanced', color: skillColors['Jenkins'] },
      { name: 'Python', level: 'intermediate', color: skillColors['Python'] }
    ],
    experienceLevel: 'senior',
    location: 'Seattle, WA',
    availability: 'available',
    lastInterviewDate: '2024-06-12',
    overallRating: 4.5,
    performanceMetrics: {
      codeQuality: 85,
      communication: 88,
      technicalSkills: 96,
      problemSolving: 87
    },
    interviewHistory: [
      {
        id: 'int-4',
        date: '2024-06-12',
        position: 'DevOps Engineer',
        interviewer: 'Sarah Tech',
        status: 'completed',
        score: 4.5,
        feedback: 'Excellent DevOps knowledge and practical experience with cloud platforms.',
        technicalQuestions: [
          { question: 'Design CI/CD pipeline', answer: 'Comprehensive pipeline with proper testing and deployment strategies', score: 9 },
          { question: 'Kubernetes troubleshooting', answer: 'Good understanding of pod debugging and resource management', score: 8 }
        ]
      }
    ],
    notes: [
      {
        id: 'note-4',
        date: '2024-06-12',
        author: 'Sarah Tech',
        content: 'Strong DevOps background with excellent cloud platform experience.'
      }
    ],
    documents: [
      { id: 'doc-6', name: 'David_Kim_Resume.pdf', type: 'resume', url: '#', uploadDate: '2024-06-01' }
    ],
    experienceTimeline: [
      { company: 'CloudFirst', position: 'Senior DevOps Engineer', duration: '2021-Present', description: 'Managed AWS infrastructure and CI/CD pipelines' },
      { company: 'InfraTech', position: 'DevOps Engineer', duration: '2019-2021', description: 'Implemented containerization and automation tools' }
    ]
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa.wang@email.com',
    phone: '+1 (555) 567-8901',
    profilePhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    skills: [
      { name: 'React', level: 'advanced', color: skillColors['React'] },
      { name: 'JavaScript', level: 'expert', color: skillColors['JavaScript'] },
      { name: 'CSS', level: 'advanced', color: skillColors['CSS'] },
      { name: 'Figma', level: 'expert', color: skillColors['Figma'] },
      { name: 'Node.js', level: 'intermediate', color: skillColors['Node.js'] }
    ],
    experienceLevel: 'mid',
    location: 'Los Angeles, CA',
    availability: 'available',
    lastInterviewDate: '2024-06-07',
    overallRating: 4.3,
    performanceMetrics: {
      codeQuality: 82,
      communication: 90,
      technicalSkills: 85,
      problemSolving: 88
    },
    interviewHistory: [
      {
        id: 'int-5',
        date: '2024-06-07',
        position: 'Frontend Developer',
        interviewer: 'Mark Designer',
        status: 'completed',
        score: 4.3,
        feedback: 'Great design sense and frontend skills. Strong potential for growth.',
        technicalQuestions: [
          { question: 'Build responsive layout', answer: 'Used CSS Grid and Flexbox effectively', score: 8 },
          { question: 'React component optimization', answer: 'Good understanding of React.memo and useMemo', score: 7 }
        ]
      }
    ],
    notes: [
      {
        id: 'note-5',
        date: '2024-06-07',
        author: 'Mark Designer',
        content: 'Excellent design skills and good frontend development experience.'
      }
    ],
    documents: [
      { id: 'doc-7', name: 'Lisa_Wang_Portfolio.pdf', type: 'portfolio', url: '#', uploadDate: '2024-05-30' }
    ],
    experienceTimeline: [
      { company: 'DesignTech', position: 'Frontend Developer', duration: '2022-Present', description: 'Developed user interfaces and improved user experience' },
      { company: 'WebStudio', position: 'Junior Developer', duration: '2021-2022', description: 'Built responsive websites and learned React framework' }
    ]
  }
];

// Generate additional candidates to reach 20+
const additionalNames = [
  'Alex Turner', 'Jessica Brown', 'Robert Davis', 'Amanda Wilson', 'James Miller',
  'Rachel Green', 'Christopher Lee', 'Nicole Taylor', 'Matthew Anderson', 'Stephanie White',
  'Daniel Martinez', 'Ashley Garcia', 'Kevin Thompson', 'Lauren Harris', 'Brandon Clark',
  'Melissa Lewis', 'Ryan Walker', 'Kimberly Hall', 'Justin Young', 'Heather King'
];

const additionalSkillSets = [
  ['C++', 'Python', 'Machine Learning'],
  ['Angular', 'TypeScript', 'RxJS'],
  ['Vue.js', 'JavaScript', 'CSS'],
  ['C#', '.NET', 'SQL Server'],
  ['PHP', 'Laravel', 'MySQL'],
  ['Ruby', 'Rails', 'PostgreSQL'],
  ['Go', 'Docker', 'Kubernetes'],
  ['Swift', 'iOS', 'Xcode'],
  ['Kotlin', 'Android', 'Java'],
  ['Flutter', 'Dart', 'Firebase'],
  ['React Native', 'JavaScript', 'Mobile'],
  ['Rust', 'Systems Programming', 'WebAssembly'],
  ['Blockchain', 'Solidity', 'Web3'],
  ['Data Science', 'Python', 'TensorFlow'],
  ['UI/UX', 'Figma', 'Prototyping']
];

// Create additional candidates
for (let i = 6; i <= 25; i++) {
  const name = additionalNames[(i - 6) % additionalNames.length];
  const skillSet = additionalSkillSets[(i - 6) % additionalSkillSets.length];
  const experienceLevels = ['junior', 'mid', 'senior'] as const;
  const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Chicago, IL', 'Denver, CO'];
  const availabilities = ['available', 'interviewing', 'unavailable'] as const;
  
  const candidate: Candidate = {
    id: i.toString(),
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
    phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    profilePhoto: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=150&h=150&fit=crop&crop=face`,
    skills: skillSet.map(skill => ({
      name: skill,
      level: (['beginner', 'intermediate', 'advanced', 'expert'] as const)[Math.floor(Math.random() * 4)],
      color: skillColors[skill as keyof typeof skillColors] || '#6b7280'
    })),
    experienceLevel: experienceLevels[Math.floor(Math.random() * experienceLevels.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    availability: availabilities[Math.floor(Math.random() * availabilities.length)],
    lastInterviewDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    overallRating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    performanceMetrics: {
      codeQuality: Math.floor(Math.random() * 30) + 70,
      communication: Math.floor(Math.random() * 30) + 70,
      technicalSkills: Math.floor(Math.random() * 30) + 70,
      problemSolving: Math.floor(Math.random() * 30) + 70
    },
    interviewHistory: [],
    notes: [],
    documents: [
      { id: `doc-${i}`, name: `${name.replace(' ', '_')}_Resume.pdf`, type: 'resume', url: '#', uploadDate: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
    ],
    experienceTimeline: [
      { company: 'TechCorp', position: 'Developer', duration: '2022-Present', description: 'Software development and system design' }
    ]
  };
  
  mockCandidates.push(candidate);
}

export const skillsList = Object.keys(skillColors);
export const experienceLevels = ['junior', 'mid', 'senior', 'lead'];
export const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Chicago, IL', 'Denver, CO'];
export const availabilities = ['available', 'interviewing', 'unavailable'];
