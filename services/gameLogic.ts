
import { Role, StaffMember, DevEvent, GameConfig, FinalResult, GameState } from "../types";

const generateId = () => Math.random().toString(36).substr(2, 9);

// Genre Difficulty Multipliers
const GENRE_COMPLEXITY: Record<string, number> = {
  'RPG (角色扮演)': 0.85, 'FPS (第一人称射击)': 0.9, 'ACT (动作)': 0.8, 'AVG (文字冒险)': 1.3,
  'SLG (策略)': 0.95, 'MOBA (战术竞技)': 0.75, 'Galgame (美少女游戏)': 1.4, 'Puzzle (解谜)': 1.2,
  'MMORPG (大型多人在线)': 0.6, 'Sim (模拟经营)': 1.1
};

// Engine Complexity (The higher the index, the harder it is to master)
const ENGINE_DIFFICULTY: Record<string, number> = {
  'RPG Maker': 10,
  'Godot': 30,
  'Unity': 50,
  'Unreal Engine 5': 80,
  'Custom Engine': 100
};

export const generateLocalComments = (state: GameState, score: number): any[] => {
  const pool = [
    { user: "火星玩家001", text: "这游戏的打击感，绝了！我的手柄都要冒烟了！", sentiment: "pos", category: "masterpiece" },
    { user: "塞伯坦打工仔", text: "神作！很久没玩到这么有诚意的作品了，制作组牛逼！", sentiment: "pos", category: "masterpiece" },
    { user: "BUG猎人", text: "我怀疑我买的是一个BUG模拟器，里面偶尔插播一点游戏内容。", sentiment: "neg", category: "buggy" },
    { user: "退款达人", text: "2小时闪退了20次，我正在写退款申请，大家避雷。", sentiment: "neg", category: "buggy" },
    { user: "韭菜本韭", text: "这价格，制作组是想钱想疯了吧？", sentiment: "neg", category: "expensive" },
    { user: "白嫖之王", text: "太良心了！这种质量卖这个价，买爆！", sentiment: "pos", category: "cheap" },
  ];
  
  let results: any[] = [];
  if (score > 85) results.push(...pool.filter(c => c.category === 'masterpiece'));
  if (state.stats.bugs > 50) results.push(...pool.filter(c => c.category === 'buggy'));
  const needed = 5 - results.length;
  results.push(...pool.sort(() => 0.5 - Math.random()).slice(0, needed));
  return results;
};

export const generateCandidatesLocal = (role: Role): StaffMember[] => {
  const STAFF_TEMPLATES: Record<Role, any[]> = {
    [Role.DESIGNER]: [
      { name: "宫本喵", rarity: "Legendary", skill: "快乐源泉", desc: "任系精神领袖，认为游戏如果不快乐就没有意义。", stats: [99, 50, 85], baseSalary: 55000 },
      { name: "小岛秀妻", rarity: "Legendary", skill: "再次连接", desc: "摸鱼拍电影，顺便把项目预算花光，但粉丝很买账。", stats: [98, 60, 90], baseSalary: 45000 },
      { name: "宫崎老贼", rarity: "Legendary", skill: "恶意", desc: "由于游戏太难，玩家在评价区留下了大量痛苦的泪水。", stats: [99, 40, 95], baseSalary: 50000 },
      { name: "席德·梅爷", rarity: "Legendary", skill: "文明杀手", desc: "他能让你在不知不觉中玩到天亮。", stats: [95, 70, 60], baseSalary: 42000 },
      { name: "陶德·豪宅", rarity: "Epic", skill: "所有的画饼", desc: "所有的细节都在那，只要你愿意相信我的PPT。", stats: [88, 40, 70], baseSalary: 35000 },
      { name: "G胖", rarity: "Epic", skill: "不会数三", desc: "他在度假，但他依然掌控着全球玩家的钱包。", stats: [85, 90, 40], baseSalary: 38000 },
      { name: "三上真喵", rarity: "Epic", skill: "生化危机", desc: "每次开发都威胁要切腹，但从未执行。", stats: [88, 30, 70], baseSalary: 28000 },
      { name: "独立之光", rarity: "Rare", skill: "靠咖啡活命", desc: "在车库里码字，梦想是做出下一个《极乐迪斯科》。", stats: [80, 20, 85], baseSalary: 18000 },
      { name: "数值狂魔", rarity: "Rare", skill: "EXCEL大师", desc: "他不需要玩游戏，他只需要看表格就能算出胜率。", stats: [75, 80, 20], baseSalary: 22000 },
      { name: "搬砖小李", rarity: "Common", skill: "勤恳打工", desc: "策划组的中流砥柱，主要负责改错字和填表。", stats: [50, 40, 40], baseSalary: 8000 },
      { name: "PPT王经理", rarity: "Trash", skill: "画大饼", desc: "只会写文档，从未做过游戏，但PPT逻辑满分。", stats: [10, 5, 5], baseSalary: 3500 },
      { name: "Ctrl+C侠", rarity: "Trash", skill: "全站搬运", desc: "核心竞争力就是能把隔壁厂的策划案改个名字。", stats: [5, 30, 10], baseSalary: 6000 },
    ],
    [Role.PROGRAMMER]: [
      { name: "卡马克大神", rarity: "Legendary", skill: "图形上帝", desc: "能够徒手在内存条上写出光线追踪引擎。", stats: [40, 99, 40], baseSalary: 58000 },
      { name: "李纳斯大神", rarity: "Legendary", skill: "内核狂人", desc: "如果代码写得烂，他会直接在邮件里喷死你。", stats: [20, 98, 20], baseSalary: 52000 },
      { name: "阿波罗之母", rarity: "Legendary", skill: "轨道计算", desc: "代码比她人还高，而且一行Bug都没有。", stats: [60, 99, 50], baseSalary: 55000 },
      { name: "杰夫大神", rarity: "Epic", skill: "编译优化", desc: "谷歌最强大脑，他在键盘上走一圈就是一套系统。", stats: [30, 95, 30], baseSalary: 45000 },
      { name: "马库斯", rarity: "Epic", skill: "像素方块", desc: "一个人做出了全球最畅销的游戏，然后去买豪宅了。", stats: [85, 85, 40], baseSalary: 40000 },
      { name: "多人联机神", rarity: "Epic", skill: "网络同步", desc: "能解决地球两端的玩家同步问题。", stats: [20, 94, 20], baseSalary: 35000 },
      { name: "汇编老兵", rarity: "Rare", skill: "底层控制", desc: "能用 1KB 内存写出一个 3D 渲染引擎。", stats: [30, 92, 20], baseSalary: 28000 },
      { name: "调试圣手", rarity: "Rare", skill: "一眼定Bug", desc: "他看一眼日志就能知道你哪行代码少了个分号。", stats: [40, 88, 30], baseSalary: 25000 },
      { name: "全栈卷王", rarity: "Rare", skill: "不眠不休", desc: "前端后端数据库运维他一个人全包了。", stats: [60, 85, 50], baseSalary: 26000 },
      { name: "脚本小子", rarity: "Common", skill: "API胶水", desc: "只要有现成的库，他就能把功能堆出来。", stats: [30, 60, 20], baseSalary: 12000 },
      { name: "秃头老张", rarity: "Common", skill: "发量祭天", desc: "用最后一根头发换来的代码，居然能跑通！", stats: [30, 85, 10], baseSalary: 15000 },
      { name: "删库奇才", rarity: "Trash", skill: "强制关机", desc: "虽然不会写代码，但我会按F5刷新。小心你的数据库。", stats: [5, 1, 5], baseSalary: 3000 },
    ],
    [Role.ARTIST]: [
      { name: "天野老师", rarity: "Legendary", skill: "幻象美学", desc: "他的画笔能触及灵魂深处，色彩极具流动感。", stats: [95, 40, 99], baseSalary: 56000 },
      { name: "金亨泰大师", rarity: "Legendary", skill: "人体工学", desc: "女性角色的质感确实没话说，油腻但极度吸引玩家。", stats: [40, 60, 98], baseSalary: 52000 },
      { name: "新川大叔", rarity: "Legendary", skill: "硬核机械", desc: "潜龙谍影系列的视觉基石，线条凌厉冷峻。", stats: [70, 70, 99], baseSalary: 50000 },
      { name: "朱峰老师", rarity: "Epic", skill: "世界观构架", desc: "好莱坞级别的场景设计师，一笔勾勒出一个星球。", stats: [85, 80, 92], baseSalary: 38000 },
      { name: "小崎老师", rarity: "Epic", skill: "日系清爽", desc: "火纹系列的现代领军人，角色设计极具辨识度。", stats: [70, 60, 90], baseSalary: 35000 },
      { name: "三渲二专家", rarity: "Epic", skill: "次元壁破坏", desc: "模型做得比2D手绘还精美。", stats: [70, 85, 90], baseSalary: 28000 },
      { name: "朋克狂热者", rarity: "Rare", skill: "霓虹美学", desc: "给所有东西都加上LED灯条就是他的艺术。", stats: [80, 50, 85], baseSalary: 22000 },
      { name: "建模狂魔", rarity: "Rare", skill: "极致面数", desc: "每一个纽扣都要雕刻一万个面。", stats: [20, 95, 80], baseSalary: 24000 },
      { name: "唯美古风", rarity: "Rare", skill: "意境大师", desc: "水墨与留白的结合，国产仙侠剧的救星。", stats: [90, 40, 88], baseSalary: 21000 },
      { name: "AI炼丹师", rarity: "Common", skill: "咒语吟唱", desc: "我不需要画笔，我只需要写提示词。", stats: [65, 50, 5], baseSalary: 7000 },
      { name: "灵魂画师", rarity: "Trash", skill: "极简火柴人", desc: "毕加索看了都要直呼内行，这叫极简主义艺术感。", stats: [50, 5, 2], baseSalary: 2500 },
      { name: "美术搬砖工", rarity: "Trash", skill: "图标机器", desc: "每天能切500个图，但没有任何原创能力。", stats: [5, 40, 10], baseSalary: 4500 },
    ],
  };

  const templates = [...STAFF_TEMPLATES[role]].sort(() => Math.random() - 0.5).slice(0, 3);
  return templates.map(t => ({
    id: generateId(), role, name: t.name, specialSkill: t.skill, description: t.desc,
    stats: { creativity: t.stats[0], technology: t.stats[1], artistry: t.stats[2] },
    salary: t.baseSalary, rarity: t.rarity
  }));
};

export const generateDevEventLocal = (config: GameConfig, currentStats: any): DevEvent => {
  const pool = [
    {
        title: "服务器遭遇DDoS",
        type: "TECHNICAL",
        description: "某个黑客组织决定给你的开发服务器一点颜色看看。",
        options: [
          { text: "升级防火墙", effectDescription: "投入资金加强防御", cost: 15000, progressImpact: -2, statImpact: { quality: 5, bugs: -5, morale: 5 } },
          { text: "手动拔网线", effectDescription: "数据保住了但进度受阻", cost: 0, progressImpact: -10, statImpact: { quality: -5, morale: -20 } }
        ]
    },
    {
        title: "底层架构技术评审",
        type: "TECHNICAL",
        description: "程序员发现底层框架存在隐患，如果现在不重构，后期Bug将难以控制。",
        options: [
          { text: "停工进行深度重构", effectDescription: "显著提升质量并减少未来Bug", cost: 0, progressImpact: -15, statImpact: { quality: 20, bugs: -30, morale: 5 } },
          { text: "直接打补丁硬上", effectDescription: "维持进度但埋下隐患", cost: 0, progressImpact: 5, statImpact: { quality: -10, bugs: 20, morale: -5 } }
        ]
    },
    {
        title: "灵光一闪的创意",
        type: "OTHER",
        description: "策划在凌晨三点突然想到了一个极其天才的支线任务，足以让玩家尖叫。",
        options: [
          { text: "不计代价实装它", effectDescription: "大幅提升游戏热度与品质", cost: 25000, progressImpact: -8, statImpact: { quality: 15, hype: 30, morale: 10 } },
          { text: "太麻烦了，删掉", effectDescription: "保持进度表不变", cost: 0, progressImpact: 0, statImpact: { morale: -10, hype: -5 } }
        ]
    }
  ];
  const template = pool[Math.floor(Math.random() * pool.length)];
  return {
    title: template.title, type: template.type as any, description: template.description,
    options: template.options.map(o => ({
      text: o.text, effectDescription: o.effectDescription, cost: o.cost, progressImpact: o.progressImpact,
      statImpact: o.statImpact
    }))
  };
};

export const calculateMonthlyProgressLocal = (gameState: GameState): number => {
  const programmerTech = gameState.team.programmer?.stats.technology || 0;
  const engineDiff = ENGINE_DIFFICULTY[gameState.engineering.engine] || 50;
  
  // Tech Compatibility: If team tech < engine difficulty, penalty is applied.
  let techSynergy = 1.0;
  if (programmerTech < engineDiff) {
    techSynergy = 0.5 + (programmerTech / engineDiff) * 0.5; // Up to 50% slow down
  } else {
    techSynergy = 1.0 + ((programmerTech - engineDiff) / 100) * 0.2; // Small boost for over-qualification
  }

  const teamStats = (gameState.team.designer?.stats.creativity || 0) + 
                    (gameState.team.programmer?.stats.technology || 0) + 
                    (gameState.team.artist?.stats.artistry || 0);
  
  const technicalSpeed = gameState.engineering?.speedMultiplier || 1.0;
  const crunchMod = gameState.isCrunching ? 2.0 : 1.0;
  const genreMod = GENRE_COMPLEXITY[gameState.config.genre] || 1.0;
  
  // Morale Impact: Efficiency drops exponentially when morale is low
  const moraleMultiplier = gameState.morale < 30 ? 0.3 : gameState.morale < 70 ? 0.7 : 1.0;

  let progress = (teamStats / 150) * 4 * technicalSpeed * crunchMod * techSynergy * genreMod * moraleMultiplier;
  
  return Math.max(0.1, progress); 
};

export const simulateLaunchLocal = (state: GameState): FinalResult => {
  const { quality, bugs, hype } = state.stats;
  const { config, currentTrend, price } = state;
  
  // 1. Quality Score (Affected by engineering and team)
  const techQualityMod = state.engineering.qualityMultiplier || 1.0;
  const baseQuality = (quality * techQualityMod);
  
  // 2. Trend matching (Directly boosts hype and score)
  const trendBonus = config.theme.includes(currentTrend) ? 1.3 : 1.0;

  // 3. Final Review Score (0-100)
  // Penalized heavily by bugs and mismatched hype (over-marketing low quality)
  const bugPenalty = Math.pow(bugs / 20, 1.2);
  const score = Math.max(1, Math.min(100, 
    Math.floor((baseQuality * 0.7 + (100 - bugPenalty) * 0.3) * trendBonus + (Math.random() * 8 - 4))
  ));

  // 4. Market Potential
  // Formula: (Quality/Price Ratio) * Hype * Trend
  // Ideal price is around ¥60. High quality can justify high price.
  const priceValueRatio = (score / 60) / (price / 60);
  const basePotential = (score * 5000 * (hype / 20) * priceValueRatio * trendBonus);

  let achievement = { name: "初露锋芒", description: "你的第一款游戏成功上线了。" };
  if (score > 90) achievement = { name: "神作降临", description: "玩家在街头为你欢呼。" };
  else if (score < 40) achievement = { name: "电子垃圾回收员", description: "玩家感觉受到了侮辱。" };
  else if (bugs > 80) achievement = { name: "育碧学徒", description: "Bug也是游戏特色的一部分。" };

  return {
    basePotential,
    score,
    reviewSummary: score > 85 ? "旷世杰作" : score > 70 ? "优秀之作" : score > 50 ? "平庸之辈" : "糟糕透顶",
    achievement
  };
};
