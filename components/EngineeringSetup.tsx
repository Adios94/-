
import React, { useState, useMemo } from 'react';
import { GameState, EngineeringConfig } from '../types';
import { Cpu, X, AlertCircle, Check, DollarSign, Layout, Zap, Palette, Settings, Layers, ArrowLeft } from 'lucide-react';

interface Props {
  gameState: GameState;
  onComplete: (config: EngineeringConfig) => void;
  onBack: () => void;
}

const ENGINES = [
  { name: 'RPG Maker', cost: 0, speed: 1.5, quality: 0.6, desc: '低成本极速开发，但上限较低。' },
  { name: 'Godot', cost: 0, speed: 1.3, quality: 0.8, desc: '开源新秀，轻量且灵活。' },
  { name: 'Unity', cost: 50000, speed: 1.1, quality: 1.0, desc: '行业标准，插件生态丰富。' },
  { name: 'Unreal Engine 5', cost: 150000, speed: 0.8, quality: 1.6, desc: '次世代画质，昂贵但强大。' },
  { name: 'Custom Engine', cost: 400000, speed: 0.5, quality: 2.2, desc: '极致优化，研发周期漫长。' },
];

const AI_OPTIONS = [
  { name: 'None', label: '纯人工开发', cost: 0, speed: 1.0, quality: 1.1, desc: '保留纯粹的创意灵魂。' },
  { name: 'Partial', label: 'AI 辅助', cost: 80000, speed: 1.5, quality: 0.9, desc: '大幅提升效率，创意略显平庸。' },
  { name: 'Full', label: 'AI 全量覆盖', cost: 200000, speed: 2.2, quality: 0.5, desc: '瞬间生成代码与美术，但缺乏灵魂。' },
];

const FIDELITY_LEVELS = [
  { name: 'Pixel', label: '复古像素', speed: 1.4, quality: 0.7 },
  { name: 'Stylized', label: '卡通渲染', speed: 1.0, quality: 1.0 },
  { name: 'Realistic', label: '写实 3A', speed: 0.6, quality: 1.8 },
];

const OPT_LEVELS = [
  { name: 'Standard', label: '标准构建', cost: 0, speed: 1.0, bugMod: 0, desc: '默认编译选项，平衡稳定。' },
  { name: 'Aggressive', label: '极致优化 (O3)', cost: 20000, speed: 1.1, bugMod: 1.2, desc: '激进的代码内联，可能导致难以排查的Bug。' },
  { name: 'LTO', label: '全周期链路优化', cost: 50000, speed: 1.2, bugMod: 1.5, desc: '极致的运行效率，但开发编译时间翻倍。' },
];

const DEP_STRATEGIES = [
  { name: 'Lean', label: '极简依赖', cost: 5000, speed: 0.9, quality: 1.1, desc: '减少外部库，代码更纯净，质量提升。' },
  { name: 'Rich Middleware', label: '商业中间件', cost: 40000, speed: 1.2, quality: 1.0, desc: '使用成熟物理/渲染库，加速实现。' },
  { name: 'Experimental', label: '实验性技术栈', cost: 10000, speed: 1.3, quality: 0.8, desc: '追求新技术，极快但不稳定。' },
];

const EngineeringSetup: React.FC<Props> = ({ gameState, onComplete, onBack }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [engineIndex, setEngineIndex] = useState(2);
  const [aiIndex, setAiIndex] = useState(0);
  const [fidelityIndex, setFidelityIndex] = useState(1);
  const [optIndex, setOptIndex] = useState(0);
  const [depIndex, setDepIndex] = useState(1);

  const analysis = useMemo(() => {
    const engine = ENGINES[engineIndex];
    const ai = AI_OPTIONS[aiIndex];
    const fidelity = FIDELITY_LEVELS[fidelityIndex];
    const opt = OPT_LEVELS[optIndex];
    const dep = DEP_STRATEGIES[depIndex];

    const upfrontCost = engine.cost + ai.cost + opt.cost + dep.cost;
    const combinedSpeed = engine.speed * ai.speed * fidelity.speed * opt.speed * dep.speed;
    const combinedQuality = engine.quality * ai.quality * fidelity.quality * dep.quality;

    const teamTech = (gameState.team.programmer?.stats.technology || 50) / 100;
    const teamDesign = (gameState.team.designer?.stats.creativity || 50) / 100;
    
    const baseDuration = 24; 
    const estimatedMonths = Math.ceil(baseDuration / (combinedSpeed * (teamTech * 0.7 + teamDesign * 0.3)));
    const totalSalaryCost = estimatedMonths * gameState.monthlyBurnRate;
    const totalCost = upfrontCost + totalSalaryCost;
    const remainingMoney = gameState.money - totalCost;

    return {
      upfrontCost,
      estimatedMonths,
      totalCost,
      remainingMoney,
      isFeasible: remainingMoney >= 0,
      qualityPotential: Math.floor(combinedQuality * 40) 
    };
  }, [engineIndex, aiIndex, fidelityIndex, optIndex, depIndex, gameState]);

  const handleSubmit = () => {
    const engine = ENGINES[engineIndex];
    const ai = AI_OPTIONS[aiIndex];
    const fidelity = FIDELITY_LEVELS[fidelityIndex];

    onComplete({
      engine: engine.name,
      aiAssistance: ai.name as any,
      graphicsLevel: fidelity.name as any,
      upfrontCost: analysis.upfrontCost,
      speedMultiplier: engine.speed * ai.speed * fidelity.speed * OPT_LEVELS[optIndex].speed * DEP_STRATEGIES[depIndex].speed,
      qualityMultiplier: engine.quality * ai.quality * fidelity.quality * DEP_STRATEGIES[depIndex].quality,
      optimizationLevel: OPT_LEVELS[optIndex].name,
      dependencyStrategy: DEP_STRATEGIES[depIndex].name
    });
  };

  return (
    <div className="xp-window w-full max-w-4xl mx-auto shadow-2xl animate-fade-in text-black">
      <div className="xp-title-bar">
        <div className="flex items-center gap-2 font-bold uppercase tracking-widest">
          <Cpu className="w-4 h-4" />
          <span className="text-xs">工程技术选型 (TECH_STACK_CONFIG)</span>
        </div>
      </div>

      <div className="bg-[#ECE9D8] p-1 flex border-b border-gray-400">
          <div className="flex px-4 pt-2 gap-1">
              {['核心引擎与AI', '编译器优化', '依赖管理'].map((tab, idx) => (
                <div 
                  key={tab}
                  onClick={() => setActiveTab(idx)}
                  className={`${activeTab === idx ? 'bg-white text-blue-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]' : 'bg-[#ECE9D8] text-gray-700 hover:text-blue-600'} border-x border-t border-gray-400 rounded-t-md px-4 py-1.5 text-xs font-black cursor-pointer -mb-[1px] relative z-10 transition-colors uppercase tracking-tighter`}
                >
                  {tab}
                </div>
              ))}
          </div>
      </div>

      <div className="bg-[#ECE9D8] p-6 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {activeTab === 0 && (
            <div className="space-y-6 animate-fade-in">
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Layout className="w-4 h-4 text-blue-800" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest border-b border-blue-200 flex-1">1. 研发引擎与表现力 (GRAPHICS_CORE)</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {ENGINES.map((eng, i) => (
                    <div key={eng.name} onClick={() => setEngineIndex(i)} className={`flex items-center justify-between p-2.5 border-2 cursor-pointer transition-all ${engineIndex === i ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-100' : 'bg-gray-50/50 border-gray-300 hover:bg-white hover:border-blue-400'}`}>
                      <div>
                        <div className="text-xs font-black uppercase italic">{eng.name}</div>
                        <div className="text-[10px] text-gray-700 italic">{eng.desc}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-black text-green-700 font-mono">¥{eng.cost.toLocaleString()}</div>
                        <div className="text-[9px] text-gray-400 font-mono uppercase tracking-tighter">QUALITY: {eng.quality}x | SPEED: {eng.speed}x</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-2 gap-4">
                <section>
                  <div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-blue-800" /><h3 className="text-[10px] font-black uppercase tracking-widest">AI 算力介入</h3></div>
                  <div className="space-y-1">
                    {AI_OPTIONS.map((opt, i) => (
                      <label key={opt.name} className={`flex items-start gap-2 p-2 border rounded cursor-pointer transition-colors ${aiIndex === i ? 'bg-white border-blue-600' : 'bg-white/50 border-gray-300 hover:bg-white'}`}>
                        <input type="radio" checked={aiIndex === i} onChange={() => setAiIndex(i)} className="mt-1 accent-blue-600" />
                        <div className="text-[11px] font-black text-black uppercase">{opt.label} <span className="text-[9px] block font-mono text-red-600">¥{opt.cost.toLocaleString()}</span></div>
                      </label>
                    ))}
                  </div>
                </section>
                <section>
                  <div className="flex items-center gap-2 mb-2"><Palette className="w-4 h-4 text-blue-800" /><h3 className="text-[10px] font-black uppercase tracking-widest">视觉保真度</h3></div>
                  <div className="space-y-1">
                    {FIDELITY_LEVELS.map((lvl, i) => (
                      <label key={lvl.name} className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors ${fidelityIndex === i ? 'bg-white border-blue-600' : 'bg-white/50 border-gray-300 hover:bg-white'}`}>
                        <input type="radio" checked={fidelityIndex === i} onChange={() => setFidelityIndex(i)} className="mt-1 accent-blue-600" />
                        <div className="text-[11px] font-black text-black uppercase">{lvl.label} <span className="text-[9px] block font-mono text-gray-500 italic">Complexity: {(1/lvl.speed).toFixed(1)}x</span></div>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-6 animate-fade-in">
              <section>
                 <div className="flex items-center gap-2 mb-3"><Settings className="w-4 h-4 text-blue-800" /><h3 className="text-[11px] font-black uppercase tracking-widest border-b border-blue-200 flex-1">2. 编译器编译优化策略 (COMPILATION)</h3></div>
                 <div className="grid grid-cols-1 gap-3">
                   {OPT_LEVELS.map((opt, i) => (
                      <div key={opt.name} onClick={() => setOptIndex(i)} className={`p-4 border-2 cursor-pointer transition-all ${optIndex === i ? 'bg-white border-blue-600 shadow-md' : 'bg-gray-50/50 border-gray-300 hover:bg-white'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-black uppercase">{opt.label}</span>
                          <span className="text-xs font-black text-green-700 font-mono italic">¥{opt.cost.toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] text-gray-700 italic">{opt.desc}</div>
                        <div className="text-[9px] text-gray-400 mt-2 font-mono uppercase tracking-widest">Efficiency: +{Math.round((opt.speed - 1) * 100)}% | Risk Factor: +{Math.round(opt.bugMod * 20)}%</div>
                      </div>
                   ))}
                 </div>
              </section>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-6 animate-fade-in">
              <section>
                 <div className="flex items-center gap-2 mb-3"><Layers className="w-4 h-4 text-blue-800" /><h3 className="text-[11px] font-black uppercase tracking-widest border-b border-blue-200 flex-1">3. 第三方商业中间件依赖 (DEPENDENCIES)</h3></div>
                 <div className="grid grid-cols-1 gap-3">
                   {DEP_STRATEGIES.map((dep, i) => (
                      <div key={dep.name} onClick={() => setDepIndex(i)} className={`p-4 border-2 cursor-pointer transition-all ${depIndex === i ? 'bg-white border-blue-600 shadow-md' : 'bg-gray-50/50 border-gray-300 hover:bg-white'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-black uppercase">{dep.label}</span>
                          <span className="text-xs font-black text-green-700 font-mono italic">¥{dep.cost.toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] text-gray-700 italic">{dep.desc}</div>
                        <div className="text-[9px] text-gray-400 mt-2 font-mono uppercase tracking-widest">Quality Factor: {dep.quality}x | Dev Boost: {dep.speed}x</div>
                      </div>
                   ))}
                 </div>
              </section>
            </div>
          )}
        </div>

        <div className="w-full lg:w-72 flex flex-col gap-4">
          <div className="xp-window border-gray-500 shadow-md">
            <div className="xp-title-bar h-7 bg-gray-600 text-[10px] px-3 font-black uppercase italic">工程可行性摘要 (FEASIBILITY)</div>
            <div className="p-4 bg-white space-y-4">
              <div className="space-y-2 border-b border-dashed border-gray-200 pb-2">
                <div className="flex justify-between text-[11px] font-black uppercase text-gray-500"><span>预计工期:</span><span className="text-blue-700 font-mono">{analysis.estimatedMonths} MONS</span></div>
                <div className="flex justify-between text-[11px] font-black uppercase text-gray-500"><span>即时投入:</span><span className="text-red-600 font-mono">¥{analysis.upfrontCost.toLocaleString()}</span></div>
                <div className="flex justify-between text-[12px] font-black uppercase pt-2"><span>预算占用:</span><span className="font-mono">¥{analysis.totalCost.toLocaleString()}</span></div>
              </div>
              <div className={`p-3 border-2 border-inset rounded-sm flex flex-col items-center gap-1 shadow-inner ${analysis.isFeasible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200 animate-pulse'}`}>
                {analysis.isFeasible ? (
                  <div className="text-[10px] font-black text-green-700 text-center flex items-center gap-1 uppercase tracking-tighter"><Check className="w-3 h-3" /> 财务状况良好</div>
                ) : (
                  <div className="text-[10px] font-black text-red-700 text-center flex items-center gap-1 uppercase tracking-tighter"><AlertCircle className="w-3.5 h-3.5" /> 核心警告: 现金流穿仓</div>
                )}
              </div>
              <div className="space-y-1.5">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">预期成品上限</div>
                <div className="xp-progress-container h-4 shadow-inner">
                    {[...Array(Math.max(1, Math.min(10, Math.floor(analysis.qualityPotential / 10))))].map((_, i) => <div key={i} className="xp-progress-block"></div>)}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-2">
             <button 
                onClick={handleSubmit} 
                disabled={!analysis.isFeasible} 
                className={`xp-btn-green w-full py-4 flex items-center justify-center gap-2 font-black text-sm shadow-xl transition-all ${!analysis.isFeasible ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-[1.03] active:scale-95'}`}
             >
                <DollarSign className="w-4 h-4" /> 交付工程方案
             </button>
             <button 
                onClick={onBack}
                className="xp-btn w-full py-2 flex items-center justify-center gap-2 font-bold text-xs shadow-md transition-all hover:bg-gray-200 active:scale-95"
             >
                <ArrowLeft className="w-3 h-3" /> 返回上一页 (修改策划)
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineeringSetup;
