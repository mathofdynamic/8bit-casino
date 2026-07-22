export type DicePrediction = 'higher' | 'lower' | 'equal';

export type DiceGamePhase =
  | 'betting'
  | 'awaiting-prediction'
  | 'rolling'
  | 'round-won'
  | 'round-lost'
  | 'banked';

export interface DicePair {
  dieOne: number;
  dieTwo: number;
  total: number;
}
