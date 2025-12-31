
import React from 'react';
import { GameState } from '../types';
import { Monitor, Cpu, HardDrive, User, X, Minimize } from 'lucide-react';

interface Props {
  gameState: GameState;
  onClose: () => void;
}

const SystemStats: React.FC<Props> = ({ gameState, onClose }) => {
  return (
    <div className="absolute inset-0 z-[150] flex items-center justify-center bg-black/30 p-4">
      <div className="xp-window w-full max-w-lg animate-pop-in">
        <div className="xp-title-bar">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            <span className="text-xs">系统属性 - {gameState.config.title || 'Super Producer OS'}</span>
          </div>
          <div className="flex gap-1">
            <div className="xp-title-btn xp-title-btn-util"><Minimize className="w-3 h-3" /></div>
            <div className="xp-title-btn xp-title-btn-close" onClick={onClose}><X className="w-4 h-4" /></div>
          </div>
        </div>
        
        <div className="bg-[#ECE9D8] p-1 border-b border-gray-400">
           <div className="flex px-4 pt-2 gap-0.5">
              <div className="bg-white border-x border-t border-gray-400 rounded-t-md px-4 py-1.5 text-xs font-bold text-blue-800 -mb-[1px] relative z-10">常规</div>
              <div className="bg-[#ECE9D8] border-x border-t border-gray-300 rounded-t-md px-4 py-1.5 text-xs font-bold text-gray-600">高级</div>
              <div className="bg-[#ECE9D8] border-x border-t border-gray-300 rounded-t-md px-4 py-1.5 text-xs font-bold text-gray-600">自动更新</div>
           </div>
        </div>

        <div className="bg-[#ECE9D8] p-6 flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center gap-6">
            <div className="p-6 bg-white border-2 border-inset border-gray-400 shadow-inner rounded-md flex items-center justify-center">
              <Monitor className="w-20 h-20 text-blue-600" />
            </div>
            <div className="text-center">
              <div className="text-xs font-black text-gray-800 uppercase tracking-widest mb-1">系统运行时</div>
              <div className="text-[11px] text-green-700 font-black italic">VERSION_XP_STABLE</div>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <section className="border-b border-gray-300 pb-4">
              <div className="flex items-center gap-2 mb-3 text-blue-800">
                <Cpu className="w-5 h-5" />
                <h3 className="text-[11px] font-black uppercase tracking-widest border-b border-blue-100 flex-1">核心开发团队 (CORE_CPU)</h3>
              </div>
              <div className="grid grid-cols-1 gap-2 text-[12px] font-bold">
                <div className="flex justify-between items-center bg-white/40 px-2 py-1 border border-transparent hover:border-blue-100">
                  <span className="text-gray-500 font-normal">主策划 [CD]:</span>
                  <span className="text-[#003399]">{gameState.team.designer?.name || 'INITIALIZING...'}</span>
                </div>
                <div className="flex justify-between items-center bg-white/40 px-2 py-1 border border-transparent hover:border-blue-100">
                  <span className="text-gray-500 font-normal">主程序 [CTO]:</span>
                  <span className="text-[#003399]">{gameState.team.programmer?.name || 'INITIALIZING...'}</span>
                </div>
                <div className="flex justify-between items-center bg-white/40 px-2 py-1 border border-transparent hover:border-blue-100">
                  <span className="text-gray-500 font-normal">主美术 [AD]:</span>
                  <span className="text-[#003399]">{gameState.team.artist?.name || 'INITIALIZING...'}</span>
                </div>
              </div>
            </section>

            <section className="border-b border-gray-300 pb-4">
              <div className="flex items-center gap-2 mb-3 text-blue-800">
                <HardDrive className="w-5 h-5" />
                <h3 className="text-[11px] font-black uppercase tracking-widest border-b border-blue-100 flex-1">系统性能摘要 (STATS)</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="xp-inset p-3 bg-white shadow-inner">
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-1">可用现金流</div>
                  <div className="text-lg font-black text-green-700 font-mono italic tracking-tighter">¥{gameState.money.toLocaleString()}</div>
                </div>
                <div className="xp-inset p-3 bg-white shadow-inner">
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mb-1">核心士气指数</div>
                  <div className="text-lg font-black text-blue-700 font-mono italic tracking-tighter">{gameState.morale}/200</div>
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-4 gap-3">
              <button className="xp-btn px-8 font-black shadow-sm" onClick={onClose}>确定 (OK)</button>
              <button className="xp-btn px-8 font-bold opacity-60" disabled>应用 (A)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStats;