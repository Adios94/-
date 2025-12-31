import React, { useEffect } from 'react';

interface Props {
  onComplete: () => void;
}

const StartupAnimation: React.FC<Props> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center font-sans overflow-hidden">
      <style>{`
        @keyframes boot-progress {
          0% { left: -20%; }
          100% { left: 100%; }
        }
        .xp-progress-segment {
          width: 8px;
          height: 12px;
          background: linear-gradient(to bottom, #3079ED, #002D96);
          border-radius: 1px;
          box-shadow: 0 0 4px #3079ED;
        }
      `}</style>
      
      <div className="mb-12 flex flex-col items-center">
        <div className="flex items-baseline gap-1">
          <span className="text-white text-4xl font-bold tracking-tighter italic">Microsoft</span>
          <span className="text-white text-6xl font-black italic tracking-tighter">Windows</span>
          <span className="text-[#F16522] text-4xl font-black italic">XP</span>
        </div>
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#F16522] to-transparent mt-2"></div>
      </div>

      <div className="w-64 h-4 border-2 border-[#808080] rounded p-[1px] relative overflow-hidden bg-black">
        <div className="absolute top-0 bottom-0 flex gap-[2px] animate-[boot-progress_2s_linear_infinite]">
          <div className="xp-progress-segment"></div>
          <div className="xp-progress-segment"></div>
          <div className="xp-progress-segment"></div>
        </div>
      </div>

      <div className="absolute bottom-12 text-[#808080] text-[10px] tracking-widest uppercase">
        Copyright © Microsoft Corporation
      </div>

      {/* Decorative corner text */}
      <div className="absolute bottom-4 right-4 text-[#404040] text-[8px] font-mono">
        SUPER_PRODUCER_OS_V2.0.4.SYS
      </div>
    </div>
  );
};

export default StartupAnimation;