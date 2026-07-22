export interface WheelSlice {
  index: number;
  multiplier: number;
  label: string;
  color: string;
  textColor: string;
}

export interface WheelOutcomeProbability {
  multiplier: number;
  probability: number;
}

export type WheelResultState =
  | 'ready'
  | 'spinning'
  | 'loss'
  | 'win'
  | 'major-win';
