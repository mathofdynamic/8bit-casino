/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Card {
  suit: 'H' | 'D' | 'C' | 'S'; // Hearts, Diamonds, Clubs, Spades
  rank: number; // 2 to 14 (Ace)
}

export interface HandEvaluation {
  rank: number; // 1 to 9
  name: string; // e.g., "Full House"
  values: number[]; // For tie-breaking
}

export interface PlayerState {
  id: string; // 'player' or bot name
  name: string;
  avatarId: number;
  stack: number;
  bet: number; // Bet in current round
  cards: Card[];
  isFolded: boolean;
  isAllIn: boolean;
  isBot: boolean;
  difficulty?: 'BEGINNER' | 'CASUAL' | 'ADVANCED' | 'EXPERT';
  lastAction?: string; // e.g. "Check", "Call", "Raise $5", "Fold"
  hasActed?: boolean;
}

// Global suit symbols
export const SUIT_SYMBOLS = {
  H: '♥',
  D: '♦',
  C: '♣',
  S: '♠'
};

// Generate standard deck
export function createDeck(): Card[] {
  const suits: ('H' | 'D' | 'C' | 'S')[] = ['H', 'D', 'C', 'S'];
  const deck: Card[] = [];
  for (const suit of suits) {
    for (let rank = 2; rank <= 14; rank++) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

// Shuffle deck using Fisher-Yates
export function shuffleDeck(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

// Format rank as readable text
export function formatRank(rank: number): string {
  if (rank <= 10) return rank.toString();
  if (rank === 11) return 'J';
  if (rank === 12) return 'Q';
  if (rank === 13) return 'K';
  return 'A';
}

// Generate all combinations of k items from array
export function getCombinations<T>(array: T[], k: number): T[][] {
  const result: T[][] = [];
  function helper(start: number, combo: T[]) {
    if (combo.length === k) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i < array.length; i++) {
      combo.push(array[i]);
      helper(i + 1, combo);
      combo.pop();
    }
  }
  helper(0, []);
  return result;
}

// Evaluates a strict 5-card hand
export function evaluate5CardHand(cards: Card[]): HandEvaluation {
  if (cards.length !== 5) {
    throw new Error('Hand must contain exactly 5 cards to evaluate.');
  }

  // Sort by rank descending
  const sorted = [...cards].sort((a, b) => b.rank - a.rank);
  const ranks = sorted.map(c => c.rank);
  const suits = sorted.map(c => c.suit);

  const isFlush = suits.every(s => s === suits[0]);

  // Check straight
  let isStraight = false;
  let straightHigh = 0;

  // Ace-low straight check: A-5-4-3-2 (ranks 14, 5, 4, 3, 2)
  const isAceLowStraight = 
    ranks[0] === 14 && 
    ranks[1] === 5 && 
    ranks[2] === 4 && 
    ranks[3] === 3 && 
    ranks[4] === 2;

  if (isAceLowStraight) {
    isStraight = true;
    straightHigh = 5;
  } else {
    // Normal straight check
    let consecutive = true;
    for (let i = 0; i < 4; i++) {
      if (ranks[i] - ranks[i + 1] !== 1) {
        consecutive = false;
        break;
      }
    }
    if (consecutive) {
      isStraight = true;
      straightHigh = ranks[0];
    }
  }

  // Count frequencies of each rank
  const counts: { [key: number]: number } = {};
  for (const r of ranks) {
    counts[r] = (counts[r] || 0) + 1;
  }

  const freq = Object.entries(counts).map(([rank, count]) => ({
    rank: parseInt(rank),
    count
  })).sort((a, b) => b.count - a.count || b.rank - a.rank);

  // 1. Straight Flush
  if (isFlush && isStraight) {
    return {
      rank: 9,
      name: straightHigh === 14 ? 'Royal Flush' : 'Straight Flush',
      values: [straightHigh]
    };
  }

  // 2. Four of a Kind
  if (freq[0].count === 4) {
    return {
      rank: 8,
      name: 'Four of a Kind',
      values: [freq[0].rank, freq[1].rank]
    };
  }

  // 3. Full House
  if (freq[0].count === 3 && freq[1].count === 2) {
    return {
      rank: 7,
      name: 'Full House',
      values: [freq[0].rank, freq[1].rank]
    };
  }

  // 4. Flush
  if (isFlush) {
    return {
      rank: 6,
      name: 'Flush',
      values: ranks
    };
  }

  // 5. Straight
  if (isStraight) {
    return {
      rank: 5,
      name: 'Straight',
      values: [straightHigh]
    };
  }

  // 6. Three of a Kind
  if (freq[0].count === 3) {
    return {
      rank: 4,
      name: 'Three of a Kind',
      values: [freq[0].rank, freq[1].rank, freq[2].rank]
    };
  }

  // 7. Two Pair
  if (freq[0].count === 2 && freq[1].count === 2) {
    return {
      rank: 3,
      name: 'Two Pair',
      values: [freq[0].rank, freq[1].rank, freq[2].rank]
    };
  }

  // 8. One Pair
  if (freq[0].count === 2) {
    return {
      rank: 2,
      name: 'One Pair',
      values: [freq[0].rank, freq[1].rank, freq[2].rank, freq[3].rank]
    };
  }

  // 9. High Card
  return {
    rank: 1,
    name: 'High Card',
    values: ranks
  };
}

// Evaluates a list of 5 to 7 cards to find the absolute best 5-card combination
export function evaluateBestHand(cards: Card[]): HandEvaluation {
  if (cards.length < 5) {
    // If fewer than 5 cards, evaluate with what we have
    return {
      rank: 1,
      name: 'High Card',
      values: cards.map(c => c.rank).sort((a, b) => b - a)
    };
  }

  const combos = getCombinations(cards, 5);
  let bestHand: HandEvaluation = evaluate5CardHand(combos[0]);

  for (let i = 1; i < combos.length; i++) {
    const hand = evaluate5CardHand(combos[i]);
    if (compareHands(hand, bestHand) > 0) {
      bestHand = hand;
    }
  }

  return bestHand;
}

// Returns > 0 if a is stronger, < 0 if b is stronger, 0 if equal
export function compareHands(a: HandEvaluation, b: HandEvaluation): number {
  if (a.rank !== b.rank) {
    return a.rank - b.rank;
  }
  for (let i = 0; i < Math.min(a.values.length, b.values.length); i++) {
    if (a.values[i] !== b.values[i]) {
      return a.values[i] - b.values[i];
    }
  }
  return 0;
}

// Bot AI - decision logic based on hand evaluation & game status
export function getBotDecision(
  bot: PlayerState,
  communityCards: Card[],
  currentBet: number,
  toCall: number,
  pot: number,
  minRaise: number
): { action: 'FOLD' | 'CHECK' | 'CALL' | 'RAISE'; amount: number } {
  const currentHand = [...bot.cards, ...communityCards];
  const totalCards = currentHand.length;

  let handStrengthScore = 0.5; // Default neutral score

  if (totalCards < 5) {
    // Pre-flop evaluation based on hole cards
    const r1 = bot.cards[0].rank;
    const r2 = bot.cards[1].rank;
    const isPair = r1 === r2;
    const isSuited = bot.cards[0].suit === bot.cards[1].suit;
    const highCard = Math.max(r1, r2);
    const gap = Math.abs(r1 - r2);

    if (isPair) {
      handStrengthScore = highCard >= 10 ? 0.95 : 0.8;
    } else {
      let score = (highCard - 2) / 12 * 0.6; // High card weight
      if (isSuited) score += 0.15; // Suited bonus
      if (gap <= 2) score += 0.1; // Connector bonus
      handStrengthScore = Math.min(0.9, score);
    }
  } else {
    // Post-flop: evaluate the actual hand rank
    const evaluation = evaluateBestHand(currentHand);
    
    // Convert 1-9 rank to a strength scale 0.0 to 1.0
    // rank 1 (High card) -> 0.1 to 0.3
    // rank 2 (One pair) -> 0.4 to 0.55
    // rank 3 (Two pair) -> 0.6 to 0.7
    // rank 4+ (Three of a kind+) -> 0.75 to 1.0
    if (evaluation.rank === 1) {
      handStrengthScore = 0.1 + (evaluation.values[0] / 14) * 0.2;
    } else if (evaluation.rank === 2) {
      handStrengthScore = 0.4 + (evaluation.values[0] / 14) * 0.15;
    } else if (evaluation.rank === 3) {
      handStrengthScore = 0.6 + (evaluation.values[0] / 14) * 0.1;
    } else {
      handStrengthScore = 0.75 + ((evaluation.rank - 4) / 5) * 0.25;
    }

    // Add drawing potential weight if only 5 or 6 cards
    if (totalCards < 7) {
      // Check for Flush draw: 4 cards of same suit
      const suitsCount: { [key: string]: number } = {};
      for (const c of currentHand) {
        suitsCount[c.suit] = (suitsCount[c.suit] || 0) + 1;
      }
      const maxSuitCount = Math.max(...Object.values(suitsCount));
      if (maxSuitCount === 4) {
        handStrengthScore += 0.15;
      }

      // Check for straight draw: 4 sequential ranks
      const uniqueRanks = Array.from(new Set(currentHand.map(c => c.rank))).sort((a, b) => a - b);
      let consecutiveMax = 1;
      let consecutiveCurrent = 1;
      for (let i = 0; i < uniqueRanks.length - 1; i++) {
        if (uniqueRanks[i + 1] - uniqueRanks[i] === 1) {
          consecutiveCurrent++;
          consecutiveMax = Math.max(consecutiveMax, consecutiveCurrent);
        } else if (uniqueRanks[i + 1] - uniqueRanks[i] > 1) {
          consecutiveCurrent = 1;
        }
      }
      if (consecutiveMax === 4) {
        handStrengthScore += 0.12;
      }
    }
  }

  // Factor in bot difficulty
  const diff = bot.difficulty || 'CASUAL';
  let randomFactor = Math.random() * 0.2 - 0.1; // random fluctuation
  
  if (diff === 'BEGINNER') {
    handStrengthScore *= 0.8; // plays more conservatively/timidly
  } else if (diff === 'EXPERT') {
    handStrengthScore += 0.05; // plays slightly sharper
  }

  const finalStrength = Math.max(0, Math.min(1, handStrengthScore + randomFactor));

  // Decision threshold
  // potOdds = amount to call / (pot + amount to call)
  const amountToCall = toCall;
  const potOdds = amountToCall > 0 ? amountToCall / (pot + amountToCall) : 0;

  // Let's decide action
  if (amountToCall === 0) {
    // We can Check or Raise
    if (finalStrength > 0.75) {
      // Raise
      const raiseAmt = minRaise + (finalStrength - 0.7) * pot * 0.5;
      const actualRaise = Math.min(bot.stack, Math.round(raiseAmt * 100) / 100);
      if (actualRaise >= minRaise) {
        return { action: 'RAISE', amount: actualRaise };
      }
    }
    return { action: 'CHECK', amount: 0 };
  } else {
    // We can Fold, Call, or Raise
    // If the card strength supports pot odds or is very high
    if (finalStrength > potOdds + 0.15 || finalStrength > 0.6) {
      // Should we Raise?
      if (finalStrength > 0.8 && bot.stack > minRaise) {
        const raiseAmt = toCall + minRaise + (finalStrength - 0.8) * pot * 0.4;
        const actualRaise = Math.min(bot.stack, Math.round(raiseAmt * 100) / 100);
        if (actualRaise >= toCall + minRaise) {
          return { action: 'RAISE', amount: actualRaise };
        }
      }
      // Otherwise Call
      const callAmt = Math.min(bot.stack, amountToCall);
      return { action: 'CALL', amount: callAmt };
    }

    // Occasional bluff check for expert/advanced
    if ((diff === 'ADVANCED' || diff === 'EXPERT') && Math.random() < 0.08) {
      // Small chance to bluff raise!
      if (bot.stack > toCall + minRaise) {
        const bluffRaise = toCall + minRaise;
        return { action: 'RAISE', amount: bluffRaise };
      }
    }

    return { action: 'FOLD', amount: 0 };
  }
}
