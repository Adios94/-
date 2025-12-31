
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { GameState, FinalResult } from '../types';
import { MARKETING_OPTIONS } from '../constants';
import { simulateLaunchLocal } from '../services/gameLogic';
import { generateGameCover, generatePlayerComments } from '../services/geminiService';
import { Trophy, Globe, Loader2, X, PieChart, User, ThumbsUp, ThumbsDown, Disc, Rocket, Maximize2, FastForward, Play, TrendingUp, TrendingDown, Star, Bug, Flame, SkipForward } from 'lucide-react';

interface Comment {
  user: string;
  text: string;
  sentiment: 'pos' | 'neg' | 'neu';
}

const ResultsView: React.FC<{ gameState: GameState; onRestart: (profit: number) => void }> = ({ gameState, onRestart }) => {
  const [result, setResult] = useState<FinalResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isCoverZoomed, setIsCoverZoomed] = useState(false);
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [visibleComments, setVisibleComments] = useState<Comment[]>([]);
  const [salesHistory, setSalesHistory] = useState<number[]>([]);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [currentHype, setCurrentHype] = useState(gameState.stats.hype);
  const [isFinalSettlement, setIsFinalSettlement] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  
  const commentContainerRef = useRef<HTMLDivElement>(null);

  const marketingBoost = useMemo(() => {
    return gameState.selectedMarketing.reduce((acc, id) => {
      const opt = MARKETING_OPTIONS.find(o => o.id === id);
      return acc * (opt?.boost || 1);
    }, 1.0);
  }, [gameState.selectedMarketing]);

  useEffect(() => {
    const fetchData = async () => {
        const simData = simulateLaunchLocal(gameState);
        setResult(simData);
        setLoading(false);
        const [cover, feedback] = await Promise.all([
            gameState.coverUrl ? Promise.resolve(gameState.coverUrl) : generateGameCover(gameState),
            generatePlayerComments(gameState, simData.score)
        ]);
        setCoverUrl(cover);
        setAllComments(feedback);
    };
    fetchData();
  }, [gameState]);

  useEffect(() => {
    if (commentContainerRef.current) {
      commentContainerRef.current.scrollTo({ top: commentContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [visibleComments]);

  const calculateMonthSales = (month: number) => {
    if (!result) return 0;
    const initialBoost = month === 1 ? marketingBoost : 1.0 + (marketingBoost - 1.0) * Math.pow(0.4, month - 1);
    const decay = Math.pow(0.7, month - 1);
    
    // Bug impact: High bugs = faster hype decay and lower long-tail sales
    const bugImpact = Math.max(0.2, 1.0 - (gameState.stats.bugs / 150));
    
    const monthlyPotential = result.basePotential * decay * (currentHype / 100) * initialBoost * bugImpact;
    return Math.max(10, Math.floor(monthlyPotential * (0.8 + Math.random() * 0.4)));
  };

  const playNextMonth = () => {
    if (!result || currentMonth >= 12) return;
    const nextMonthIdx = currentMonth + 1;
    const monthSales = calculateMonthSales(nextMonthIdx);
    setSalesHistory(prev => [...prev, monthSales]);
    setTotalRevenue(prev => prev + (monthSales * gameState.price));
    setCurrentMonth(nextMonthIdx);
    setCurrentHype(prev => Math.max(5, prev * 0.85));

    const commentsPerMonth = Math.ceil(allComments.length / 12);
    const startIndex = currentMonth * commentsPerMonth;
    const newComments = allComments.slice(startIndex, startIndex + commentsPerMonth);
    if (newComments.length > 0) setVisibleComments(prev => [...prev, ...newComments]);

    if (nextMonthIdx >= 12) {
      setIsAutoPlaying(false);
      // Small delay before showing final settlement for impact
      setTimeout(() => setIsFinalSettlement(true), 1000);
    }
  };

  useEffect(() => {
    let timer: any;
    if (isAutoPlaying && currentMonth < 12) {
      timer = setTimeout(playNextMonth, 500);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentMonth]);

  if (loading) return (
    <div className="xp-window w-96 mx-auto mt-20 p-8 flex flex-col items-center">
      <Loader2 className="animate-spin mb-4 text-blue-600" />
      <p className="font-black text-black">市场行情分析中...</p>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center p-4 relative overflow-y-auto scrollbar-thin text-black">
        <div className={`transition-all duration-500 w-full max-w-5xl ${isFinalSettlement ? 'opacity-20 blur-md grayscale' : ''}`}>
            <div className="bg-[#1b2838] p-6 text-white border-2 border-[#2a475e] shadow-2xl mb-6">
                <div className="flex items-center gap-6 mb-8 border-b border-[#2a475e] pb-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center shadow-xl flex-shrink-0 animate-pulse">
                        <Rocket className="w-12 h-12 text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-black italic tracking-tighter">《{gameState.config.title}》 销售报表</h1>
                        <div className="flex gap-4 mt-2">
                            <div className="text-[10px] bg-blue-900/50 px-2 py-0.5 rounded border border-blue-400 font-bold uppercase">评分: {result?.score}/100</div>
                            <div className="text-[10px] bg-red-900/50 px-2 py-0.5 rounded border border-red-400 font-bold uppercase">品质: {Math.floor(gameState.stats.quality)}</div>
                            <div className="text-[10px] bg-purple-900/50 px-2 py-0.5 rounded border border-purple-400 font-bold uppercase">趋势匹配: {gameState.config.theme.includes(gameState.currentTrend) ? '完美' : '无'}</div>
                        </div>
                    </div>
                    <div className="text-right">
                         <div className="text-[11px] text-gray-400 font-black uppercase">总营收</div>
                         <div className="text-3xl font-black font-mono text-green-400">¥{Math.floor(totalRevenue).toLocaleString()}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 bg-black/40 p-6 border border-[#2a475e] h-56 relative shadow-inner rounded overflow-hidden flex flex-col">
                        <div className="absolute top-4 left-6 text-[10px] text-gray-500 font-bold italic">年度销量曲线 (UNITS/MONTH)</div>
                        
                        <div className="flex-1 flex items-end gap-2 h-full w-full pt-8">
                            {salesHistory.map((val, i) => (
                                <div key={i} className="flex-1 bg-gradient-to-t from-blue-700 to-blue-400 rounded-t-sm transition-all duration-500 relative group min-w-[12px]" style={{ height: `${Math.max(5, (val / Math.max(...salesHistory, 1)) * 100)}%` }}>
                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] bg-black border border-blue-400 px-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        {val.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                            {[...Array(12 - salesHistory.length)].map((_, i) => (
                                <div key={i} className="flex-1 h-0.5 bg-gray-800 rounded-full mb-1"></div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="bg-[#16202d] p-4 border border-[#2a475e] rounded text-center shadow-lg">
                            <div className="text-[9px] text-gray-500 font-black uppercase mb-1">年度周期</div>
                            <div className="text-xl font-black text-blue-300 font-mono italic">MONTH {currentMonth}/12</div>
                        </div>

                        {currentMonth < 12 && (
                          <div className="flex flex-col gap-2">
                            <button 
                                onClick={playNextMonth} 
                                disabled={isAutoPlaying}
                                className="xp-btn-green w-full py-2.5 text-xs font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
                            >
                                <SkipForward className="w-4 h-4" /> 下一月 (NEXT)
                            </button>
                            <button 
                                onClick={() => setIsAutoPlaying(!isAutoPlaying)} 
                                className={`xp-btn w-full py-2.5 text-xs font-black flex items-center justify-center gap-2 transition-all ${isAutoPlaying ? 'bg-orange-100 border-orange-600 text-orange-800' : ''}`}
                            >
                                {isAutoPlaying ? <Loader2 className="w-4 h-4 animate-spin" /> : <FastForward className="w-4 h-4" />}
                                {isAutoPlaying ? '自动播放中...' : '全速模拟至年末'}
                            </button>
                          </div>
                        )}
                        
                        {currentMonth === 12 && !isFinalSettlement && (
                           <button onClick={() => setIsFinalSettlement(true)} className="xp-btn-green w-full py-3 text-xs font-black animate-pulse">
                              查看财年终报 (FINAL)
                           </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="xp-window overflow-hidden">
                    <div className="xp-title-bar h-7 bg-blue-700 px-3">
                        <span className="text-[10px] font-bold italic uppercase">成品预览</span>
                        <Maximize2 onClick={() => setIsCoverZoomed(true)} className="w-3.5 h-3.5 cursor-pointer" />
                    </div>
                    <div className="p-3 bg-[#ECE9D8]">
                        <div className="w-full aspect-[3/4] bg-white border-2 border-inset border-gray-400 shadow-xl overflow-hidden group relative">
                           {coverUrl ? <img src={coverUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" /> : <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-400" /></div>}
                        </div>
                    </div>
                </div>
                
                <div className="md:col-span-2 xp-window flex flex-col h-[400px]">
                    <div className="xp-title-bar h-7 bg-gray-700 px-3 italic uppercase font-black tracking-widest text-[9px]">玩家反馈社区 (LIVE_FEED)</div>
                    <div ref={commentContainerRef} className="bg-white p-4 space-y-3 flex-1 overflow-y-auto scrollbar-thin shadow-inner">
                        {visibleComments.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4 opacity-40">
                            <Disc className="w-12 h-12 animate-spin-slow" />
                            <span className="text-[11px] font-black uppercase tracking-widest italic">等待游戏首日评价...</span>
                          </div>
                        ) : (
                          visibleComments.map((c, i) => (
                              <div key={i} className="bg-gray-50 p-3 border-2 border-inset border-gray-200 flex gap-4 animate-pop-in shadow-sm hover:border-blue-200 transition-colors">
                                  <div className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                      <User className="w-6 h-6 text-gray-400" />
                                  </div>
                                  <div className="flex-1">
                                      <div className="flex justify-between items-center text-[10px] font-black uppercase mb-1">
                                          <span className="text-blue-700">{c.user}</span>
                                          {c.sentiment === 'pos' ? <ThumbsUp className="w-3 h-3 text-green-500" /> : <ThumbsDown className="w-3 h-3 text-red-500" />}
                                      </div>
                                      <p className="text-[12px] italic leading-relaxed text-gray-800 font-bold">"{c.text}"</p>
                                  </div>
                              </div>
                          ))
                        )}
                    </div>
                </div>
            </div>
        </div>

        {isFinalSettlement && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-lg p-4">
                <div className="xp-window w-full max-w-2xl animate-pop-in shadow-[40px_40px_0px_rgba(0,0,0,0.5)]">
                    <div className="xp-title-bar h-12 px-6">
                        <div className="flex items-center gap-3 text-sm font-black italic uppercase tracking-widest">
                            <PieChart className="w-6 h-6 text-yellow-300" /> 最终结算分析与财年汇报
                        </div>
                    </div>
                    <div className="bg-[#ECE9D8] p-10">
                        <div className="grid grid-cols-3 gap-6 mb-10">
                             <div className="bg-white p-4 border-2 border-inset border-gray-300 shadow-inner flex flex-col items-center">
                                <Star className="w-6 h-6 text-yellow-500 mb-2" />
                                <div className="text-[10px] text-gray-400 font-black uppercase">综合评分</div>
                                <div className="text-3xl font-black italic text-blue-900">{result?.score}</div>
                             </div>
                             <div className="bg-white p-4 border-2 border-inset border-gray-300 shadow-inner flex flex-col items-center">
                                <Bug className="w-6 h-6 text-red-500 mb-2" />
                                <div className="text-[10px] text-gray-400 font-black uppercase">遗留Bug影响</div>
                                <div className="text-3xl font-black italic text-red-700">-{Math.floor(gameState.stats.bugs/3)}%</div>
                             </div>
                             <div className="bg-white p-4 border-2 border-inset border-gray-300 shadow-inner flex flex-col items-center">
                                <Flame className="w-6 h-6 text-orange-500 mb-2" />
                                <div className="text-[10px] text-gray-400 font-black uppercase">市场转化率</div>
                                <div className="text-3xl font-black italic text-green-700">x{marketingBoost.toFixed(1)}</div>
                             </div>
                        </div>

                        <div className="bg-[#1b2838] p-6 border-4 border-double border-[#2a475e] text-white flex items-center gap-6 mb-10 shadow-xl">
                             <div className="p-4 bg-yellow-500/20 rounded-full border-2 border-yellow-500 animate-pulse">
                                <Trophy className="w-12 h-12 text-yellow-500 shadow-2xl" />
                             </div>
                             <div className="flex-1">
                                <div className="text-xs font-black text-yellow-400 italic uppercase tracking-tighter mb-1">年度里程碑解锁:</div>
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">《{result?.achievement.name}》</h3>
                                <p className="text-[11px] text-gray-400 font-bold">"{result?.achievement.description}"</p>
                             </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-end px-2">
                                <div className="text-sm font-black text-gray-500 uppercase italic">财年最终净利</div>
                                <div className="text-4xl font-black italic text-green-700 font-mono tracking-tighter">¥{Math.floor(totalRevenue).toLocaleString()}</div>
                            </div>
                            <button onClick={() => onRestart(totalRevenue)} className="xp-btn-green w-full py-5 text-2xl font-black shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all">
                                <Rocket className="w-8 h-8" />
                                <span className="italic uppercase tracking-tighter">启动下一款爆款项目</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {isCoverZoomed && (
             <div onClick={() => setIsCoverZoomed(false)} className="fixed inset-0 z-[600] bg-black/95 flex items-center justify-center p-8 cursor-pointer animate-fade-in">
                 <img src={coverUrl!} className="max-h-full max-w-full border-4 border-white shadow-[0_0_100px_rgba(255,255,255,0.2)] rounded-lg" alt="Zoomed Cover" />
             </div>
        )}
    </div>
  );
};

export default ResultsView;
