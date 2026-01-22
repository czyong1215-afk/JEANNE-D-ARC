
export enum Emotion {
  HAPPY = '高兴',
  DEPRESSED = '心情低落',
  EXCITED = '激动',
  SAD = '伤心',
  HUMOROUS = '幽默',
  TOXIC = '毒舌'
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  emotion?: Emotion;
  timestamp: number;
}

export interface SystemStatus {
  batteryOptimization: boolean;
  learningProgress: number;
  stealthMode: boolean;
  scannedTopics: string[];
}
