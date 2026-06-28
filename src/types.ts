export type Gender = 'Nam' | 'Nữ' | 'LGBT+';

export interface UserInput {
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  birthHour: string;
  gender: Gender;
  facialFeatures?: {
    forehead: string;
    eyes: string;
    mouth: string;
  };
}

export interface ElementData {
  element: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
  napAm: string;
  description: string;
  luckyColors: string[];
  luckyNumbers: number[];
  luckyDirections: string[];
}

export interface NumerologyData {
  lifePath: number;
  destiny: number;
  soulUrge: number;
  innerSelf: number; // Potential/Personality
  maturity: number;
  birthChart: number[][]; // 3x3 grid
  arrows: Arrow[];
  personalYear: number;
  pyramids: number[];
  elementData: ElementData;
}

export interface Arrow {
  name: string;
  type: 'strength' | 'weakness';
  path: string; // e.g. "1-2-3", "1-5-9"
  description: string;
}

export interface CompatibilityInput {
  person1: UserInput;
  person2: UserInput;
}

export interface CompatibilityResult {
  score: number;
  person1Data: NumerologyData;
  person2Data: NumerologyData;
  aiInterpretation: {
    comparisonTable: string;
    compatibilityAnalysis: string;
    conflicts: string;
    solutions: string;
  };
}

export interface AnalysisResult {
  input: UserInput;
  numerology: NumerologyData;
  aiInterpretation: {
    overview: string;
    innerEnergy: string;
    futureForecast: string;
    faceAnalysis: string;
    elementAnalysis: string;
    fengShui: {
      luckyColors: string[];
      luckyNumbers: number[];
      advice: string;
    };
  };
}
