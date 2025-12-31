
import React, { useState, useEffect, useRef } from 'react';
import { GameState, DevEvent, DevEventOption, GameStage } from '../types';
import { generateDevEventLocal, calculateMonthlyProgressLocal } from '../services/gameLogic';
import { generateGameCover, generateGameSummary } from '../services/geminiService';
import { AlertTriangle, Bug, Star, Zap, X, Disc, CheckCircle, Loader2, Clock, ShieldAlert, Terminal, TrendingDown, Heart, Activity, Coins, Rocket, Flame, Cpu, ArrowRight } from 'lucide-react';

interface Props {
  gameState: GameState;
  onUpdateState: (newState: Partial<GameState>) => void;
  onComplete: () => void;
  onFail: (reason: string) => void;
}

const DevPhase: React.FC<Props> = ({ gameState, onUpdateState, onComplete, onFail }) => {
  const [activeEvent, setActiveEvent] = useState<DevEvent | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [autoProgress, setAutoProgress] = useState(true);
  const [isFinished, setIsFinished] = useState(gameState.progress >= 100);
  const [generatingAssets, setGeneratingAssets] = useState(false);
  const [triggeredMilestones, setTriggeredMilestones] = useState<number[]>([]);
  
  const progressRef = useRef(gameState.progress);
  const monthRef = useRef(gameState.currentMonth);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const monthlyProgress = calculateMonthlyProgressLocal(gameState);
  const estimatedTotalMonths = Math.ceil((100 - gameState.progress) / (monthlyProgress || 1)) + gameState.currentMonth;

  // Logic Feedback: Why is it slow?
  const isTechMismatched = (gameState.team.programmer?.stats.technology || 0) < (gameState.engineering.engine === 'Unreal Engine 5' ? 80 : 50);
  const isMoraleLow = gameState.morale < 50;

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [gameState.logs]);

  useEffect(() => {
    if (gameState.stage === GameStage.DEVELOPMENT) {
      if (gameState.money < 0) {
        setAutoProgress(false);
        onFail("由于资金链断裂，银行强制没收了公司资产。你的创业梦想宣告破产。");
      } else if (gameState.morale <= 0) {
        setAutoProgress(false);
        onFail("核心成员集体离职。你的团队在无尽的压力和低迷的士气中彻底瓦解。");
      }
    }
  }, [gameState.money, gameState.morale, gameState.stage, onFail]);

  useEffect(() => {
    progressRef.current = gameState.progress;
    monthRef.current = gameState.currentMonth;
  }, [gameState.progress, gameState.currentMonth]);

  // Asset generation effect when 100% is reached
  useEffect(() => {
    if (gameState.progress >= 100 && !isFinished && !generatingAssets) {
        setIsFinished(true);
        setAutoProgress(false);
        
        // Only fetch if they aren't already set
        if (!gameState.coverUrl || !gameState.summary) {
            const fetchFinalAssets = async () => {
                setGeneratingAssets(true);
                try {
                    const results: Partial<GameState> = {};
                    const [coverRes, summaryRes] = await Promise.allSettled([
                      gameState.coverUrl ? Promise.resolve(gameState.coverUrl) : generateGameCover(gameState),
                      gameState.summary ? Promise.resolve(gameState.summary) : generateGameSummary(gameState)
                    ]);
                    
                    if (coverRes.status === 'fulfilled' && coverRes.value) {
                      results.coverUrl = coverRes.value;
                    }
                    if (summaryRes.status === 'fulfilled' && summaryRes.value) {
                      results.summary = summaryRes.value;
                    }
                    
                    onUpdateState({ 
                      ...results, 
                      logs: [...gameState.logs, "项目所有资产打包完成，版本号 1.0.0-GOLD 已就绪。系统已锁定，准备进入发布流程。"] 
                    });
                } catch (e) { 
                    console.error("Asset generation error:", e);
                    onUpdateState({ logs: [...gameState.logs, "资产生成出现异常，已启用紧急备选方案。"] });
                } finally { 
                    setGeneratingAssets(false); 
                }
            };
            fetchFinalAssets();
        }
    }
  }, [gameState.progress, isFinished, generatingAssets, gameState.coverUrl, gameState.summary]);

  useEffect(() => {
    let interval: any;
    if (autoProgress && !activeEvent && !loadingEvent && gameState.progress < 100) {
      interval = setInterval(() => {
        const currentProgress = progressRef.current;
        const currentMonth = monthRef.current;
        const milestoneThresholds = [25, 50, 75];
        const nextMilestone = milestoneThresholds.find(m => currentProgress >= m && !triggeredMilestones.includes(m));

        if (nextMilestone !== undefined) {
          setAutoProgress(false);
          setLoadingEvent(true);
          setTriggeredMilestones(prev => [...prev, nextMilestone]);
          setTimeout(() => {
            const evt = generateDevEventLocal(gameState.config, gameState.stats);
            setActiveEvent(evt);
            setLoadingEvent(false);
            onUpdateState({ logs: [...gameState.logs, `[突发事件] ⚠️ ${evt.title}`] });
          }, 1200);
        } else if (currentProgress < 100) {
          const nextMoney = gameState.money - gameState.monthlyBurnRate;
          const moraleDrain = gameState.isCrunching ? 12 : (gameState.morale > 120 ? 1 : -2);
          const nextMorale = Math.max(0, Math.min(200, gameState.morale - moraleDrain));
          const nextProgress = Math.min(100, currentProgress + monthlyProgress);

          onUpdateState({
            progress: nextProgress,
            currentMonth: currentMonth + 1,
            money: nextMoney,
            morale: nextMorale,
            stats: { 
              quality: Math.min(100, gameState.stats.quality + (gameState.isCrunching ? 0.3 : 0.8)), 
              hype: Math.min(100, gameState.stats.hype + 0.1), 
              bugs: gameState.stats.bugs + (gameState.isCrunching ? 6 : 1) 
            },
            logs: [...gameState.logs, `[月报] 第 ${currentMonth + 1} 个月: 进度 ${Math.floor(nextProgress)}%`]
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [autoProgress, activeEvent, loadingEvent, gameState.progress, gameState.currentMonth, gameState.isCrunching, monthlyProgress]);

  const handleOptionSelect = (option: DevEventOption) => {
    if (option.cost && gameState.money < option.cost) return;
    onUpdateState({ 
        stats: {
          quality: Math.max(0, Math.min(100, gameState.stats.quality + (option.statImpact.quality || 0))),
          hype: Math.max(0, Math.min(100, gameState.stats.hype + (option.statImpact.hype || 0))),
          bugs: Math.max(0, gameState.stats.bugs + (option.statImpact.bugs || 0)),
        }, 
        progress: Math.max(0, gameState.progress + (option.progressImpact || 0)), 
        money: gameState.money - (option.cost || 0),
        morale: Math.max(0, Math.min(200, gameState.morale + (option.statImpact.morale || 0))),
        logs: [...gameState.logs, `[选择] ✅ ${option.text}`]
    });
    setActiveEvent(null);
    setAutoProgress(true);
  };

  return (
    <div className={`h-[calc(100vh-140px)] flex flex-col gap-6 relative max-w-2xl mx-auto w-full animate-fade-in text-black`}>
        <div className="flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-thin">
            <div className={`xp-window w-full ${gameState.isCrunching ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : ''}`}>
                <div className={`xp-title-bar ${gameState.isCrunching ? 'bg-gradient-to-r from-red-600 to-red-800' : ''}`}>
                    <div className="flex items-center gap-2">
                        <Disc className={`w-4 h-4 ${gameState.isCrunching ? 'animate-spin-fast text-yellow-300' : ''}`} />
                        <span className="text-xs font-bold uppercase">核心研发控制台 - 《{gameState.config.title}》</span>
                    </div>
                </div>
                <div className="bg-[#ECE9D8] p-6 relative border-b border-gray-400">
                    <div className="absolute top-3 right-4 flex flex-col items-end gap-2">
                        {gameState.progress < 100 && (
                          <button 
                              onClick={() => onUpdateState({ isCrunching: !gameState.isCrunching })}
                              className={`xp-btn flex items-center gap-2 font-black text-[9px] px-3 py-1.5 transition-all ${gameState.isCrunching ? 'bg-red-100 border-red-800 text-red-700 ring-2 ring-red-500' : ''}`}
                          >
                              <Flame className={`w-3.5 h-3.5 ${gameState.isCrunching ? 'animate-pulse' : ''}`} />
                              {gameState.isCrunching ? '福报模式: 强力推进' : '常态开发模式'}
                          </button>
                        )}
                        {gameState.progress >= 100 && !generatingAssets && (
                          <button 
                            onClick={onComplete}
                            className="xp-btn-green flex items-center gap-2 font-black text-[11px] px-6 py-2.5 transition-all hover:scale-105 active:scale-95 shadow-xl animate-bounce"
                          >
                            <ArrowRight className="w-4 h-4" />
                            进入发布结算
                          </button>
                        )}
                        {generatingAssets && (
                          <div className="flex items-center gap-2 text-[9px] font-black text-blue-700 animate-pulse bg-white/50 px-3 py-2 rounded border border-blue-200">
                             <Loader2 className="w-3.5 h-3.5 animate-spin" />
                             打包最终版本资产...
                          </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {isTechMismatched && gameState.progress < 100 && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-100 border border-orange-400 text-orange-800 text-[9px] font-bold rounded animate-pulse">
                                <Cpu className="w-3 h-3" /> 技术栈不匹配: 研发受阻
                            </div>
                        )}
                        {isMoraleLow && gameState.progress < 100 && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-100 border border-red-400 text-red-800 text-[9px] font-bold rounded animate-bounce">
                                <AlertTriangle className="w-3 h-3" /> 员工士气极低: 效率大幅衰减
                            </div>
                        )}
                        {gameState.progress >= 100 && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 border border-green-400 text-green-800 text-[9px] font-black rounded">
                                <CheckCircle className="w-3 h-3" /> 开发圆满完成: 等待发布指令
                            </div>
                        )}
                    </div>

                    <div className="xp-progress-container mb-6 shadow-sm">
                        {[...Array(Math.max(0, Math.floor(gameState.progress / 3.33)))].map((_, i) => (
                           <div key={i} className={`xp-progress-block ${gameState.isCrunching ? 'bg-red-500' : ''}`}></div>
                        ))}
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">研发时间轴</div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-blue-700" />
                                <span className="text-xl font-black font-mono">第 {gameState.currentMonth} / ~{estimatedTotalMonths} 月</span>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">总体进度</div>
                             <div className={`text-3xl font-black italic tracking-tighter ${gameState.progress >= 100 ? 'text-green-700' : gameState.isCrunching ? 'text-red-700' : 'text-[#316AC5]'}`}>{Math.floor(gameState.progress)}%</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="xp-window border-blue-600 bg-[#ECE9D8] p-4">
                    <div className="flex justify-around">
                        <div className="text-center">
                            <Star className="text-yellow-600 w-5 h-5 m-auto mb-1" />
                            <div className="text-[9px] font-black text-gray-400 uppercase">品质</div>
                            <div className="font-black text-lg">{Math.floor(gameState.stats.quality)}</div>
                        </div>
                        <div className="text-center">
                            <Zap className="text-purple-600 w-5 h-5 m-auto mb-1" />
                            <div className="text-[9px] font-black text-gray-400 uppercase">热度</div>
                            <div className="font-black text-lg">{Math.floor(gameState.stats.hype)}</div>
                        </div>
                        <div className="text-center">
                            <Bug className="text-red-600 w-5 h-5 m-auto mb-1" />
                            <div className="text-[9px] font-black text-gray-400 uppercase">BUG</div>
                            <div className="font-black text-lg text-red-600">{Math.floor(gameState.stats.bugs)}</div>
                        </div>
                    </div>
                </div>
                <div className="xp-window border-green-700 bg-white p-4 flex items-center justify-between">
                    <div>
                        <div className="text-[9px] font-black text-gray-500 uppercase">研发动能</div>
                        <div className={`text-2xl font-black italic ${gameState.progress >= 100 ? 'text-gray-400' : isMoraleLow ? 'text-red-600' : 'text-green-700'}`}>
                          {gameState.progress >= 100 ? '已完成' : `+${monthlyProgress.toFixed(1)}% / 月`}
                        </div>
                    </div>
                    <Activity className={`w-8 h-8 ${gameState.progress >= 100 ? 'text-gray-300' : isMoraleLow ? 'text-red-400 animate-pulse' : 'text-green-300'}`} />
                </div>
            </div>

            <div className="xp-window border-[#000080] bg-black text-[#00FF00] p-5 font-mono flex justify-between items-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/5 pointer-events-none"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <Coins className="w-6 h-6 text-green-400" />
                    <div>
                        <div className="text-[9px] text-green-800 font-black uppercase">现金储备</div>
                        <div className="text-2xl font-black">¥{gameState.money.toLocaleString()}</div>
                    </div>
                </div>
                <div className="text-right z-10">
                    <div className="text-[9px] text-green-800 font-black uppercase">预计支出</div>
                    <div className="text-sm font-black italic">¥{gameState.monthlyBurnRate.toLocaleString()} / 月</div>
                </div>
            </div>
        </div>

        <div className="xp-window w-full flex-shrink-0 shadow-lg">
            <div className="xp-title-bar h-7 bg-[#316AC5] px-3">
                <Terminal className="w-3.5 h-3.5 mr-2" />
                <span className="text-[10px] font-black">DEV_OUTPUT</span>
            </div>
            <div ref={logContainerRef} className="bg-black text-[#33FF33] font-mono text-[10px] p-3 h-24 overflow-y-auto scrollbar-thin">
                {gameState.logs.slice(-20).map((log, i) => (
                    <div key={i} className="mb-0.5 opacity-80">{`> ${log}`}</div>
                ))}
                <div className="animate-pulse inline-block w-1.5 h-3 bg-[#33FF33] ml-1"></div>
            </div>
        </div>

        {activeEvent && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="xp-window w-full max-w-lg animate-pop-in">
                <div className="xp-title-bar bg-red-700">
                    <span className="flex items-center gap-2 text-xs font-black uppercase">
                        <AlertTriangle className="w-4 h-4" /> 突发事件决策
                    </span>
                    <button onClick={() => setActiveEvent(null)} className="xp-title-btn xp-title-btn-close"><X className="w-4 h-4" /></button>
                </div>
                <div className="bg-[#ECE9D8] p-6">
                    <div className="mb-6 bg-white border-2 border-inset border-gray-400 p-5 h-28 overflow-y-auto text-xs font-bold leading-relaxed">
                         {activeEvent.description}
                    </div>
                    <div className="space-y-2">
                        {activeEvent.options.map((opt, idx) => (
                            <button key={idx} onClick={() => handleOptionSelect(opt)} className="w-full xp-btn text-left p-3 flex justify-between items-center group">
                                <div className="flex-1 pr-4">
                                    <div className="font-black text-[11px] group-hover:text-blue-800">{opt.text}</div>
                                    <div className="text-[9px] text-gray-500 italic mt-0.5">{opt.effectDescription}</div>
                                </div>
                                {opt.cost && <div className="text-red-700 font-black text-[11px]">-¥{opt.cost.toLocaleString()}</div>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default DevPhase;
