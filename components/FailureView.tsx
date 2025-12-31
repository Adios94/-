
import React from 'react';
import { GameState } from '../types';
import { Skull, AlertOctagon, RefreshCw, XCircle, Info, Ghost } from 'lucide-react';

interface Props {
  gameState: GameState;
  onRestart: () => void;
}

const FailureView: React.FC<Props> = ({ gameState, onRestart }) => {
  const isMoraleFailure = (gameState.morale <= 0);

  if (isMoraleFailure) {
    return (
      <div className="fixed inset-0 bg-[#0000AA] z-[250] flex flex-col items-center justify-center p-12 text-white font-mono animate-fade-in select-text">
        <div className="max-w-4xl w-full">
          <div className="bg-white text-[#0000AA] px-4 py-1 inline-block mb-10 font-bold uppercase tracking-widest">PRODUCER_MORALE_CRITICAL_FAILURE</div>
          
          <h1 className="text-2xl mb-8 font-bold leading-relaxed">
            A problem has been detected and your startup has been shut down to prevent further damage to your reputation.
          </h1>
          
          <div className="space-y-6 text-xl leading-relaxed">
            <p>MORALE_EXCEPTION_NOT_HANDLED_AT_RUNTIME</p>
            <p>
              If this is the first time you've seen this Stop error screen, 
              restart your company and try to be less of a crunch-obsessed boss. 
              If this screen appears again, follow these steps:
            </p>
            <ul className="list-disc pl-10 space-y-3">
              <li>Check to make sure any new employees or project themes are properly configured in your mental model.</li>
              <li>If this is a new project, ask your designers for a more realistic GDD (Game Design Document).</li>
              <li>If problems continue, disable crunch mode and increase your 'Team Bonding' budget immediately.</li>
            </ul>
            
            <p className="pt-10">Technical information:</p>
            <p className="font-black text-2xl">*** STOP: 0x0000000A (0x00000002, 0x00000001, 0x00000000, 0x80050003)</p>
            
            <div className="pt-8 border-t border-white/20 mt-8">
               <p className="italic text-blue-200 text-lg">
                 "{gameState.failureReason || '团队士气归零，员工们在深夜选择集体离职，并带走了所有咖啡机。'}"
               </p>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-start gap-4">
            <button 
              onClick={onRestart}
              className="bg-white text-[#0000AA] px-12 py-4 font-black text-xl hover:bg-gray-100 active:bg-gray-300 transition-all shadow-[8px_8px_0_rgba(0,0,0,0.5)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              CLICK HERE TO REBOOT YOUR CAREER
            </button>
            <div className="text-sm opacity-40 font-bold tracking-widest">PRODUCER_KERNEL_HALT: TERMINATED_BY_STAFF</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="xp-window w-full max-w-lg mx-auto shadow-[30px_30px_0px_rgba(0,0,0,0.5)] animate-pop-in">
      <div className="xp-title-bar bg-gradient-to-r from-red-700 to-red-500">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">严重系统错误 - 资本流失</span>
        </div>
        <div className="xp-title-btn xp-title-btn-close" onClick={onRestart}><XCircle className="w-4 h-4" /></div>
      </div>
      
      <div className="bg-[#ECE9D8] p-10">
        <div className="flex items-start gap-8 mb-10">
          <div className="p-4 bg-white border-2 border-inset border-gray-400 rounded-full shadow-2xl flex-shrink-0">
             <Skull className="w-16 h-16 text-red-600 drop-shadow-lg" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-red-700 mb-3 italic tracking-tighter">公司破产 (BANKRUPTCY)</h2>
            <div className="bg-white border-2 border-inset border-gray-400 p-5 text-xs font-bold leading-relaxed italic text-gray-700 shadow-inner">
               "{gameState.failureReason || '由于入不敷出，你的办公室已被法院查封，主策划正在街头卖艺。'}"
            </div>
          </div>
        </div>

        <fieldset className="border-2 border-gray-400 p-6 mb-10 bg-white/40 rounded-sm">
          <legend className="px-3 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] bg-[#ECE9D8] border border-gray-400 ml-4 italic">项目遗言汇总</legend>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-black uppercase mb-1">中止进度</span>
              <span className="text-2xl font-black text-[#316AC5] font-mono">{Math.floor(gameState.progress)}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-black uppercase mb-1">债务差额</span>
              <span className="text-2xl font-black text-red-700 font-mono tracking-tighter">¥{gameState.money.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-black uppercase mb-1">生存时长</span>
              <span className="text-2xl font-black text-gray-800 font-mono tracking-tighter">{gameState.currentMonth} MONS</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-black uppercase mb-1">项目残留分</span>
              <span className="text-2xl font-black text-orange-600 font-mono">{Math.floor(gameState.stats.quality)}</span>
            </div>
          </div>
        </fieldset>

        <div className="flex flex-col gap-4">
          <button 
            onClick={onRestart}
            className="xp-btn-green w-full py-4 flex items-center justify-center gap-4 shadow-xl hover:scale-[1.01] active:scale-95 transition-all"
          >
            <RefreshCw className="w-6 h-6 drop-shadow-md" />
            <span className="text-xl font-black italic tracking-tight">申请二次创业 (NEW GAME)</span>
          </button>
          
          <div className="flex items-center gap-2 justify-center text-[11px] text-gray-500 italic font-bold">
            <Info className="w-4 h-4 text-blue-500" />
            <span>* 注意：这将永久重置您所有的资源。</span>
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-12 -right-12 opacity-10 pointer-events-none transform rotate-12">
        <Ghost className="w-48 h-48 text-white" />
      </div>
    </div>
  );
};

export default FailureView;