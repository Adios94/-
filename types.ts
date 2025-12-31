
export enum Role {
  DESIGNER = 'Designer',
  PROGRAMMER = 'Programmer',
  ARTIST = 'Artist'
}

export enum GameStage {
  SETUP = 'SETUP',
  HIRING = 'HIRING',
  STARTING = 'STARTING',
  ENGINEERING = 'ENGINEERING',
  DEVELOPMENT = 'DEVELOPMENT',
  RELEASE = 'RELEASE',
  RESULTS = 'RESULTS',
  FAILED = 'FAILED'
}

export type AppWindow = 'NONE' | 'MY_COMPUTER' | 'DOCUMENTS' | 'MANUAL' | 'TERMINAL';

export interface StaffMember {
  id: string;
  name: string;
  role: Role;
  specialSkill: string;
  description: string;
  stats: {
    creativity: number;
    technology: number;
    artistry: number;
  };
  salary: number; 
  rarity: 'Legendary' | 'Epic' | 'Rare' | 'Common' | 'Trash';
}

export interface GameConfig {
  title: string;
  theme: string;
  genre: string;
  isMultiplayer: boolean;
  hasModSupport: boolean;
  platform: string[];
}

export interface EngineeringConfig {
  engine: string;
  aiAssistance: 'None' | 'Partial' | 'Full';
  graphicsLevel: 'Pixel' | 'Stylized' | 'Realistic';
  upfrontCost: number;
  speedMultiplier: number;
  qualityMultiplier: number;
  optimizationLevel?: string;
  dependencyStrategy?: string;
}

export interface DevEventOption {
  text: string;
  effectDescription: string;
  cost?: number; 
  progressImpact?: number; 
  statImpact: {
    quality?: number;
    hype?: number;
    bugs?: number;
    morale?: number;
  };
}

export interface DevEvent {
  title: string;
  type: 'CONFLICT' | 'STRESS' | 'COMPETITOR' | 'TECHNICAL' | 'OTHER';
  description: string;
  options: DevEventOption[];
}

export interface MarketingOption {
  id: string;
  name: string;
  cost: number;
  boost: number;
  icon: string;
  desc: string;
}

export interface GameState {
  money: number;
  stage: GameStage;
  config: GameConfig;
  engineering: EngineeringConfig;
  team: {
    designer: StaffMember | null;
    programmer: StaffMember | null;
    artist: StaffMember | null;
  };
  currentMonth: number;
  totalExpectedMonths: number;
  monthlyBurnRate: number;
  morale: number; 
  progress: number; 
  isCrunching: boolean; // NEW: Track if player is in crunch mode
  currentTrend: string; // NEW: Random trend per session
  stats: {
    quality: number;
    hype: number;
    bugs: number;
  };
  price: number;
  selectedMarketing: string[];
  logs: string[];
  coverUrl?: string;
  summary?: string;
  failureReason?: string;
  activeApp: AppWindow;
  history: any[];
}

export interface FinalResult {
  basePotential: number;
  score: number;
  reviewSummary: string;
  achievement: {
    name: string;
    description: string;
  };
}
