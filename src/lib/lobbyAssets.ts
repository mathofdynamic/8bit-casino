/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LobbyAsset = {
  thumbnailSrc: string;
  fullSrc: string;
  alt: string;
  objectPosition?: string;
};

export const LOBBY_ASSETS = {
  featuredHero: {
    thumbnailSrc: "https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWe8xjqGd1bg6YJhydCKQtTLB5jAR4m2uX0zPG",
    fullSrc: "https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWDMkhSa9ixR3WIOJy8zYmjbfacr4XKVl9H1vk",
    alt: "Featured Mega Fortune retro pixel-art slot cabinet",
    objectPosition: "center 30%"
  },
  lucky7s: {
    thumbnailSrc: "https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWjQ8R2bv6CiBJP01qH5eQ2bfsWrEmvoOgzyuU",
    fullSrc: "https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWzQPjCTOc43O7gYVEtqRioGQBDlCUkX9yv5eJ",
    alt: "Lucky 7s slot game artwork with golden reels and flaming sevens",
    objectPosition: "center"
  },
  texasHoldem: {
    thumbnailSrc: "https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWuBpEXknkCBxj2l8hVPvKnTDJmfqNSEXA1U9W",
    fullSrc: "https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWa2KM9PzV7nKCWNQtX5A9MYsSFDeirbP10oRI",
    alt: "Texas Hold'em classic green felt card table",
    objectPosition: "center"
  },
  rouletteLive: {
    thumbnailSrc: "https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWsbpnZIw5DtHG1BxL4g6PpZ0TrUXaAzNoqfQS",
    fullSrc: "https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWfgRGEs8DY5ZCS1wzthlRpLQNXIym98rOcGAU",
    alt: "Roulette Live wheel with neon green indicators",
    objectPosition: "center"
  },
  megaStack: {
    thumbnailSrc: "https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWc0CcbPoBVpdvf7Fh5uzkeqXcwij9AGrOJSNP",
    fullSrc: "https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWwIMu9d1Wp1OnfEJYSdlCexMrIy2uBg9RLNX7",
    alt: "Mega Stack cascading gold chips multiplier bonus game",
    objectPosition: "center"
  },
  neonBlackjack: {
    thumbnailSrc: "https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWyHkUFo7lUKATdVNJ9uFHaQnLBZC7hWXcpzrO",
    fullSrc: "https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWa2ku8LAV7nKCWNQtX5A9MYsSFDeirbP10oRI",
    alt: "Neon Blackjack virtual dealer card layout",
    objectPosition: "center"
  },
  goldRush: {
    thumbnailSrc: "https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWOb2N6ixTWS4HIZ2PlMtVGkv0pb8JzqFNsBAj",
    fullSrc: "https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWvwMMaSlgMpamP0ofXLCZx1UeJ2gY9cjNA3yn",
    alt: "Gold Rush classic mine cart jackpot puzzle game",
    objectPosition: "center"
  }
} satisfies Record<string, LobbyAsset>;
