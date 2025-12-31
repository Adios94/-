
import React, { useState, useMemo, useEffect } from 'react';
import { GameState, MarketingOption } from '../types';
import { MARKETING_OPTIONS } from '../constants';
import { generateGameSummary } from '../services/geminiService';
import { DollarSign, Disc, X, Box, Loader2, Check, Zap, Megaphone, Sparkles, RefreshCw, FileText } from 'lucide-react';

interface Props {
  gameState: GameState;
  onUpdateState: (updates: Partial<GameState>) => void;
  onLaunch: () => void;
}

const ReleaseView: React.FC<Props> = ({ gameState, onUpdateState, onLaunch }) => {
  const [localPrice, setLocalPrice] = useState(60);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [localSummary, setLocalSummary] = useState(gameState.summary || "");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    if (gameState.summary && !localSummary) {
      setLocalSummary(gameState.summary);
    }
  }, [gameState.summary]);

  const totalMarketingCost = useMemo(() => {
    return selectedChannels.reduce((sum, id) => {
      const opt = MARKETING_OPTIONS.find(o => o.id === id);
      return sum + (opt?.cost || 0);
    }, 0);
  }, [selectedChannels]);

  const canAfford = gameState.money >= totalMarketingCost;

  const toggleChannel = (id: string) => {
    setSelectedChannels(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAiSummary = async () => {
    setIsGeneratingSummary(true);
    const summary = await generateGameSummary(gameState);
    if (summary) {
      setLocalSummary(summary);
    }
    setIsGeneratingSummary(false);
  };

  const handleLaunch = () => {
    if (!canAfford) return;
    onUpdateState({ 
      price: localPrice, 
      selectedMarketing: selectedChannels,
      summary: localSummary,
      money: gameState.money - totalMarketingCost,
      logs: [...gameState.logs, `项目发布！定价 ¥${localPrice}。支出营销费用 ¥${totalMarketingCost.toLocaleString()}`]
    });
    onLaunch();
  };

  const getPriceFeedback = (p: number) => {
    if (p < 50) return { text: "廉价定价：极易扩散，但单份利润极低。", color: "text-green-600" };
    if (p < 150) return { text: "标准定价：市场接受度最高的平衡区间。", color: "text-blue-600" };
    if (p < 280) return { text: "3A定价：玩家将以最高标准审视品质。", color: "text-orange-600" };
    return { text: "奢侈定价：可能被喷，除非真的是旷世神作。", color: "text-red-600 font-bold" };
  };

  const feedback = getPriceFeedback(localPrice);

  return (
    <div className="xp-window w-full max-w-4xl mx-auto shadow-2xl animate-fade-in text-black">
        <div className="xp-title-bar">
            <div className="flex items-center gap-2">
                <Box className="w-4 h-4" />
                <span className="text-xs">发布向导 - 最终部署与宣发策略</span>
            </div>
            <X className="w-4 h-4 cursor-pointer hover:bg-red-500 rounded transition-colors" />
        </div>
        
        <div className="bg-[#ECE9D8] p-6 flex flex-col lg:flex-row gap-8 max-h-[85vh] overflow-y-auto scrollbar-thin">
            {/* Left Column: Game Info & Pricing */}
            <div className="flex-1 space-y-6 min-w-0">
                <div className="flex items-start gap-4 p-4 bg-white border-2 border-inset border-gray-400 shadow-inner overflow-hidden">
                    <div className="w-24 h-32 flex-shrink-0 bg-gray-100 border border-gray-300 relative overflow-hidden group">
                        {gameState.coverUrl ? (
                            <img src={gameState.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                            <Disc className="w-12 h-12 text-blue-200 m-auto mt-10 animate-spin" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-black text-[#003399] italic truncate" title={`《${gameState.config.title}》`}>《{gameState.config.title}》</h2>
                        <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 truncate">Final Master Version</div>
                        <div className="text-[9px] text-gray-400 font-bold mb-2 uppercase italic truncate" title={`题材: ${gameState.config.theme} | 类型: ${gameState.config.genre}`}>
                            题材: {gameState.config.theme} | 类型: {gameState.config.genre}
                        </div>
                        
                        <div className="relative group">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> 商店简介 (STORE SUMMARY)
                            </label>
                            <textarea 
                                value={localSummary}
                                onChange={(e) => setLocalSummary(e.target.value)}
                                className="w-full h-24 bg-blue-50/50 p-2 text-[11px] leading-relaxed italic border-2 border-inset border-blue-100 shadow-inner focus:outline-none focus:border-blue-300 transition-colors resize-none"
                                placeholder="输入吸引玩家的宣传文案..."
                            />
                            <button 
                                onClick={handleAiSummary}
                                disabled={isGeneratingSummary}
                                className="absolute bottom-2 right-2 p-1.5 bg-white border border-blue-200 rounded shadow-sm hover:bg-blue-50 transition-colors group/ai"
                                title="AI 生成/优化简介"
                            >
                                {isGeneratingSummary ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                                ) : (
                                    <Sparkles className="w-3.5 h-3.5 text-blue-600 group-hover/ai:scale-110 transition-transform" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <section>
                    <div className="flex items-center gap-2 mb-3 text-blue-800">
                        <DollarSign className="w-4 h-4" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest border-b border-blue-200 flex-1">1. 市场定价 (Product Pricing)</h3>
                    </div>
                    <div className="bg-white border-2 border-inset border-gray-400 p-6 shadow-inner">
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-4xl font-black font-mono text-green-700">¥{localPrice}</span>
                            <span className="text-xs text-gray-400 font-bold">/ UNIT</span>
                        </div>
                        <input 
                            type="range" min="18" max="498" step="1" 
                            value={localPrice} onChange={(e) => setLocalPrice(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-4"
                        />
                        <div className={`text-[11px] font-bold p-2 rounded ${feedback.color.includes('red') ? 'bg-red-50' : 'bg-blue-50'} ${feedback.color} border border-current opacity-80`}>
                            {feedback.text}
                        </div>
                    </div>
                </section>
            </div>

            {/* Right Column: Marketing Strategy */}
            <div className="lg:w-96 space-y-6 flex-shrink-0">
                <section>
                    <div className="flex items-center gap-2 mb-3 text-blue-800">
                        <Megaphone className="w-4 h-4" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest border-b border-blue-200 flex-1">2. 宣发渠道 (Marketing Channels)</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[400px] pr-2 scrollbar-thin">
                        {MARKETING_OPTIONS.map(opt => (
                            <div 
                                key={opt.id}
                                onClick={() => toggleChannel(opt.id)}
                                className={`p-3 border-2 cursor-pointer transition-all flex items-center gap-3 ${selectedChannels.includes(opt.id) ? 'bg-blue-50 border-blue-600 shadow-md scale-[1.02]' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
                            >
                                <span className="text-2xl">{opt.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black truncate">{opt.name}</span>
                                        <span className="text-[10px] font-bold text-red-600">¥{opt.cost.toLocaleString()}</span>
                                    </div>
                                    <p className="text-[9px] text-gray-500 italic truncate">{opt.desc}</p>
                                </div>
                                {selectedChannels.includes(opt.id) && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                            </div>
                        ))}
                    </div>
                </section>

                <div className="xp-window border-gray-500 shadow-lg">
                    <div className="xp-title-bar h-7 bg-gray-600 text-[10px] px-3 font-bold">发售成本结算</div>
                    <div className="p-4 bg-white space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[11px] font-bold text-gray-500"><span>当前现金流:</span><span>¥{gameState.money.toLocaleString()}</span></div>
                            <div className="flex justify-between text-[11px] font-black text-red-600"><span>宣发总投入:</span><span>-¥{totalMarketingCost.toLocaleString()}</span></div>
                            <div className="flex justify-between text-[12px] font-black border-t pt-2"><span>预计剩余:</span><span className={canAfford ? 'text-green-700' : 'text-red-700'}>¥{(gameState.money - totalMarketingCost).toLocaleString()}</span></div>
                        </div>
                        
                        {!canAfford && (
                            <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold animate-pulse text-center">
                                资金不足，请削减宣发预算
                            </div>
                        )}

                        <button 
                            onClick={handleLaunch}
                            disabled={!canAfford}
                            className={`xp-btn-green w-full py-3 flex items-center justify-center gap-2 font-black text-sm shadow-xl transition-all ${!canAfford ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-[1.05]'}`}
                        >
                            <Zap className="w-4 h-4 fill-white" />
                            全球同步发售 (GLOBAL LAUNCH)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ReleaseView;
