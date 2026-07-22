import { DicePrediction } from './diceTypes';

export const DICE_OUTCOMES: Record<number, number> = {
  2: 1,  // (1,1)
  3: 2,  // (1,2), (2,1)
  4: 3,  // (1,3), (2,2), (3,1)
  5: 4,  // (1,4), (2,3), (3,2), (4,1)
  6: 5,  // (1,5), (2,4), (3,3), (4,2), (5,1)
  7: 6,  // (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)
  8: 5,  // (2,6), (3,5), (4,4), (5,3), (6,2)
  9: 4,  // (3,6), (4,5), (5,4), (6,3)
  10: 3, // (4,6), (5,5), (6,4)
  11: 2, // (5,6), (6,5)
  12: 1, // (6,6)
};

export const getOutcomesCount = (
  currentSum: number,
  prediction: DicePrediction
): number => {
  let count = 0;
  for (let sum = 2; sum <= 12; sum++) {
    const ways = DICE_OUTCOMES[sum];
    if (prediction === 'higher' && sum > currentSum) {
      count += ways;
    } else if (prediction === 'lower' && sum < currentSum) {
      count += ways;
    } else if (prediction === 'equal' && sum === currentSum) {
      count += ways;
    }
  }
  return count;
};

export const getDynamicMultiplier = (
  currentSum: number,
  prediction: DicePrediction
): number => {
  const ways = getOutcomesCount(currentSum, prediction);
  if (ways === 0) return 0;
  const targetRTP = 0.92;
  return Number(((targetRTP * 36) / ways).toFixed(3));
};
