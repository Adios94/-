
import React from 'react';
import { X, Trophy, Lock, CheckCircle, Star } from 'lucide-react';
import { ACHIEVEMENTS } from '../constants';

interface Props {
  unlockedIds: string[];
  onClose: () => void;
}

const AchievementsView: React.FC<Props> = ({ unlockedIds, onClose }) => {
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/20 p-4">
      <div className="xp-window w-full max-w-2xl animate-pop-in">
        <div className="xp-title-bar">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>成就中心 - 荣誉墙</span>
          </div>
          <X className="w-4 h-4 cursor-pointer" onClick={onClose} />
        </div>
        
        <div className="bg-[#ECE9D8] p-1 border-b border-gray-400">
           <div className="flex px-4 pt-2 gap-0.5">
              <div className="bg-white border-x border-t border-gray-400 rounded-t-md px-4 py-1.5 text-xs font-bold text-blue-800 -mb-[1px] relative z-10">所有成就</div>
              <div className="bg-[#ECE9D8] border-x border-t border-gray-300 rounded-t-md px-4 py-1.5 text-xs font-bold text-gray-600">已解锁 ({unlockedIds.length})</div>
           </div>
        </div>

        <div className="bg-white border-2 border-inset border-gray-400 flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto p-4 bg-[#F1F1F1] scrollbar-thin">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACHIEVEMENTS.map((ach) => {
                const isUnlocked = unlockedIds.includes(ach.id);
                return (
                  <div 
                    key={ach.id} 
                    className={`flex items-center gap-3 p-3 border-2 transition-all ${isUnlocked ? 'bg-white border-blue-400 shadow-md' : 'bg-gray-200 border-gray-300 opacity-60'}`}
                  >
                    <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-2xl shadow-inner ${isUnlocked ? 'bg-yellow-100 border border-yellow-300' : 'bg-gray-300 grayscale'}`}>
                      {ach.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className={`text-xs font-black uppercase tracking-tighter ${isUnlocked ? 'text-blue-900' : 'text-gray-500'}`}>{ach.name}</span>
                        {isUnlocked && <CheckCircle className="w-3 h-3 text-green-500" />}
                      </div>
                      <div className="text-[10px] text-gray-600 font-bold leading-tight">{ach.description}</div>
                      {!isUnlocked && <div className="text-[9px] text-gray-400 mt-1 italic">条件: {ach.requirement}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-[#ECE9D8] p-3 flex justify-between items-center">
           <div className="text-[10px] font-black text-blue-800 px-4">
              当前解锁率: {Math.round((unlockedIds.length / ACHIEVEMENTS.length) * 100)}%
           </div>
           <button className="xp-btn px-6 font-bold" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
};

export default AchievementsView;
