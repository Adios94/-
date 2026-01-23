
import { GameState, GameStage, Role, MarketingOption, Achievement, MarketEvent } from "./types";

export const PLATFORMS = ['Steam', 'PlayStation', 'Xbox', 'Mobile'];
export const ROLES_ORDER = [Role.DESIGNER, Role.PROGRAMMER, Role.ARTIST];

// New: Market Events affecting gameplay modifiers
export const MARKET_EVENTS: MarketEvent[] = [
  { 
    id: 'normal', name: '平稳市场', description: '市场波澜不惊，一切按部就班。', 
    effect: { costMultiplier: 1.0, speedMultiplier: 1.0, salesMultiplier: 1.0, hypeMultiplier: 1.0 } 
  },
  { 
    id: 'indie_boom', name: '独立游戏之春', description: '玩家对创意型游戏极度渴望，销量大增，但3A大作关注度下降。', 
    effect: { costMultiplier: 0.9, speedMultiplier: 1.1, salesMultiplier: 1.3, hypeMultiplier: 1.2 } 
  },
  { 
    id: 'chip_shortage', name: '全球芯片短缺', description: '硬件价格飞涨，开发成本剧增，但玩家更珍惜已有的游戏。', 
    effect: { costMultiplier: 1.5, speedMultiplier: 0.8, salesMultiplier: 1.1, hypeMultiplier: 0.9 } 
  },
  { 
    id: 'metaverse_bubble', name: '元宇宙泡沫', description: '资本疯狂涌入，热度极易获取，但开发质量容易注水。', 
    effect: { costMultiplier: 1.2, speedMultiplier: 1.2, salesMultiplier: 0.8, hypeMultiplier: 1.5 } 
  },
  { 
    id: 'economic_recession', name: '经济衰退', description: '玩家钱包紧缩，销量惨淡，但招聘成本降低。', 
    effect: { costMultiplier: 0.7, speedMultiplier: 1.0, salesMultiplier: 0.6, hypeMultiplier: 0.8 } 
  }
];

// New: Configuration for Unlocks based on Company Level
export const LEVEL_CONFIG = {
  GENRES: {
    1: ['RPG (角色扮演)', 'ACT (动作)', 'AVG (文字冒险)', 'Sim (模拟经营)', 'Puzzle (解谜)'],
    2: ['FPS (第一人称射击)', 'SLG (策略)'],
    3: ['Galgame (美少女游戏)', 'MOBA (战术竞技)'],
    4: ['MMORPG (大型多人在线)']
  },
  ENGINES: {
    1: ['RPG Maker', 'Godot'],
    2: ['Unity'],
    3: ['Unreal Engine 5'],
    5: ['Custom Engine']
  },
  PLATFORMS: {
    1: ['Steam', 'Mobile'],
    3: ['Xbox', 'PlayStation']
  }
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_hire', name: '梦开始的地方', description: '成功招募第一位核心成员。', icon: '🤝', requirement: '招募任意员工' },
  { id: 'gold_master', name: '进厂压盘', description: '成功完成第一款游戏的开发。', icon: '📀', requirement: '项目开发进度达到 100%' },
  { id: 'masterpiece', name: '年度最佳', description: '发布一款评分超过 90 分的神作。', icon: '🏆', requirement: '游戏评分 > 90' },
  { id: 'bug_king', name: '育碧精神', description: '发布的项目包含超过 100 个 Bug。', icon: '🪲', requirement: '发售时 Bug 数 > 100' },
  { id: 'crunch_lord', name: '福报导师', description: '累计在福报模式下工作超过 12 个月。', icon: '🔥', requirement: '累计福报时间 > 12个月' },
  { id: 'rich_kid', name: '不差钱', description: '在银行余额超过 200 万时发布游戏。', icon: '💰', requirement: '余额 > 2,000,000' },
  { id: 'dream_team', name: '全明星阵容', description: '团队三名成员均为传奇级别。', icon: '🌟', requirement: '所有员工均为 Legendary 稀有度' },
  { id: 'triple_a', name: '次世代视界', description: '使用 UE5 和写实保真度发布一款游戏。', icon: '🖥️', requirement: 'UE5 + Realistic 图形' },
  { id: 'serial_producer', name: '高产似那啥', description: '累计发布 5 款游戏。', icon: '📚', requirement: '累计发布次数 >= 5' },
  { id: 'ipo', name: '上市敲钟', description: '公司等级达到 10 级。', icon: '🔔', requirement: '公司等级 = 10' },
];

export const MARKETING_OPTIONS: MarketingOption[] = [
  { id: 'bilibili', name: 'B站头部UP主试玩', cost: 50000, boost: 1.5, icon: '📺', desc: '大幅提升国内核心玩家关注。', requiredLevel: 1 },
  { id: 'xiaohongshu', name: '小红书视觉营销', cost: 30000, boost: 1.2, icon: '📕', desc: '吸引非硬核及外观党玩家。', requiredLevel: 1 },
  { id: 'discord', name: 'Discord 社区激励', cost: 15000, boost: 1.1, icon: '💬', desc: '维持热度，减少销量衰减。', requiredLevel: 2 },
  { id: 'tiktok', name: 'TikTok 短视频病毒营销', cost: 80000, boost: 1.7, icon: '🎵', desc: '极高瞬时流量，爆发力强。', requiredLevel: 3 },
  { id: 'ign', name: 'IGN 独家实机演示', cost: 100000, boost: 1.8, icon: '🎮', desc: '权威背书，显著提升全球热度。', requiredLevel: 4 },
  { id: 'youtube', name: 'YouTube 全球宣发', cost: 120000, boost: 2.0, icon: '🌐', desc: '打开国际市场，销量翻倍。', requiredLevel: 5 },
];

export const THEME_TAGS = [
  '修仙', '赛博朋克', '克苏鲁', '三国', '废土', '二次元', 
  '武侠', '恐怖', '恋爱', '机甲', '种田', '开放世界',
  '丧尸', '宫斗', 'furry', '肉鸽'
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

export const INITIAL_STATE: GameState = {
  money: 1000000, 
  reputation: 0,
  companyLevel: 1,
  activeMarketEvent: MARKET_EVENTS[0],
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
  currentTrend: THEME_TAGS[Math.floor(Math.random() * THEME_TAGS.length)],
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
  unlockedAchievements: [],
  totalGamesReleased: 0,
  totalCrunchMonths: 0,
};
