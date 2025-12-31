
import React, { useEffect, useState } from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import { Achievement } from '../types';

interface Props {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementToast: React.FC<Props> = ({ achievement, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500); // Wait for fade out animation
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-14 right-4 z-[999] transition-all duration-500 transform ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="xp-window border-[#0055EA] bg-white w-72 shadow-[8px_8px_0px_rgba(0,0,0,0.2)] overflow-hidden">
        <div className="xp-title-bar h-7 bg-gradient-to-r from-blue-700 to-blue-500 px-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-3 h-3 text-yellow-300" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">成就解锁!</span>
          </div>
        </div>
        <div className="p-4 flex items-center gap-4 bg-gradient-to-br from-white to-blue-50">
          <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center text-3xl shadow-inner border-2 border-yellow-300 relative">
             {achievement.icon}
             <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-blue-500 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-blue-900 mb-0.5 truncate uppercase italic tracking-tighter">{achievement.name}</h4>
            <p className="text-[10px] font-bold text-gray-600 leading-tight">{achievement.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementToast;
