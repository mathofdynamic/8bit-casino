import { WheelSlice, WheelOutcomeProbability } from './wheelTypes';

export const WHEEL_SLICES: WheelSlice[] = [
  { index: 0, multiplier: 10, label: '10×', color: '#F6B73C', textColor: '#0B0D18' },
  { index: 1, multiplier: 0, label: '0×', color: '#15182A', textColor: '#9A9AB5' },
  { index: 2, multiplier: 1, label: '1×', color: '#F3EBD8', textColor: '#0B0D18' },
  { index: 3, multiplier: 0.5, label: '0.5×', color: '#44476B', textColor: '#F3EBD8' },
  { index: 4, multiplier: 2, label: '2×', color: '#54D6D9', textColor: '#0B0D18' },
  { index: 5, multiplier: 0, label: '0×', color: '#15182A', textColor: '#9A9AB5' },
  { index: 6, multiplier: 1, label: '1×', color: '#F3EBD8', textColor: '#0B0D18' },
  { index: 7, multiplier: 5, label: '5×', color: '#D95F9A', textColor: '#F3EBD8' },
  { index: 8, multiplier: 0, label: '0×', color: '#15182A', textColor: '#9A9AB5' },
  { index: 9, multiplier: 0.5, label: '0.5×', color: '#44476B', textColor: '#F3EBD8' },
  { index: 10, multiplier: 2, label: '2×', color: '#54D6D9', textColor: '#0B0D18' },
  { index: 11, multiplier: 0, label: '0×', color: '#15182A', textColor: '#9A9AB5' },
  { index: 12, multiplier: 1, label: '1×', color: '#F3EBD8', textColor: '#0B0D18' },
  { index: 13, multiplier: 0.5, label: '0.5×', color: '#44476B', textColor: '#F3EBD8' },
  { index: 14, multiplier: 2, label: '2×', color: '#54D6D9', textColor: '#0B0D18' },
  { index: 15, multiplier: 0, label: '0×', color: '#15182A', textColor: '#9A9AB5' },
];

export const WHEEL_OUTCOMES: WheelOutcomeProbability[] = [
  { multiplier: 10, probability: 0.02 },
  { multiplier: 5, probability: 0.05 },
  { multiplier: 2, probability: 0.12 },
  { multiplier: 1, probability: 0.18 },
  { multiplier: 0.5, probability: 0.10 },
  { multiplier: 0, probability: 0.53 },
];
