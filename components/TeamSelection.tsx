
import React, { useState, useEffect } from 'react';
import { Role, StaffMember } from '../types';
import { generateCandidatesLocal } from '../services/gameLogic';
import { analyzeCandidate } from '../services/geminiService';
import { User, RefreshCw, CheckCircle, Loader2, Zap, X, BrainCircuit, Target, TrendingUp, Sparkles, Crown, Star } from 'lucide-react';

interface Props {
  currentMoney: number;
  onUpdateMoney: (newAmount: number) => void;
  onHiringComplete: (team: { designer: StaffMember; programmer: StaffMember; artist: StaffMember }) => void;
}

const TeamSelection: React.FC<Props> = ({ currentMoney, onUpdateMoney, onHiringComplete }) => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [candidates, setCandidates] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshCost, setRefreshCost] = useState(2000);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [aiEvaluations, setAiEvaluations] = useState<Record<string, { text: string; loading: boolean }>>({});
  const [team, setTeam] = useState<{ designer: StaffMember | null; programmer: StaffMember | null; artist: StaffMember | null }>({
    designer: null, programmer: null, artist: null,
  });

  const roles = [Role.DESIGNER, Role.PROGRAMMER, Role.ARTIST];
  const roleNames = { 
    [Role.DESIGNER]: '首席架构/策划 (CD)', 
    [Role.PROGRAMMER]: '核心开发/程序 (CTO)', 
    [Role.ARTIST]: '视觉艺术/美术 (AD)' 
  };
  const loadingMessages = ["正在调阅人才档案...", "扫描能力雷达图...", "正在分析过往项目...", "正在进行压力测试..."];

  useEffect(() => {
    let interval: any;
    if (loading) interval = setInterval(() => setLoadingMsgIndex(p => (p + 1) % loadingMessages.length), 800);
    return () => clearInterval(interval);
  }, [loading]);
  
  const currentRole = roles[currentRoleIndex];

  const fetchCandidates = async (role: Role) => {
    setLoading(true);
    setAiEvaluations({});
    setTimeout(() => {
      setCandidates(generateCandidatesLocal(role));
      setLoading(false);
    }, 1200);
  };

  useEffect(() => { fetchCandidates(currentRole); }, [currentRole]);

  const handleHire = (member: StaffMember) => {
    const newTeam = { ...team };
    if (currentRole === Role.DESIGNER) newTeam.designer = member;
    if (currentRole === Role.PROGRAMMER) newTeam.programmer = member;
    if (currentRole === Role.ARTIST) newTeam.artist = member;
    setTeam(newTeam);
    
    if (currentRoleIndex < roles.length - 1) {
      setCurrentRoleIndex(p => p + 1);
    } else {
      if (newTeam.designer && newTeam.programmer && newTeam.artist) {
        onHiringComplete(newTeam as any);
      }
    }
  };

  const handleAiEval = async (candidate: StaffMember) => {
    if (aiEvaluations[candidate.id]) return;
    setAiEvaluations(p => ({ ...p, [candidate.id]: { text: '', loading: true } }));
    const text = await analyzeCandidate(candidate);
    setAiEvaluations(p => ({ ...p, [candidate.id]: { text, loading: false } }));
  };

  const getRarityConfig = (r: string) => {
    switch (r) {
      case 'Legendary': 
        return { 
          border: 'border-[#FFD700]', 
          bg: 'bg-gradient-to-b from-[#FFF9E6] to-[#FFE4B5]', 
          title: 'text-[#B8860B]', 
          glow: 'shadow-[0_0_25px_rgba(255,215,0,0.4)]', 
          tag: 'bg-[#FFD700]',
          header: 'bg-gradient-to-r from-[#FFD700] via-[#FFFACD] to-[#FFD700]',
          icon: <Crown className="w-4 h-4 text-[#B8860B] animate-bounce" />
        };
      case 'Epic': 
        return { 
          border: 'border-[#A335EE]', 
          bg: 'bg-gradient-to-b from-[#F9F2FF] to-[#E6CCFF]', 
          title: 'text-[#8E44AD]', 
          glow: 'shadow-[0_0_20px_rgba(163,53,238,0.25)]', 
          tag: 'bg-[#A335EE]',
          header: 'bg-gradient-to-r from-[#A335EE] via-[#DDA0DD] to-[#A335EE]',
          icon: <Sparkles className="w-4 h-4 text-[#8E44AD]" />
        };
      case 'Rare': 
        return { 
          border: 'border-[#0070DD]', 
          bg: 'bg-gradient-to-b from-[#F2F8FF] to-[#CCE6FF]', 
          title: 'text-[#0058B3]', 
          glow: 'shadow-[0_0_15px_rgba(0,112,221,0.2)]', 
          tag: 'bg-[#0070DD]',
          header: 'bg-gradient-to-r from-[#0070DD] via-[#87CEFA] to-[#0070DD]',
          icon: <Star className="w-4 h-4 text-[#0058B3]" />
        };
      case 'Trash': 
        return { 
          border: 'border-red-600', 
          bg: 'bg-gradient-to-b from-red-50 to-red-100', 
          title: 'text-red-700', 
          glow: 'shadow-[0_0_10px_rgba(220,38,38,0.1)]', 
          tag: 'bg-red-600',
          header: 'bg-red-200',
          icon: <X className="w-4 h-4 text-red-700" />
        };
      default: // Common
        return { 
          border: 'border-gray-500', 
          bg: 'bg-gradient-to-b from-gray-50 to-gray-200', 
          title: 'text-gray-700', 
          glow: 'shadow-md', 
          tag: 'bg-gray-500',
          header: 'bg-gray-300',
          icon: <User className="w-4 h-4 text-gray-700" />
        };
    }
  };

  return (
    <div className="xp-window w-full mx-auto animate-fade-in shadow-2xl overflow-hidden max-w-5xl">
      <div className="xp-title-bar h-8 px-3">
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">招募系统 V2.0 - 正在物色: {roleNames[currentRole]}</span>
        </div>
      </div>
      
      <div className="bg-[#ECE9D8] p-4">
        <div className="bg-white border-2 border-inset border-gray-400 p-4 mb-4 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-blue-900 shadow-lg relative overflow-hidden">
                        <User className="w-6 h-6" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
                    </div>
                </div>
                <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">面试进度</div>
                    <div className="text-sm font-black text-[#003399] flex items-center gap-2">
                        {roleNames[currentRole]}
                        <div className="flex gap-1.5 ml-2">
                            {roles.map((_, i) => (
                                <div key={i} className={`h-2 w-2 rounded-full border border-gray-300 ${i <= currentRoleIndex ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-gray-200'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="text-right">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">当前可用预算</div>
                <div className="text-2xl font-black font-mono text-green-700 italic">¥{currentMoney.toLocaleString()}</div>
            </div>
        </div>

        {loading ? (
            <div className="h-[420px] flex flex-col items-center justify-center bg-white border-2 border-inset border-gray-400 shadow-inner">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-xs text-blue-800 font-bold animate-pulse font-mono tracking-tighter uppercase">{loadingMessages[loadingMsgIndex]}</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {candidates.map((c) => {
                const conf = getRarityConfig(c.rarity);
                const ai = aiEvaluations[c.id];

                return (
                    <div key={c.id} className={`xp-inset group relative flex flex-col h-[460px] bg-white transition-all duration-300 hover:-translate-y-1 ${conf.border} ${conf.glow} border-2 overflow-hidden`}>
                        <div className={`absolute -right-8 top-4 ${conf.tag} text-white text-[9px] font-black px-10 py-1 shadow-md z-10 transform rotate-45 border-b border-white/20`}>
                            {c.rarity.toUpperCase()}
                        </div>

                        <div className={`p-4 border-b border-gray-300 ${conf.bg} relative overflow-hidden`}>
                            <div className="absolute -left-2 -bottom-2 opacity-5 scale-[2.5] pointer-events-none">{conf.icon}</div>
                            <div className="flex items-center gap-2">
                                {conf.icon}
                                <div className={`text-lg font-black italic tracking-tighter ${conf.title}`}>{c.name}</div>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <Zap className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter truncate">{c.specialSkill}</span>
                            </div>
                        </div>
                        
                        <div className="p-4 space-y-2 flex-1 bg-white/80">
                            {[
                                { l: '创意/策划', v: c.stats.creativity, color: 'bg-yellow-400' },
                                { l: '技术/实现', v: c.stats.technology, color: 'bg-blue-400' },
                                { l: '艺术/美感', v: c.stats.artistry, color: 'bg-pink-400' }
                            ].map(st => (
                                <div key={st.l}>
                                    <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase mb-0.5">
                                        <span>{st.l}</span>
                                        <span>{st.v}</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                        <div className={`h-full ${st.color} transition-all duration-1000 ease-out`} style={{ width: `${st.v}%` }}></div>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-4 bg-[#FFFFF0] border border-[#E6E6A8] p-2 text-[10px] text-gray-700 italic leading-snug rounded-sm shadow-inner min-h-[60px] overflow-y-auto">
                                "{c.description}"
                            </div>

                            <div className="mt-2 h-10 overflow-hidden">
                                {ai?.loading ? (
                                    <div className="text-[9px] text-blue-600 font-bold italic animate-pulse flex items-center gap-1">
                                        <BrainCircuit className="w-3 h-3" /> 猎头 AI 分析中...
                                    </div>
                                ) : ai?.text ? (
                                    <div className="text-[9px] text-orange-800 font-black leading-tight border-l-2 border-orange-300 pl-2">
                                        "{ai.text}"
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => handleAiEval(c)} 
                                        className="text-[9px] text-blue-600 hover:text-blue-800 font-black underline flex items-center gap-1 uppercase tracking-tighter"
                                    >
                                        <TrendingUp className="w-3 h-3" /> 获取猎头评估
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex justify-between items-baseline mb-3">
                                <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">月薪</span>
                                <span className="text-xl font-black text-red-600 font-mono italic">¥{(c.salary).toLocaleString()}</span>
                            </div>
                            <button 
                                onClick={() => handleHire(c)}
                                disabled={currentMoney < c.salary}
                                className={`w-full xp-btn-green py-3 font-black text-xs flex items-center justify-center gap-2 group shadow-md transition-all ${currentMoney < c.salary ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
                            >
                                <CheckCircle className="w-4 h-4" /> 
                                确认录用
                            </button>
                        </div>
                    </div>
                );
            })}
            </div>
        )}

        <div className="mt-6 flex justify-between items-center bg-white/40 p-3 border border-gray-400 rounded-sm">
            <div className="flex items-center gap-3">
                <RefreshCw className={`w-5 h-5 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
                <div>
                    <div className="text-[10px] font-black text-gray-700 uppercase">候选人刷新服务</div>
                    <div className="text-[9px] text-gray-500 italic">猎头费: ¥{refreshCost.toLocaleString()} (每次刷新递增)</div>
                </div>
            </div>
            <button 
                onClick={() => {
                    if (currentMoney >= refreshCost) {
                        onUpdateMoney(currentMoney - refreshCost);
                        fetchCandidates(currentRole);
                        setRefreshCost(p => Math.floor(p * 1.5));
                    }
                }}
                disabled={currentMoney < refreshCost || loading}
                className={`xp-btn px-8 font-black py-2 transition-transform ${currentMoney >= refreshCost ? 'hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed grayscale'}`}
            >
                换一批新人
            </button>
        </div>
      </div>
    </div>
  );
};

export default TeamSelection;
