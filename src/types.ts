export enum Term {
  TERM_1 = 'TERM_1',
  TERM_2 = 'TERM_2',
  TERM_3 = 'TERM_3',
  TERM_4 = 'TERM_4',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum Operation {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
  MULTIPLICATION = 'MULTIPLICATION',
  DIVISION = 'DIVISION',
  ROUNDING = 'ROUNDING',
  PLACE_VALUE = 'PLACE_VALUE',
  FRACTIONS = 'FRACTIONS',
  NUMBER_SENTENCES = 'NUMBER_SENTENCES',
  PATTERNS = 'PATTERNS',
  SHAPES_2D = 'SHAPES_2D',
  OBJECTS_3D = 'OBJECTS_3D',
  DATA_HANDLING = 'DATA_HANDLING',
  MEASUREMENT = 'MEASUREMENT',
  TIME = 'TIME',
  PERIMETER_AREA = 'PERIMETER_AREA',
  PROBABILITY = 'PROBABILITY',
  MULTIPLICATION_TABLE = 'MULTIPLICATION_TABLE',
  DIVISION_TABLE = 'DIVISION_TABLE',
}

export interface Question {
  id: string;
  text: string;
  num1: number;
  num2: number;
  operation: Operation;
  answer: number | string;
  explanation: string[];
  hint?: string;
  isRealLife?: boolean;
  category?: 'money' | 'time' | 'sharing' | 'general';
  options?: (number | string)[];
  iconType?: string;
  headline?: string;
  mathExpression?: string;
  visualType?: string;
}

export interface BuddyProfile {
  name: string;
  avatar: string;
  stars: number;
  streak: number;
  bestStreak: number;
  difficulty: Difficulty;
  totalQuestions: number;
  correctAnswers: number;
  topicPerformance: { [key in Operation]?: { total: number; correct: number } };
  badges: string[];
  weakAreas: { [key in Operation]: number };
  lastPlayedDate?: string;
  lastDailyChallengeDate?: string;
  dailyChallengeStreak: number;
  dailyLearningStreak: number;
  dailyGoal: number;
  questionsToday: number;
  unlockedAvatars: string[];
  parentPassword?: string;
  enabledOperations: Operation[];
  currentTerm: Term;
  isPro: boolean;
}

export interface SessionState {
  correctInARow: number;
  wrongInARow: number;
}

export interface StruggledQuestion {
  id: string;
  buddyUid: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  operation: Operation;
  timestamp: string;
  explanation: string[];
}
