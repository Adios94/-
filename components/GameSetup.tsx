
import React, { useState, useEffect } from 'react';
import { GameConfig } from '../types';
import { PLATFORMS, THEME_TAGS, GENRES, LEVEL_CONFIG } from '../constants';
import { generateGameTitle } from '../services/geminiService';
import { Terminal, Gamepad2, Globe, Cpu, X, Loader2, Sparkles, RefreshCw, Rocket, Newspaper, TrendingUp, ArrowLeft, Lock } from 'lucide-react';

interface Props {
  currentTrend: string;
  companyLevel: number; // Added
  onComplete: (config: GameConfig) => void;
  onBack: () => void;
}

const GameSetup: React.FC<Props> = ({ currentTrend, companyLevel, onComplete, onBack }) => {
  const [title, setTitle] = useState('');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [genre, setGenre] = useState(GENRES[0]);
  const [platforms, setPlatforms] = useState<string[]>(['Steam']);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [hasModSupport, setHasModSupport] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  const loadingMessages = [
    "正在进行头脑风暴...",
    "参考业界黑话...",
    "模拟大作风范...",
    "构思爆款名称...",
  ];

  useEffect(() => {
    let interval: any;
    if (isGeneratingTitle) {
      interval = setInterval(() => {
        setLoadingMsgIndex(prev => (prev + 1) % loadingMessages.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isGeneratingTitle]);

  const toggleTheme = (tag: string) => {
    if (selectedThemes.includes(tag)) {
        setSelectedThemes(selectedThemes.filter(t => t !== tag));
    } else if (selectedThemes.length < 3) {
        setSelectedThemes([...selectedThemes, tag]);
    }
  };

  const togglePlatform = (p: string) => {
    const requiredLevel = parseInt(Object.keys(LEVEL_CONFIG.PLATFORMS).find(lvl => LEVEL_CONFIG.PLATFORMS[parseInt(lvl)].includes(p)) || '1');
    if (companyLevel < requiredLevel) return;

    if (platforms.includes(p)) {
      if (platforms.length > 1) setPlatforms(platforms.filter(item => item !== p));
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const handleGenerateTitle = async () => {
    if (selectedThemes.length === 0) return;
    setIsGeneratingTitle(true);
    const themesStr = selectedThemes.join(' + ');
    const newTitle = await generateGameTitle(themesStr, genre);
    setTitle(newTitle);
    setIsGeneratingTitle(false);
  };

  const handleSubmit = async () => {
    if (selectedThemes.length > 0 && genre) {
      if (!title) {
          await handleGenerateTitle();
          return;
      }
      onComplete({ 
          title: title,
          theme: selectedThemes.join(' + '), 
          genre, 
          platform: platforms, 
          isMultiplayer, 
          hasModSupport 
      });
    }
  };

  const isGenreLocked = (g: string) => {
    const requiredLevel = parseInt(Object.keys(LEVEL_CONFIG.GENRES).find(lvl => LEVEL_CONFIG.GENRES[parseInt(lvl)].includes(g)) || '1');
    return companyLevel < requiredLevel;
  };

  const getPlatformLockLevel = (p: string) => {
    return parseInt(Object.keys(LEVEL_CONFIG.PLATFORMS).find(lvl => LEVEL_CONFIG.PLATFORMS[parseInt(lvl)].includes(p)) || '1');
  };

  return (
    <div className="xp-window w-full max-w-3xl mx-auto shadow-2xl animate-fade-in overflow-hidden">
      <div className="xp-title-bar">
         <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            <span className="text-xs font-bold">项目立项向导 - 定义你的愿景 (Lv.{companyLevel})</span>
         </div>
      </div>

      <div className="bg-[#ECE9D8] p-0 flex flex-col md:flex-row border-b border-gray-400">
         <div className="hidden md:flex w-56 bg-gradient-to-b from-[#102558] to-[#245edc] text-white p-6 relative overflow-hidden flex-shrink-0 flex-col border-r border-[#000080]">
             <h3 className="font-black text-xl mb-4 z-10 relative italic leading-tight drop-shadow-lg uppercase text-wrap">准备立项</h3>
             
             <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-sm z-10 mb-6 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                    <Newspaper className="w-4 h-4 text-blue-200" />
                    <span className="text-[10px] font-black uppercase tracking-wider">市场情报 (INTEL)</span>
                </div>
                <div className="text-[11px] leading-relaxed mb-2 font-bold italic">
                    据调查，今年玩家对 <span className="text-yellow-400">#{currentTrend}</span> 题材展现了极大的热情。
                </div>
                <div className="flex items-center gap-1 text-[9px] text-green-300 font-black">
                    <TrendingUp className="w-3 h-3" /> 预期热度: +25%
                </div>
             </div>

             <div className="absolute -bottom-6 -right-6 opacity-10 transform rotate-12"><Gamepad2 className="w-48 h-48" /></div>
         </div>

         <div className="flex-1 p-8 space-y-6 bg-[#ECE9D8] min-w-0">
            <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">1. 题材核心组合 (选择 1-3 项)</label>
                <div className="xp-inset p-3 h-32 overflow-y-auto bg-white shadow-inner">
                    <div className="flex flex-wrap gap-1.5">
                    {THEME_TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => toggleTheme(tag)}
                            className={`text-[11px] px-2 py-1 rounded-sm border transition-all ${selectedThemes.includes(tag) ? 'bg-[#316AC5] text-white border-[#000080] font-bold' : 'bg-white text-gray-700 border-gray-300 hover:bg-[#E3EFFF]'} ${tag === currentTrend ? 'border-yellow-500 ring-1 ring-yellow-400 shadow-sm' : ''}`}
                        >
                            {tag} {tag === currentTrend && "🔥"}
                        </button>
                    ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
                <div className="min-w-0">
                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">2. 核心玩法类型</label>
                    <select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full text-xs xp-inset px-3 py-2 font-bold bg-white text-black outline-none focus:border-blue-500">
                        {GENRES.map(g => {
                            const locked = isGenreLocked(g);
                            return <option key={g} value={g} disabled={locked}>{locked ? `🔒 ${g} (需 Lv.${Object.keys(LEVEL_CONFIG.GENRES).find(l => LEVEL_CONFIG.GENRES[parseInt(l)].includes(g))})` : g}</option>
                        })}
                    </select>
                </div>
                <div className="min-w-0">
                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">3. 项目名称预览</label>
                    <div className="flex gap-2 items-center min-w-0">
                        <div className="flex-1 xp-inset px-3 py-2 text-xs font-black h-9 flex items-center bg-white shadow-inner text-black overflow-hidden min-w-0">
                            {isGeneratingTitle ? (
                                <div className="flex items-center gap-2 text-blue-600 animate-pulse w-full min-w-0">
                                    <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />
                                    <span className="text-[10px] italic truncate">{loadingMessages[loadingMsgIndex]}</span>
                                </div>
                            ) : title ? (
                                <div className="flex items-center gap-1 text-black w-full min-w-0 overflow-hidden">
                                    <Sparkles className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                    <span className="truncate italic whitespace-nowrap block flex-1" title={`《${title}》`}>《{title}》</span>
                                </div>
                            ) : <span className="text-gray-400 font-normal truncate italic w-full">点击右侧按钮生成创意标题...</span>}
                        </div>
                        <button 
                            onClick={handleGenerateTitle} 
                            disabled={selectedThemes.length === 0 || isGeneratingTitle} 
                            className="xp-btn h-9 px-3 flex-shrink-0"
                            title="由 AI 生成标题"
                        >
                            <RefreshCw className={`w-4 h-4 ${isGeneratingTitle ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <fieldset className="border-2 border-gray-300 p-3 bg-white/50 rounded-sm">
                    <legend className="text-[10px] font-black px-2 text-gray-500 uppercase tracking-widest italic bg-[#ECE9D8] border border-gray-300 ml-2">分发渠道 (多选)</legend>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        {PLATFORMS.map((p) => {
                            const reqLevel = getPlatformLockLevel(p);
                            const locked = companyLevel < reqLevel;
                            return (
                                <label key={p} className={`flex items-center gap-2 group ${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <input type="checkbox" checked={platforms.includes(p)} onChange={() => togglePlatform(p)} disabled={locked} className="accent-[#3E9E03] w-3.5 h-3.5" />
                                    <span className="text-[11px] font-bold text-gray-700 group-hover:text-blue-700 truncate flex items-center gap-1">
                                        {p} {locked && <Lock className="w-2.5 h-2.5" />}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </fieldset>

                <fieldset className="border-2 border-gray-300 p-3 bg-white/50 rounded-sm">
                    <legend className="text-[10px] font-black px-2 text-gray-500 uppercase tracking-widest italic bg-[#ECE9D8] border border-gray-300 ml-2">高级特性</legend>
                    <div className="flex flex-col gap-2 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={isMultiplayer} onChange={(e) => setIsMultiplayer(e.target.checked)} className="accent-[#3E9E03] w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold flex items-center gap-1.5 text-gray-700 group-hover:text-blue-700 truncate"><Globe className="w-3 h-3 text-blue-600 flex-shrink-0" /> 多人联机模块</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={hasModSupport} onChange={(e) => setHasModSupport(e.target.checked)} className="accent-[#3E9E03] w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold flex items-center gap-1.5 text-gray-700 group-hover:text-blue-700 truncate"><Cpu className="w-3 h-3 text-blue-600 flex-shrink-0" /> 开放 MOD SDK</span>
                        </label>
                    </div>
                </fieldset>
            </div>
         </div>
      </div>

      <div className="bg-[#ECE9D8] p-4 flex justify-end gap-3 px-8">
          <button 
            onClick={onBack}
            className="xp-btn px-6 py-2.5 font-bold text-xs flex items-center gap-2 shadow-md transition-transform hover:bg-gray-200 active:scale-95"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>返回招募</span>
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={selectedThemes.length === 0 || isGeneratingTitle} 
            className={`xp-btn-green px-10 py-2.5 font-black text-sm flex items-center gap-2 shadow-lg transition-transform ${selectedThemes.length > 0 ? 'hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed grayscale'}`}
          >
            <Rocket className="w-4 h-4" />
            <span>确认立项</span>
          </button>
      </div>
    </div>
  );
};

export default GameSetup;
