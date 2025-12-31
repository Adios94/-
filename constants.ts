
import { GameState, GameStage, Role, MarketingOption } from "./types";

export const PLATFORMS = ['Steam', 'PlayStation', 'Xbox', 'Mobile'];
export const ROLES_ORDER = [Role.DESIGNER, Role.PROGRAMMER, Role.ARTIST];

export const MARKETING_OPTIONS: MarketingOption[] = [
  { id: 'bilibili', name: 'B站头部UP主试玩', cost: 50000, boost: 1.5, icon: '📺', desc: '大幅提升国内核心玩家关注。' },
  { id: 'youtube', name: 'YouTube 全球宣发', cost: 120000, boost: 2.0, icon: '🌐', desc: '打开国际市场，销量翻倍。' },
  { id: 'xiaohongshu', name: '小红书视觉营销', cost: 30000, boost: 1.2, icon: '📕', desc: '吸引非硬核及外观党玩家。' },
  { id: 'discord', name: 'Discord 社区激励', cost: 15000, boost: 1.1, icon: '💬', desc: '维持热度，减少销量衰减。' },
  { id: 'tiktok', name: 'TikTok 短视频病毒营销', cost: 80000, boost: 1.7, icon: '🎵', desc: '极高瞬时流量，爆发力强。' },
  { id: 'ign', name: 'IGN 独家实机演示', cost: 100000, boost: 1.8, icon: '🎮', desc: '权威背书，显著提升全球热度。' },
];

export const THEME_TAGS = [
  '修仙', '赛博朋克', '克苏鲁', '三国', '废土', '二次元', 
  '武侠', '恐怖', '恋爱', '机甲', '种田', '开放世界',
  '丧尸', '宫斗', 'furry', '肉鸽(Roguelike)'
];

export const GENRES = [
  'RPG (角色扮演)', 
  'FPS (第一人称射击)', 
  'ACT (动作)', 
  'AVG (文字冒险)', 
  'SLG (策略)', 
  'MOBA (战术竞技)', 
  'Galgame (美少女游戏)', 
  'Puzzle (解谜)',
  'MMORPG (大型多人在线)',
  'Sim (模拟经营)'
];

// Fix: Moved INITIAL_STATE declaration after its dependencies (THEME_TAGS) to resolve block-scoped variable hoisting error.
export const INITIAL_STATE: GameState = {
  money: 1000000, 
  stage: GameStage.HIRING,
  config: {
    title: "",
    theme: "",
    genre: "",
    isMultiplayer: false,
    hasModSupport: false,
    platform: ['Steam'],
  },
  engineering: {
    engine: 'Unity',
    aiAssistance: 'None',
    graphicsLevel: 'Stylized',
    upfrontCost: 50000,
    speedMultiplier: 1.0,
    qualityMultiplier: 1.0,
    optimizationLevel: 'Standard',
    dependencyStrategy: 'Rich Middleware'
  },
  team: {
    designer: null,
    programmer: null,
    artist: null,
  },
  currentMonth: 0,
  totalExpectedMonths: 20, 
  monthlyBurnRate: 0,
  morale: 100,
  progress: 0,
  isCrunching: false,
  currentTrend: THEME_TAGS[Math.floor(Math.random() * THEME_TAGS.length)], // Set a random initial trend
  stats: {
    quality: 10,
    hype: 10,
    bugs: 0,
  },
  price: 60,
  selectedMarketing: [],
  logs: ["系统启动...", "加载制作人模块...", "资金账户连接成功..."],
  activeApp: 'NONE',
  history: [],
};
