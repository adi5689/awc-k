export const ageBands = ['3-4 years', '4-5 years', '5-6 years'] as const;
export type AgeBand = typeof ageBands[number];

export const rubricLevels = ['Not Yet Observed', 'Emerging', 'Developing', 'Achieved'] as const;
export type RubricLevel = typeof rubricLevels[number];

export const standardObservationMarks = [
  {
    score: 0,
    level: 'Not Yet Observed',
    label: 'Not Yet',
    helper: 'No clear response yet',
  },
  {
    score: 1,
    level: 'Emerging',
    label: 'With Help',
    helper: 'Responds with repeated support',
  },
  {
    score: 2,
    level: 'Developing',
    label: 'Partial',
    helper: 'Attempts with little support',
  },
  {
    score: 3,
    level: 'Achieved',
    label: 'Independent',
    helper: 'Shows skill independently',
  },
] as const;
export type StandardObservationMark = typeof standardObservationMarks[number]['score'];

export const standardObservationMetrics = [
  {
    id: 'engagement',
    label: 'Engagement',
    shortLabel: 'Engage',
    weight: 20,
    reviewPrompt: 'Child joins, stays with, and participates in the activity.',
  },
  {
    id: 'competencySkill',
    label: 'Competency Skill',
    shortLabel: 'Skill',
    weight: 35,
    reviewPrompt: 'Child demonstrates the module competency through this activity.',
  },
  {
    id: 'communication',
    label: 'Expression',
    shortLabel: 'Express',
    weight: 20,
    reviewPrompt: 'Child responds through speech, gesture, drawing, movement, or explanation.',
  },
  {
    id: 'independence',
    label: 'Independence',
    shortLabel: 'Independ',
    weight: 15,
    reviewPrompt: 'Child attempts the task without repeated adult help.',
  },
  {
    id: 'peerInteraction',
    label: 'Peer Interaction',
    shortLabel: 'Peer',
    weight: 10,
    reviewPrompt: 'Child shares, waits, collaborates, or responds to peers.',
  },
] as const;
export type StandardObservationMetricId = typeof standardObservationMetrics[number]['id'];

export const evidenceTypes = ['Observation Note', 'Photo', 'Video', 'Voice Note'] as const;
export type EvidenceType = typeof evidenceTypes[number];

export const observationCategories = [
  'Participation',
  'Communication',
  'Cognitive Skills',
  'Physical Skills',
  'Social Behaviour',
  'Emotional Regulation',
  'Curiosity & Persistence',
] as const;
export type ObservationCategory = typeof observationCategories[number];

export type EcceLmsDomainName =
  | 'Language Development'
  | 'Early Numeracy'
  | 'Cognitive Development'
  | 'Physical Development'
  | 'Social & Emotional Development'
  | 'Creative & Aesthetic Development';

export type DomainTone = 'sky' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan';

export type DailyPlannerSlot = {
  id: string;
  title: string;
  durationMinutes: number;
  linkedDomain?: EcceLmsDomainName;
  focus: string;
};

export type RubricDescriptor = {
  level: RubricLevel;
  score: number;
  description: string;
};

export type EcceLmsActivity = {
  id: string;
  domain: EcceLmsDomainName;
  competency: string;
  learningOutcome: string;
  title: string;
  objective: string;
  storyHook: string;
  materials: string[];
  facilitationSteps: string[];
  teacherPrompts: string[];
  expectedResponses: string[];
  observationChecklist: string[];
  remediationSuggestions: string[];
  inclusionAdaptations: string[];
  ageGroups: AgeBand[];
};

export type EcceLmsModule = {
  id: string;
  domain: EcceLmsDomainName;
  title: string;
  competency: string;
  learningOutcome: string;
  activities: EcceLmsActivity[];
};

export type EcceLmsDomain = {
  id: string;
  name: EcceLmsDomainName;
  shortName: string;
  tone: DomainTone;
  competencyStrands: string[];
  learningOutcome: string;
  modules: EcceLmsModule[];
  activities: EcceLmsActivity[];
};

const commonMaterials = [
  'Low-cost local materials',
  'Flashcards or picture cards',
  'Seeds, sticks, leaves, clay, balls, or classroom resources',
];

const commonFacilitationSteps = [
  'Warm-up conversation',
  'Demonstration by Anganwadi Worker',
  'Guided participation',
  'Independent attempt',
  'Reflection and discussion',
];

const commonObservationPoints = [
  'Participation level',
  'Ability to follow instructions',
  'Communication and interaction',
  'Accuracy of task completion',
  'Confidence and persistence',
  'Need for support or scaffolding',
];

const domainIndicators: Record<EcceLmsDomainName, string[]> = {
  'Language Development': ['Follows instructions', 'Uses new vocabulary', 'Retells story or idea'],
  'Early Numeracy': ['Counts objects', 'Matches quantities', 'Recognizes patterns'],
  'Cognitive Development': ['Solves simple problems', 'Recalls memory cues', 'Sequences events'],
  'Physical Development': ['Shows balance', 'Uses fine motor control', 'Coordinates movement'],
  'Social & Emotional Development': ['Shares with peers', 'Waits for turn', 'Shows confidence'],
  'Creative & Aesthetic Development': ['Expresses imagination', 'Participates in art or music', 'Uses materials creatively'],
};

const domainMeta: Array<Omit<EcceLmsDomain, 'activities' | 'modules'> & { activityTitles: string[] }> = [
  {
    id: 'language',
    name: 'Language Development',
    shortName: 'Language',
    tone: 'sky',
    competencyStrands: ['Listening', 'Speaking', 'Vocabulary', 'Story retelling'],
    learningOutcome: 'Child follows simple instructions, uses vocabulary, and participates in story or rhyme conversations.',
    activityTitles: [
      'Follow My Action',
      'Picture Talk',
      'Mystery Bag',
      'Story Circle',
      'Show and Tell',
      'Rhyme Repetition',
      'Animal Sounds',
      'Opposites Game',
      'Emotion Talk',
      'Question Ball',
    ],
  },
  {
    id: 'numeracy',
    name: 'Early Numeracy',
    shortName: 'Numeracy',
    tone: 'emerald',
    competencyStrands: ['Counting', 'Sorting', 'Patterning', 'Quantity matching'],
    learningOutcome: 'Child counts, compares, sorts, matches quantities, and recognizes simple patterns through play.',
    activityTitles: [
      'Count the Seeds',
      'Number Hop',
      'Match Quantity',
      'Sorting Objects',
      'Pattern Necklace',
      'Missing Number',
      'Shape Sorting',
      'Compare Length',
      'Market Play',
      'Number Song',
    ],
  },
  {
    id: 'cognitive',
    name: 'Cognitive Development',
    shortName: 'Cognitive',
    tone: 'violet',
    competencyStrands: ['Problem solving', 'Memory recall', 'Sequencing', 'Prediction'],
    learningOutcome: 'Child observes, remembers, predicts, sequences, and solves simple problems with familiar materials.',
    activityTitles: [
      'Memory Tray',
      'Missing Object',
      'Matching Cards',
      'Puzzle Assembly',
      'Story Sequence',
      'Shadow Matching',
      'Treasure Hunt',
      'Guess the Object',
      'Block Building',
      'Prediction Game',
    ],
  },
  {
    id: 'physical',
    name: 'Physical Development',
    shortName: 'Physical',
    tone: 'amber',
    competencyStrands: ['Fine motor', 'Gross motor', 'Balance', 'Coordination'],
    learningOutcome: 'Child builds balance, coordination, fine motor control, and safe body movement through activity.',
    activityTitles: [
      'Balance Walk',
      'Throw and Catch',
      'Obstacle Course',
      'Threading Beads',
      'Clay Modelling',
      'Finger Painting',
      'Stack Blocks',
      'Animal Walks',
      'Balloon Tap',
      "Children's Yoga",
    ],
  },
  {
    id: 'social-emotional',
    name: 'Social & Emotional Development',
    shortName: 'Social-Emotional',
    tone: 'rose',
    competencyStrands: ['Sharing', 'Empathy', 'Turn-taking', 'Confidence'],
    learningOutcome: 'Child cooperates with peers, shares materials, waits for turns, and expresses feelings safely.',
    activityTitles: [
      'Circle Sharing',
      'Pair Work',
      'Group Puzzle',
      'Emotion Cards',
      'Friendship Chain',
      'Turn Taking Game',
      'Team Tower',
      'Community Helper Roleplay',
      'Compliment Circle',
      'Greeting Game',
    ],
  },
  {
    id: 'creative',
    name: 'Creative & Aesthetic Development',
    shortName: 'Creative',
    tone: 'cyan',
    competencyStrands: ['Expression', 'Imagination', 'Arts participation', 'Pretend play'],
    learningOutcome: 'Child expresses ideas through art, music, movement, pretend play, and local creative materials.',
    activityTitles: [
      'Free Drawing',
      'Nature Collage',
      'Leaf Printing',
      'Song Circle',
      'Action Rhymes',
      'Dance Movement',
      'Puppet Show',
      'Pretend Kitchen',
      'Story Dramatization',
      'Animal Masks',
    ],
  },
];

function slugify(value: string) {
  return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function buildActivity(domain: Omit<EcceLmsDomain, 'activities' | 'modules'>, title: string, index: number): EcceLmsActivity {
  const competency = domain.competencyStrands[index % domain.competencyStrands.length];

  return {
    id: `${domain.id}-${slugify(title)}`,
    domain: domain.name,
    competency,
    learningOutcome: domain.learningOutcome,
    title,
    objective: `Build ${domain.shortName.toLowerCase()} competency through play-based, experiential learning.`,
    storyHook: `Chiku and Mina need the children's help to complete a ${domain.shortName.toLowerCase()} challenge using familiar centre materials.`,
    materials: commonMaterials,
    facilitationSteps: commonFacilitationSteps,
    teacherPrompts: [
      `What do you notice in ${title.toLowerCase()}?`,
      'Can you try once with your friend?',
      'What changed when you tried again?',
    ],
    expectedResponses: [
      'Child participates with adult or peer support',
      'Child attempts the task independently',
      'Child explains, gestures, counts, moves, or creates based on the activity',
    ],
    observationChecklist: [...commonObservationPoints, ...domainIndicators[domain.name]],
    remediationSuggestions: [
      'Repeat the activity in a smaller group',
      'Use concrete local material before worksheet or recall',
      'Pair with a peer model and observe again in the next session',
    ],
    inclusionAdaptations: [
      'Allow verbal, gesture, movement, or drawing response',
      'Reduce steps for children who need scaffolding',
      'Use larger objects and slower demonstration where needed',
    ],
    ageGroups: [...ageBands],
  };
}

export const lmsDomains: EcceLmsDomain[] = domainMeta.map((domain) => {
  const activities = domain.activityTitles.map((title, index) => buildActivity(domain, title, index));
  const modules = domain.competencyStrands.map((competency) => ({
    id: `${domain.id}-${slugify(competency)}-module`,
    domain: domain.name,
    title: `${competency} Module`,
    competency,
    learningOutcome: domain.learningOutcome,
    activities: activities.filter((activity) => activity.competency === competency),
  }));

  return {
    ...domain,
    modules,
    activities,
  };
});

export const ecceActivityRepository: EcceLmsActivity[] = lmsDomains.flatMap((domain) => domain.activities);

export const assessmentRubric: RubricDescriptor[] = [
  {
    level: 'Not Yet Observed',
    score: 1,
    description: 'No observable response yet, or the child was absent during the activity.',
  },
  {
    level: 'Emerging',
    score: 2,
    description: 'Child participates with repeated prompts, peer model, or adult support.',
  },
  {
    level: 'Developing',
    score: 3,
    description: 'Child attempts the skill with partial independence and occasional support.',
  },
  {
    level: 'Achieved',
    score: 4,
    description: 'Child demonstrates the skill independently in the activity context.',
  },
];

export const dailyPlannerSlots: DailyPlannerSlot[] = [
  { id: 'welcome', title: 'Welcome Circle', durationMinutes: 10, focus: 'Prayer, attendance, warm greetings' },
  { id: 'story', title: 'Story', durationMinutes: 20, linkedDomain: 'Language Development', focus: 'Story listening and conversation' },
  { id: 'language', title: 'Language Activity', durationMinutes: 20, linkedDomain: 'Language Development', focus: 'Vocabulary, listening, speaking' },
  { id: 'numeracy', title: 'Numeracy Activity', durationMinutes: 20, linkedDomain: 'Early Numeracy', focus: 'Counting, sorting, patterning' },
  { id: 'outdoor', title: 'Outdoor Play', durationMinutes: 20, linkedDomain: 'Physical Development', focus: 'Gross motor and coordination' },
  { id: 'creative', title: 'Creative Activity', durationMinutes: 20, linkedDomain: 'Creative & Aesthetic Development', focus: 'Art, rhythm, imagination' },
  { id: 'reflection', title: 'Reflection', durationMinutes: 10, linkedDomain: 'Social & Emotional Development', focus: 'Sharing, confidence, closure' },
];

export const lmsCoverageSummary = {
  domains: lmsDomains.length,
  modules: lmsDomains.reduce((sum, domain) => sum + domain.modules.length, 0),
  activities: ecceActivityRepository.length,
  plannerMinutes: dailyPlannerSlots.reduce((sum, slot) => sum + slot.durationMinutes, 0),
  rubricLevels: assessmentRubric.length,
};
