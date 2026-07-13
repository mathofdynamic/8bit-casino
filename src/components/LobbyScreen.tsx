/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore, AppRoute } from '../store';
import { 
  ProgressivePixelImage, 
  CasinoPanel, 
  CasinoButton, 
  CasinoIconButton, 
  CasinoBadge, 
  CasinoNavItem, 
  CasinoSidebarItem, 
  CasinoProgressBar, 
  GameCard 
} from './ui-v2';
import { LOBBY_ASSETS } from '../lib/lobbyAssets';
import { PixelAvatar } from '../lib/avatars';
import { audio } from '../lib/audio';
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  HelpCircle, 
  User, 
  Award, 
  Flame, 
  Play, 
  Heart, 
  ChevronRight, 
  Menu, 
  X, 
  Landmark, 
  Trophy, 
  Gamepad2, 
  Gift, 
  ClipboardList,
  Sparkles,
  Crown
} from 'lucide-react';

export const LobbyScreen: React.FC<{ onOpenSettings?: () => void }> = ({ onOpenSettings }) => {
  const { route, profile, setRoute, claimDailyBonus, triggerToast, logout } = useStore();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Games');
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState('');

  // Local Favorites session list
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('8bit_casino_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Keep countdown timer updated for Daily Rewards
  useEffect(() => {
    if (!profile.lastClaimedTimestamp) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = now - profile.lastClaimedTimestamp!;
      const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
      const remaining = MILLISECONDS_IN_A_DAY - diff;

      if (remaining <= 0) {
        setTimeLeftStr('');
      } else {
        const hrs = Math.floor(remaining / (60 * 60 * 1000));
        const mins = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        const secs = Math.floor((remaining % (60 * 1000)) / 1000);
        setTimeLeftStr(
          `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [profile.lastClaimedTimestamp]);

  const isClaimedToday = () => {
    if (!profile.lastClaimedTimestamp) return false;
    const now = Date.now();
    return (now - profile.lastClaimedTimestamp) < (24 * 60 * 60 * 1000);
  };

  const handleClaimReward = async () => {
    if (isClaimedToday()) {
      audio.playClick();
      triggerToast('DAILY BONUSES ARE COOLING DOWN!', 'error');
      return;
    }
    const result = await claimDailyBonus();
    if (result.success) {
      audio.playWin();
    }
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      try {
        localStorage.setItem('8bit_casino_favorites', JSON.stringify(updated));
      } catch (e) {}
      audio.playClick();
      return updated;
    });
  };

  // Local static list of Popular Games
  const games = [
    {
      id: 'lucky7s',
      title: 'Lucky 7s',
      category: 'Slots',
      asset: LOBBY_ASSETS.lucky7s,
      metadata: 'Payout: 98.4%',
      badge: 'HOT',
      destination: 'minigames' as AppRoute,
    },
    {
      id: 'texasHoldem',
      title: 'Texas Hold’em',
      category: 'Poker',
      asset: LOBBY_ASSETS.texasHoldem,
      metadata: 'Players: 1,420',
      destination: 'poker' as AppRoute,
    },
    {
      id: 'rouletteLive',
      title: 'Roulette Live',
      category: 'Live Casino',
      asset: LOBBY_ASSETS.rouletteLive,
      metadata: 'RTP: 97.3%',
      destination: 'minigames' as AppRoute,
    },
    {
      id: 'megaStack',
      title: 'Mega Stack',
      category: 'Slots',
      asset: LOBBY_ASSETS.megaStack,
      metadata: 'Min Bet: $1',
      badge: 'NEW',
      destination: 'minigames' as AppRoute,
    },
    {
      id: 'neonBlackjack',
      title: 'Neon Blackjack',
      category: 'Table Games',
      asset: LOBBY_ASSETS.neonBlackjack,
      metadata: 'RTP: 99.6%',
      destination: 'minigames' as AppRoute,
    },
    {
      id: 'goldRush',
      title: 'Gold Rush',
      category: 'Slots',
      asset: LOBBY_ASSETS.goldRush,
      metadata: 'Jackpot Game',
      destination: 'minigames' as AppRoute,
    }
  ];

  // Search, Category, and Favorites tab filtering combined
  const filteredGames = games.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'Slots') matchesTab = g.category === 'Slots';
    else if (activeTab === 'Poker') matchesTab = g.category === 'Poker';
    else if (activeTab === 'Table Games') matchesTab = g.category === 'Table Games' || g.category === 'Poker';
    else if (activeTab === 'Live') matchesTab = g.category === 'Live Casino';
    else if (activeTab === 'New') matchesTab = g.badge === 'NEW' || g.badge === 'HOT';
    else if (activeTab === 'Jackpots') {
      matchesTab = g.title.toLowerCase().includes('fortune') || 
                   g.title.toLowerCase().includes('mega') || 
                   g.title.toLowerCase().includes('gold') || 
                   g.title.toLowerCase().includes('7s');
    }
    
    const matchesFavorites = filterFavoritesOnly ? favorites.includes(g.id) : true;

    return matchesSearch && matchesTab && matchesFavorites;
  });

  const handleScrollTo = (id: string) => {
    audio.playClick();
    setIsMobileMenuOpen(false);
    
    // Smooth scroll down to target section
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      triggerToast(`SCROLLING TO ${id.toUpperCase()} MODULE`, 'info');
    }
  };

  const handleLiveCasinoToast = () => {
    audio.playClick();
    triggerToast('LIVE CASINO STREAM IS CURRENTLY DOWN FOR RE-MAINTENANCE!', 'info');
  };

  const handleLogoutWithConfirmation = () => {
    audio.playClick();
    if (confirm('RETURN TO MAIN TITLE SCREEN?')) {
      logout();
    }
  };

  // Reusable Left Sidebar Content rendering block
  const SidebarContent = () => (
    <>
      <CasinoSidebarItem 
        active={!filterFavoritesOnly} 
        onClick={() => {
          audio.playClick();
          setFilterFavoritesOnly(false);
        }}
        icon={<Flame className="w-5 h-5" />}
      >
        Home
      </CasinoSidebarItem>
      <CasinoSidebarItem 
        active={filterFavoritesOnly} 
        onClick={() => {
          audio.playClick();
          setFilterFavoritesOnly(true);
        }}
        icon={<Heart className="w-5 h-5" />}
      >
        Favorites ({favorites.length})
      </CasinoSidebarItem>
      <CasinoSidebarItem 
        onClick={() => handleScrollTo('continue-playing')}
        icon={<Gamepad2 className="w-5 h-5" />}
      >
        Recently Played
      </CasinoSidebarItem>
      <CasinoSidebarItem 
        onClick={() => handleScrollTo('daily-rewards')}
        icon={<Gift className="w-5 h-5" />}
      >
        Rewards
      </CasinoSidebarItem>
      <CasinoSidebarItem 
        onClick={() => handleScrollTo('missions')}
        icon={<ClipboardList className="w-5 h-5" />}
      >
        Missions
      </CasinoSidebarItem>
      <CasinoSidebarItem 
        onClick={() => handleScrollTo('tournaments')}
        icon={<Trophy className="w-5 h-5" />}
      >
        Tournaments
      </CasinoSidebarItem>
      <CasinoSidebarItem 
        onClick={() => triggerToast('VIP CLUB REQUIRES HIGHER PLAYER XP LEVEL!', 'info')}
        icon={<Crown className="w-5 h-5" />}
      >
        VIP Club
      </CasinoSidebarItem>
    </>
  );

  const SidebarLowerContent = () => (
    <div className="space-y-1.5 pt-4 border-t border-[#2E3150]">
      {onOpenSettings && (
        <CasinoSidebarItem 
          onClick={() => {
            audio.playClick();
            onOpenSettings();
          }}
          icon={<Settings className="w-5 h-5" />}
        >
          Settings
        </CasinoSidebarItem>
      )}
      <CasinoSidebarItem 
        onClick={() => {
          audio.playClick();
          setIsHelpModalOpen(true);
        }}
        icon={<HelpCircle className="w-5 h-5" />}
      >
        Help
      </CasinoSidebarItem>
      <CasinoSidebarItem 
        onClick={handleLogoutWithConfirmation}
        icon={<LogOut className="w-5 h-5 text-[#E85D68]" />}
        className="hover:bg-[#E85D68]/10"
      >
        Log Out
      </CasinoSidebarItem>
    </div>
  );

  // Reusable right-rail modules
  const DailyRewardsModule = () => (
    <CasinoPanel 
      title="Daily Loot Chest" 
      subtitle="FREE PLAY COINS REPLENISH CYCLE" 
      borderColor="default"
      footer={
        <div className="w-full flex justify-between items-center text-xs text-[#9A9AB5] uppercase font-jersey">
          <span>COOLDOWN: 24 HOURS</span>
          <button 
            onClick={() => triggerToast('BONUS MULTIPLIES FOR EVERY CONSECUTIVE LOG IN!', 'info')}
            className="text-[#54D6D9] hover:underline cursor-pointer"
          >
            VIEW ALL
          </button>
        </div>
      }
    >
      <div className="space-y-4 font-jersey">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-[#222744] border border-[#2E3150] text-[#F6B73C] text-lg select-none">🏆</div>
            <div>
              <span className="text-sm text-[#9A9AB5] block uppercase leading-none">DAILY STREAK</span>
              <span className="text-xl text-[#F3EBD8] uppercase leading-none mt-1 block">{profile.dailyStreak} DAYS ACTIVE</span>
            </div>
          </div>
          <CasinoBadge variant={isClaimedToday() ? "dark" : "magenta"}>
            {isClaimedToday() ? "CLAIMED" : "AVAILABLE"}
          </CasinoBadge>
        </div>

        <div className="bg-[#0B0D18] border border-[#2E3150] p-3 text-center">
          {isClaimedToday() ? (
            <div className="space-y-1">
              <span className="text-[#9A9AB5] uppercase text-xs block leading-none">NEXT LOOT DISPENSE IN</span>
              <span className="text-2xl text-[#F29E4C] block leading-none py-1">{timeLeftStr || "00:00:00"}</span>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-[#9A9AB5] uppercase text-xs block leading-none">READY FOR INJECTION</span>
              <CasinoButton 
                variant="gold" 
                size="md" 
                shimmer={true}
                className="w-full filter drop-shadow-[2px_2px_0px_#000000]"
                onClick={handleClaimReward}
              >
                CLAIM $1.00 FREE
              </CasinoButton>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[#9A9AB5] uppercase leading-none">
            <span>STREAK MULTIPLIER METER</span>
            <span>{Math.min(7, profile.dailyStreak)} / 7 DAYS</span>
          </div>
          <CasinoProgressBar value={Math.min(100, (profile.dailyStreak % 8) * 14.3)} color="magenta" segments={7} />
        </div>
      </div>
    </CasinoPanel>
  );

  const MissionsModule = () => (
    <CasinoPanel 
      title="Daily Missions" 
      subtitle="COMPLETE CHALLENGES FOR BONUS XP"
      borderColor="default"
    >
      <div className="space-y-4 font-jersey">
        {/* Mission 1 */}
        <div className="border border-[#2E3150] bg-[#0B0D18] p-3">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-lg text-[#F3EBD8] uppercase leading-none font-bold">Win 10,000 Coins</h4>
              <p className="text-xs text-[#9A9AB5] uppercase mt-1 leading-none">Reward: 250 XP</p>
            </div>
            <span className="text-xs text-[#54D6D9] uppercase font-bold">42%</span>
          </div>
          <CasinoProgressBar value={42} color="cyan" segments={10} />
          <div className="flex justify-between text-[11px] text-[#63657A] uppercase mt-1">
            <span>Progress</span>
            <span>4,200 / 10,000 Coins</span>
          </div>
        </div>

        {/* Mission 2 */}
        <div className="border border-[#2E3150] bg-[#0B0D18] p-3">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-lg text-[#F3EBD8] uppercase leading-none font-bold">Play 15 Slot Spins</h4>
              <p className="text-xs text-[#9A9AB5] uppercase mt-1 leading-none">Reward: 150 XP</p>
            </div>
            <span className="text-xs text-[#54D6D9] uppercase font-bold">80%</span>
          </div>
          <CasinoProgressBar value={80} color="cyan" segments={10} />
          <div className="flex justify-between text-[11px] text-[#63657A] uppercase mt-1">
            <span>Progress</span>
            <span>12 / 15 Spins</span>
          </div>
        </div>
      </div>
    </CasinoPanel>
  );

  return (
    <div className="casino-dashboard min-h-screen flex flex-col bg-[#0B0D18] text-[#F3EBD8] font-jersey select-none overflow-x-hidden">
      
      {/* 1. TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-[#15182A] border-b-2 border-[#2E3150] h-14 shrink-0 flex items-center px-4 justify-between">
        
        {/* Left branding and hamburger */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => {
              audio.playClick();
              setIsMobileMenuOpen(true);
            }}
            className="md:hidden text-[#9A9AB5] hover:text-[#F3EBD8] cursor-pointer focus:outline-none"
            aria-label="Open side navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div 
            onClick={() => {
              audio.playClick();
              setFilterFavoritesOnly(false);
              setRoute('lobby');
            }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="text-2xl text-[#F6B73C] leading-none">🎰</span>
            <span className="text-2xl font-jersey text-[#F6B73C] tracking-widest uppercase leading-none pt-0.5">
              8bit Casino
            </span>
          </div>

          {/* Nav links (hidden on mobile, visible on desktop/tablet) */}
          <nav className="hidden md:flex items-center ml-4 border-l border-[#2E3150] pl-4 h-14">
            <CasinoNavItem active={route === 'lobby' && !filterFavoritesOnly} onClick={() => { audio.playClick(); setFilterFavoritesOnly(false); setRoute('lobby'); }}>Lobby</CasinoNavItem>
            <CasinoNavItem active={false} onClick={() => { audio.playClick(); setRoute('minigames'); }}>Slots</CasinoNavItem>
            <CasinoNavItem active={false} onClick={() => { audio.playClick(); setRoute('poker'); }}>Table Games</CasinoNavItem>
            <CasinoNavItem active={false} onClick={handleLiveCasinoToast}>Live Casino</CasinoNavItem>
            <CasinoNavItem active={false} onClick={() => handleScrollTo('tournaments')}>Tournaments</CasinoNavItem>
          </nav>
        </div>

        {/* Right HUD items */}
        <div className="flex items-center gap-3">
          
          {/* Search container (hidden on mobile, visible on desktop/tablet) */}
          <div className="hidden sm:flex items-center bg-[#0B0D18] border border-[#2E3150] px-2.5 h-9" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
            <Search className="w-4 h-4 text-[#63657A]" />
            <input 
              type="text" 
              placeholder="SEARCH GAMES..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent font-jersey text-base border-none outline-none w-28 lg:w-40 ml-2 text-[#F3EBD8] placeholder-[#63657A] focus:ring-0 leading-none"
            />
          </div>

          {/* Notification badge button */}
          <button 
            onClick={() => {
              audio.playClick();
              triggerToast('YOUR MAILBOX IS CURRENTLY SECURED!', 'info');
            }}
            className="relative p-1.5 text-[#9A9AB5] hover:text-[#F3EBD8] cursor-pointer"
            aria-label="View system notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#D95F9A] border border-black" />
          </button>

          {/* Stepped Coin Ticker HUD */}
          <div className="p-[2px] bg-[#F6B73C] hover:opacity-95 cursor-pointer" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }} onClick={() => setRoute('profile')}>
            <div className="bg-[#15182A] px-2 py-0.5 flex items-center gap-1.5" style={{ clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)' }}>
              {/* Coin icon SVG */}
              <svg className="w-4 h-4 animate-pulse shrink-0" viewBox="0 0 16 16" fill="none">
                <path d="M6 1h4v1H6V1zM4 2h2v1H4V2zm6 0h2v1h-2V2zM2 4h2v1H2V4zm10 0h2v1h-2V4zM1 6h1v4H1V6zm13 0h1v4h-1V6zM2 11h2v1H2v-1zm10 0h2v1h-2v-1zm-6 2h4v1H6v-1z" fill="#F6B73C"/>
                <rect x="5" y="4" width="6" height="8" fill="#FFC85E"/>
                <rect x="7" y="5" width="2" height="6" fill="#F6B73C"/>
              </svg>
              <span className="text-lg font-bold text-[#F6B73C] pt-0.5 leading-none">
                ${profile.chips.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Profile Quick Link */}
          <div 
            onClick={() => {
              audio.playClick();
              setRoute('profile');
            }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 pl-1 border-l border-[#2E3150] h-9"
          >
            <PixelAvatar avatarId={profile.avatarId} googlePicture={profile.googlePicture} size={28} />
            <span className="hidden lg:inline font-jersey text-lg text-[#F3EBD8] uppercase leading-none pt-0.5">
              {profile.name}
            </span>
          </div>

          {/* Quick Settings Icon */}
          {onOpenSettings && (
            <button 
              onClick={() => {
                audio.playClick();
                onOpenSettings();
              }}
              className="hidden sm:inline-flex p-1.5 text-[#9A9AB5] hover:text-[#F3EBD8] cursor-pointer"
              aria-label="Open settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}

          {/* Log Out Icon */}
          <button 
            onClick={handleLogoutWithConfirmation}
            className="hidden sm:inline-flex p-1.5 text-[#9A9AB5] hover:text-[#E85D68] cursor-pointer"
            aria-label="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. MAIN CORE SPLIT VIEW CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT SIDEBAR (Desktop/Tablet wide width) */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 bg-[#15182A] border-r-2 border-[#2E3150] p-4 justify-between overflow-y-auto">
          <div className="space-y-1.5">
            <SidebarContent />
          </div>
          <div>
            <SidebarLowerContent />
          </div>
        </aside>

        {/* MIDDLE SCROLLABLE MAIN SECTION */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative">
          
          {/* SEARCH INPUT BAR FOR PHONE VIEW ONLY */}
          <div className="sm:hidden w-full flex items-center bg-[#15182A] border border-[#2E3150] px-3 py-1.5" style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
            <Search className="w-4 h-4 text-[#63657A] shrink-0" />
            <input 
              type="text" 
              placeholder="SEARCH THE CASINO..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent font-jersey text-lg border-none outline-none w-full ml-2 text-[#F3EBD8] placeholder-[#63657A] focus:ring-0 leading-none pt-0.5"
            />
          </div>

          {/* A. PLAYER SUMMARY STRIP BAR */}
          <div className="bg-[#15182A] border border-[#2E3150] p-4 flex flex-col md:flex-row items-center justify-between gap-4 filter drop-shadow-[2px_2px_0px_#000000]" style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px))' }}>
            <div className="flex items-center gap-3.5 text-center md:text-left flex-col md:flex-row w-full md:w-auto">
              <div className="shrink-0">
                <PixelAvatar avatarId={profile.avatarId} googlePicture={profile.googlePicture} size={48} />
              </div>
              <div>
                <span className="text-xs text-[#9A9AB5] block uppercase leading-none">WELCOME BACK SOLDIER,</span>
                <h2 className="text-3xl text-[#F3EBD8] uppercase tracking-wide leading-none mt-1">{profile.name}</h2>
                <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                  <CasinoBadge variant="gold">LEVEL 32</CasinoBadge>
                  <CasinoBadge variant="cyan">GOLD IV</CasinoBadge>
                  <span className="text-xs text-[#9A9AB5] uppercase">STREAK: <span className="text-[#F6B73C] font-bold">{profile.dailyStreak} DAYS</span></span>
                </div>
              </div>
            </div>

            {/* XP progress bar */}
            <div className="w-full md:w-60 space-y-1.5 shrink-0">
              <div className="flex justify-between text-xs text-[#9A9AB5] uppercase leading-none">
                <span>XP PROGRESSION</span>
                <span>4,820 / 5,000 XP</span>
              </div>
              <CasinoProgressBar value={96} color="gold" segments={10} />
            </div>
          </div>

          {/* B. FEATURED HERO BANNER (MEGA FORTUNE) */}
          <div 
            className="group relative bg-[#15182A] border-2 border-[#2E3150] overflow-hidden filter drop-shadow-[4px_4px_0px_#000000]"
            style={{ 
              clipPath: 'polygon(0% 0%, calc(100% - 16px) 0%, 100% 16px, 100% 100%, 16px 100%, 0% calc(100% - 16px))',
              minHeight: '260px'
            }}
          >
            {/* The full hero pixel art image preloading eagerly */}
            <div className="absolute inset-0 z-0">
              <ProgressivePixelImage
                thumbnailSrc={LOBBY_ASSETS.featuredHero.thumbnailSrc}
                fullSrc={LOBBY_ASSETS.featuredHero.fullSrc}
                alt={LOBBY_ASSETS.featuredHero.alt}
                aspectRatio="h-full w-full"
                objectPosition={LOBBY_ASSETS.featuredHero.objectPosition}
                eager={true} // preloaded eagerly as hero artwork!
                imgClassName="h-full w-full"
              />
              
              {/* Localized deep navy gradient scrim to ensure complete contrast of overlay texts */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D18] via-[#0B0D18]/85 to-transparent" />
            </div>

            {/* Text Overlay Content Left */}
            <div className="relative z-10 p-6 md:p-8 flex flex-col justify-between h-full min-h-[260px] max-w-md md:max-w-xl text-left select-none">
              <div className="space-y-2">
                <CasinoBadge variant="magenta" className="animate-pulse">HOT BANNER</CasinoBadge>
                <h1 className="text-4xl md:text-5xl text-[#F6B73C] uppercase tracking-wider leading-none font-jersey m-0 filter drop-shadow-[2px_2px_0px_#000000]">
                  MEGA FORTUNE
                </h1>
                <p className="text-lg md:text-xl text-[#F3EBD8]/90 uppercase leading-snug tracking-wide max-w-sm">
                  Classic reels. Legendary rewards. Spin the wheels of code!
                </p>
              </div>

              <div className="mt-4 space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-[#D95F9A] text-xl animate-pulse">◆</span>
                  <span className="text-[#D95F9A] text-2xl tracking-wider uppercase leading-none font-bold">
                    JACKPOT: 1,245,678 COINS
                  </span>
                </div>
                
                <div className="flex">
                  <CasinoButton
                    variant="gold"
                    size="lg"
                    shimmer={true}
                    onClick={() => {
                      audio.playClick();
                      setRoute('minigames');
                    }}
                  >
                    PLAY NOW
                  </CasinoButton>
                </div>
              </div>
            </div>
          </div>

          {/* C. CONTINUE PLAYING BANNER */}
          <section id="continue-playing" className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#2E3150] pb-1.5">
              <h3 className="text-2xl text-[#F3EBD8] uppercase tracking-wide leading-none">Continue Playing</h3>
              <span className="text-xs text-[#9A9AB5] uppercase">RECENT SESSION HISTORY</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Card 1: Lucky 7s */}
              <div className="bg-[#15182A] border-2 border-[#2E3150] hover:border-[#54D6D9] p-2 flex gap-3 cursor-pointer select-none filter drop-shadow-[2px_2px_0px_#000000] group" style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }} onClick={() => { audio.playClick(); setRoute('minigames'); }}>
                <div className="w-20 h-20 shrink-0 bg-black border border-[#2E3150] overflow-hidden">
                  <ProgressivePixelImage 
                    thumbnailSrc={LOBBY_ASSETS.lucky7s.thumbnailSrc} 
                    fullSrc={LOBBY_ASSETS.lucky7s.fullSrc} 
                    alt="Lucky 7s" 
                    aspectRatio="h-full w-full"
                    eager={true}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between text-left">
                  <div>
                    <span className="text-[10px] text-[#9A9AB5] uppercase block leading-none">SLOTS GAME</span>
                    <h4 className="text-xl text-[#F3EBD8] uppercase tracking-wide leading-none mt-1 truncate group-hover:text-[#54D6D9]">Lucky 7s</h4>
                    <span className="text-xs text-[#54D6D9] uppercase block mt-1 leading-none">Bet: $0.10</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-[#63657A] uppercase">Played 2h ago</span>
                    <CasinoButton variant="cyan" size="sm" chamfer={4} className="h-6 px-1 text-xs" soundType="click" onClick={(e) => { e.stopPropagation(); audio.playClick(); setRoute('minigames'); }}>
                      RESUME
                    </CasinoButton>
                  </div>
                </div>
              </div>

              {/* Card 2: Texas Hold'em */}
              <div className="bg-[#15182A] border-2 border-[#2E3150] hover:border-[#54D6D9] p-2 flex gap-3 cursor-pointer select-none filter drop-shadow-[2px_2px_0px_#000000] group" style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }} onClick={() => { audio.playClick(); setRoute('poker'); }}>
                <div className="w-20 h-20 shrink-0 bg-black border border-[#2E3150] overflow-hidden">
                  <ProgressivePixelImage 
                    thumbnailSrc={LOBBY_ASSETS.texasHoldem.thumbnailSrc} 
                    fullSrc={LOBBY_ASSETS.texasHoldem.fullSrc} 
                    alt="Texas Hold'em" 
                    aspectRatio="h-full w-full"
                    eager={true}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between text-left">
                  <div>
                    <span className="text-[10px] text-[#9A9AB5] uppercase block leading-none">POKER DUEL</span>
                    <h4 className="text-xl text-[#F3EBD8] uppercase tracking-wide leading-none mt-1 truncate group-hover:text-[#54D6D9]">Hold’em</h4>
                    <span className="text-xs text-[#54D6D9] uppercase block mt-1 leading-none">Bluff: 85%</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-[#63657A] uppercase">Active Tables</span>
                    <CasinoButton variant="cyan" size="sm" chamfer={4} className="h-6 px-1 text-xs" soundType="click" onClick={(e) => { e.stopPropagation(); audio.playClick(); setRoute('poker'); }}>
                      RESUME
                    </CasinoButton>
                  </div>
                </div>
              </div>

              {/* Card 3: Roulette Live */}
              <div className="bg-[#15182A] border-2 border-[#2E3150] hover:border-[#54D6D9] p-2 flex gap-3 cursor-pointer select-none filter drop-shadow-[2px_2px_0px_#000000] group" style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }} onClick={() => { audio.playClick(); setRoute('minigames'); }}>
                <div className="w-20 h-20 shrink-0 bg-black border border-[#2E3150] overflow-hidden">
                  <ProgressivePixelImage 
                    thumbnailSrc={LOBBY_ASSETS.rouletteLive.thumbnailSrc} 
                    fullSrc={LOBBY_ASSETS.rouletteLive.fullSrc} 
                    alt="Roulette Live" 
                    aspectRatio="h-full w-full"
                    eager={true}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between text-left">
                  <div>
                    <span className="text-[10px] text-[#9A9AB5] uppercase block leading-none">LIVE CASINO</span>
                    <h4 className="text-xl text-[#F3EBD8] uppercase tracking-wide leading-none mt-1 truncate group-hover:text-[#54D6D9]">Roulette</h4>
                    <span className="text-xs text-[#54D6D9] uppercase block mt-1 leading-none">Payout: 97.3%</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-[#63657A] uppercase">Live Now</span>
                    <CasinoButton variant="cyan" size="sm" chamfer={4} className="h-6 px-1 text-xs" soundType="click" onClick={(e) => { e.stopPropagation(); audio.playClick(); setRoute('minigames'); }}>
                      RESUME
                    </CasinoButton>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* D. POPULAR GAMES SECTION */}
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#2E3150] pb-1.5 gap-3">
              <h3 className="text-2xl text-[#F3EBD8] uppercase tracking-wide leading-none">Popular Games</h3>
              
              {/* Responsive Category Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {['All Games', 'Slots', 'Poker', 'Table Games', 'Live', 'New', 'Jackpots'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      audio.playClick();
                      setActiveTab(tab);
                    }}
                    className={`px-3 py-1 text-base uppercase font-jersey tracking-wider transition-none cursor-pointer ${
                      activeTab === tab 
                        ? 'bg-[#F6B73C] text-black font-bold' 
                        : 'bg-[#15182A] text-[#9A9AB5] hover:text-[#F3EBD8] hover:bg-[#222744]'
                    }`}
                    style={{ clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)' }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Games Grid container */}
            {filteredGames.length === 0 ? (
              <div className="border border-dashed border-[#2E3150] py-12 text-center text-[#9A9AB5] uppercase text-xl">
                NO GAMES MATCH YOUR ACTIVE SEARCH FILTERS!
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    title={game.title}
                    category={game.category}
                    thumbnailSrc={game.asset.thumbnailSrc}
                    fullSrc={game.asset.fullSrc}
                    metadata={game.metadata}
                    badge={game.badge}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={(e) => handleToggleFavorite(game.id, e)}
                    onClick={() => {
                      audio.playClick();
                      setRoute(game.destination);
                    }}
                  />
                ))}
              </div>
            )}
          </section>

          {/* E. TOURNAMENT BANNER BELOW GAME CONTENT */}
          <section id="tournaments" className="relative filter drop-shadow-[4px_4px_0px_#000000]">
            <div 
              style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px))' }}
              className="bg-[#222744] border-2 border-[#D95F9A]/70 p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 select-none relative"
            >
              {/* Pattern */}
              <div className="absolute inset-0 bg-black opacity-10 pixel-checker pointer-events-none" />

              <div className="relative z-10 flex items-center gap-3 w-full md:w-auto flex-col md:flex-row text-center md:text-left">
                <div className="w-12 h-12 bg-[#D95F9A] border-2 border-[#F3EBD8] flex items-center justify-center text-3xl shrink-0" style={{ clipPath: 'polygon(0% 0%, calc(100% - 6px) 0%, 100% 6px, 100% 100%, 6px 100%, 0% calc(100% - 6px))' }}>
                  👑
                </div>
                <div>
                  <span className="text-[#D95F9A] text-xs block uppercase tracking-wider leading-none font-bold">LIVE COMPETITIVE DUELS</span>
                  <h4 className="text-2xl text-[#F3EBD8] uppercase mt-1 tracking-wide leading-none">PIXEL CROWN CUP</h4>
                  <p className="text-xs text-[#9A9AB5] uppercase mt-1 leading-none">
                    Starts in 18 minutes • Entry: 500 Coins • Prize Pool: 25,000 Coins
                  </p>
                </div>
              </div>

              <div className="relative z-10 shrink-0 w-full md:w-auto">
                <CasinoButton 
                  variant="magenta" 
                  size="sm" 
                  className="w-full filter drop-shadow-[2px_2px_0px_#000000]"
                  onClick={() => {
                    audio.playClick();
                    triggerToast('PIXEL CROWN CUP REGISTRATION LOADED! NEED XP LVL 40.', 'info');
                  }}
                >
                  VIEW TOURNAMENT
                </CasinoButton>
              </div>
            </div>
          </section>

          {/* TABLET / MOBILE UTILITY MODULES (displayed below content in 2-column or 1-column responsive layout) */}
          <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div id="daily-rewards">
              <DailyRewardsModule />
            </div>
            <div id="missions">
              <MissionsModule />
            </div>
          </div>

          {/* F. COMPLIANCE HUMAN FOOTER */}
          <footer className="pt-6 border-t border-[#2E3150] text-center">
            <span className="text-[#63657A] font-jersey text-base uppercase">
              Play coins only — no real value. ★ CABINET EMULATOR v1.0 • PURE PLAY COINS NO REAL VALUE ★
            </span>
          </footer>

        </main>

        {/* RIGHT UTILITY RAIL (Desktop wide only) */}
        <aside className="hidden xl:flex flex-col w-80 shrink-0 bg-[#15182A] border-l-2 border-[#2E3150] p-4 space-y-6 overflow-y-auto">
          <div id="daily-rewards">
            <DailyRewardsModule />
          </div>
          <div id="missions">
            <MissionsModule />
          </div>
        </aside>

      </div>

      {/* 3. HELP MODAL */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 cursor-pointer" onClick={() => { audio.playClick(); setIsHelpModalOpen(false); }} />
          <div className="relative w-full max-w-md z-10">
            <CasinoPanel 
              title="8bit Help Desk" 
              subtitle="CABINET EMULATOR USER MANUAL"
              footer={
                <CasinoButton variant="gold" size="sm" onClick={() => { audio.playClick(); setIsHelpModalOpen(false); }}>
                  UNDERSTOOD
                </CasinoButton>
              }
            >
              <div className="font-jersey text-lg text-[#F3EBD8] space-y-3 uppercase leading-tight">
                <p>Welcome to 8bit Casino Concourse!</p>
                <p className="text-[#9A9AB5]">
                  • Coins are granted weekly and daily inside the Daily Loot Chest.
                </p>
                <p className="text-[#9A9AB5]">
                  • Search & Category tab filters can be dynamically paired to navigate.
                </p>
                <p className="text-[#9A9AB5]">
                  • Tap game cards to play! Other areas like slots & roulette will load our arcade engines.
                </p>
                <p className="text-xs text-[#63657A]">
                  Disclaimer: This console is a simulation for entertainment and play-money tokens. Absolutely zero real money gambling occurs.
                </p>
              </div>
            </CasinoPanel>
          </div>
        </div>
      )}

      {/* 4. MOBILE HAMBURGER NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/80" 
            onClick={() => {
              audio.playClick();
              setIsMobileMenuOpen(false);
            }}
          />
          
          {/* Drawer body */}
          <div 
            className="relative w-64 max-w-[80vw] bg-[#15182A] border-r-2 border-[#2E3150] p-4 flex flex-col justify-between h-full animate-slide-in text-left"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-[#2E3150] pb-3">
                <span className="font-jersey text-2xl text-[#F6B73C] uppercase tracking-wider">NAV DECK</span>
                <button 
                  onClick={() => {
                    audio.playClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-[#9A9AB5] hover:text-[#F3EBD8] cursor-pointer focus:outline-none"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-2">
                <SidebarContent />
              </div>
            </div>
            <div>
              <SidebarLowerContent />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
