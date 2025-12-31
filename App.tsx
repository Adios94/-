
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_STATE } from './constants';
import { GameState, GameStage, StaffMember, GameConfig } from './types';
import GameSetup from './components/GameSetup';
import TeamSelection from './components/TeamSelection';
import EngineeringSetup from './components/EngineeringSetup';
import DevPhase from './components/DevPhase';
import ReleaseView from './components/ReleaseView';
import ResultsView from './components/ResultsView';
import FailureView from './components/FailureView';
import SystemStats from './components/SystemStats';
import HistoryView from './components/HistoryView';
import { audio } from './services/audioService';
import { Monitor, Wallet, FolderOpen, Trash2, HelpCircle, X, BookOpen, Terminal, Sparkles, Gamepad2, LogOut, Info, Settings } from 'lucide-react';

const DesktopIcon: React.FC<{ icon: any, label: string, onClick?: () => void }> = ({ icon: Icon, label, onClick }) => (
  <div 
    onClick={() => { audio.playClick(); onClick?.(); }}
    className="flex flex-col items-center gap-1 group cursor-pointer w-24 select-none mb-6 animate-fade-in"
  >
    <div className="p-3 bg-blue-500/5 rounded-xl border border-white/5 backdrop-blur-md group-hover:bg-blue-500/30 group-hover:scale-105 transition-all shadow-md">
      <Icon className="w-11 h-11 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
    </div>
    <span className="text-[11px] text-white text-center font-bold tracking-tight px-1.5 py-0.5 rounded-sm bg-black/30 border border-transparent group-hover:bg-[#316AC5] group-hover:border-[#000080] shadow-sm transition-all uppercase">
      {label}
    </span>
  </div>
);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [time, setTime] = useState(new Date());
  const [showStartMenu, setShowStartMenu] = useState(false);
  const startMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    audio.playStartup();
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close start menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startMenuRef.current && !startMenuRef.current.contains(event.target as Node)) {
        setShowStartMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleRestart = () => {
    audio.playGlitch();
    if(confirm("确定要重置所有系统数据并重启职业生涯吗？")) {
      window.location.reload();
    }
  };

  const closeWindow = () => {
    audio.playClick();
    updateState({ activeApp: 'NONE' });
  };

  const formattedTime = time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="h-screen flex flex-col overflow-hidden select-none bg-black font-sans">
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Game Logo Background */}
        <div className="absolute top-10 left-32 pointer-events-none select-none z-0 animate-fade-in opacity-20">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/90 rounded-lg flex items-center justify-center shadow-2xl transform rotate-6 border border-blue-200">
                <Sparkles className="w-10 h-10 text-blue-600 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-5xl font-black italic tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] leading-none">SUPER PRODUCER</span>
                <span className="text-blue-200 text-sm font-bold tracking-[0.2em] uppercase mt-1">Simulator XP Edition</span>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-28 p-6 flex flex-col gap-2 flex-shrink-0 z-10">
          <DesktopIcon icon={Monitor} label="我的电脑" onClick={() => updateState({ activeApp: 'MY_COMPUTER' })} />
          <DesktopIcon icon={FolderOpen} label="历史记录" onClick={() => updateState({ activeApp: 'DOCUMENTS' })} />
          <DesktopIcon icon={HelpCircle} label="开发手册" onClick={() => updateState({ activeApp: 'MANUAL' })} />
          <DesktopIcon icon={Terminal} label="内核终端" onClick={() => updateState({ activeApp: 'TERMINAL' })} />
          <div className="mt-auto">
            <DesktopIcon icon={Trash2} label="回收站" onClick={handleRestart} />
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
          
          <div className={`z-10 w-full max-w-6xl transition-all duration-500 ${gameState.activeApp !== 'NONE' ? 'blur-md scale-95 opacity-60' : 'opacity-100 scale-100'}`}>
            {gameState.stage === GameStage.HIRING && (
              <TeamSelection 
                currentMoney={gameState.money} 
                onUpdateMoney={(amount) => updateState({ money: amount })} 
                onHiringComplete={(team) => {
                  audio.playSuccess();
                  updateState({ 
                    team, 
                    stage: GameStage.SETUP, 
                    monthlyBurnRate: (team.designer?.salary || 0) + (team.programmer?.salary || 0) + (team.artist?.salary || 0) 
                  });
                }} 
              />
            )}
            {gameState.stage === GameStage.SETUP && (
              <GameSetup 
                currentTrend={gameState.currentTrend}
                onComplete={(config) => {
                  audio.playClick();
                  updateState({ config, stage: GameStage.ENGINEERING, logs: [...gameState.logs, "策划案初稿已确立，进入技术评审。"] });
                }} 
                onBack={() => updateState({ stage: GameStage.HIRING })}
              />
            )}
            {gameState.stage === GameStage.ENGINEERING && (
              <EngineeringSetup 
                gameState={gameState}
                onComplete={(engineering) => {
                  audio.playSuccess();
                  updateState({ 
                    engineering, 
                    money: gameState.money - engineering.upfrontCost,
                    stage: GameStage.DEVELOPMENT, 
                    logs: [...gameState.logs, `技术架构确立: ${engineering.engine}。扣除前期授权费用 ¥${engineering.upfrontCost.toLocaleString()}`] 
                  });
                }}
                onBack={() => updateState({ stage: GameStage.SETUP })}
              />
            )}
            {gameState.stage === GameStage.DEVELOPMENT && (
              <DevPhase 
                gameState={gameState} 
                onUpdateState={updateState} 
                onComplete={() => updateState({ stage: GameStage.RELEASE })} 
                onFail={(r) => updateState({ stage: GameStage.FAILED, failureReason: r })} 
              />
            )}
            {gameState.stage === GameStage.RELEASE && (
              <ReleaseView 
                gameState={gameState} 
                onUpdateState={updateState}
                onLaunch={() => updateState({ stage: GameStage.RESULTS })} 
              />
            )}
            {gameState.stage === GameStage.RESULTS && (
              <ResultsView gameState={gameState} onRestart={(profit) => {
                const historyEntry = { title: gameState.config.title, theme: gameState.config.theme, genre: gameState.config.genre, profit };
                updateState({ 
                  ...INITIAL_STATE, 
                  money: gameState.money + profit, 
                  history: [...gameState.history, historyEntry], 
                  stage: GameStage.HIRING 
                });
              }} />
            )}
            {gameState.stage === GameStage.FAILED && (
              <FailureView gameState={gameState} onRestart={() => window.location.reload()} />
            )}
          </div>

          {gameState.activeApp === 'MY_COMPUTER' && (
             <SystemStats gameState={gameState} onClose={closeWindow} />
          )}

          {gameState.activeApp === 'DOCUMENTS' && (
            <HistoryView history={gameState.history} onClose={closeWindow} />
          )}

          {gameState.activeApp === 'MANUAL' && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/30 p-4">
              <div className="xp-window w-full max-w-2xl animate-pop-in">
                <div className="xp-title-bar">
                  <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /><span>MANUAL.TXT - 记事本</span></div>
                  <div className="xp-title-btn xp-title-btn-close" onClick={closeWindow}><X className="w-4 h-4" /></div>
                </div>
                <div className="bg-white border-2 border-inset border-gray-400 p-8 h-[450px] overflow-y-auto font-mono text-sm shadow-inner text-black">
                  <h2 className="text-xl text-blue-800 border-b-2 border-blue-100 pb-2 mb-4 font-sans font-black uppercase">超级制作人入门指南</h2>
                  <div className="space-y-6 text-gray-800">
                    <section>
                      <h3 className="font-bold text-blue-700 mb-1">【第一步：组建核心】</h3>
                      <p>招募三名核心成员：策划、程序和美术。SSR级别的人才虽然昂贵，但能提升品质上限。</p>
                    </section>
                    <section>
                      <h3 className="font-bold text-blue-700 mb-1">【第二步：市场情报】</h3>
                      <p>留意侧边栏的市场流行趋势。匹配年度流行题材将获得巨额热度加成。</p>
                    </section>
                    <section>
                      <h3 className="font-bold text-blue-700 mb-1">【第三步：研发策略】</h3>
                      <p>研发周期内可开启“福报模式”。虽然能缩短周期，但会压榨士气并带来更多Bug。</p>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          )}

          {gameState.activeApp === 'TERMINAL' && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
              <div className="xp-window w-full max-w-md animate-pop-in border-green-600 shadow-[0_0_40px_rgba(0,255,0,0.2)]">
                <div className="xp-title-bar bg-black text-green-500 border-b border-green-900">
                  <div className="flex items-center gap-2 font-mono"><Terminal className="w-4 h-4" /><span>PRODUCER_SHELL_V1.0</span></div>
                  <div className="xp-title-btn xp-title-btn-close" onClick={closeWindow}><X className="w-4 h-4" /></div>
                </div>
                <div className="bg-black p-6 h-64 font-mono text-green-500 text-xs overflow-y-auto custom-terminal">
                   <div className="mb-1 text-green-300">Super Producer OS [Version 5.1.2600]</div>
                   <div className="mb-4 text-green-300">(C) Copyright 1985-2001 Microsoft Corp.</div>
                   <div>C:\PRODUCER> init_ai_core.exe</div>
                   <div className="text-white">[SYSTEM]: KERNEL_READY</div>
                   <div className="text-white">[SYSTEM]: API_CONNECTION_STABLE</div>
                   <div className="text-white">[SYSTEM]: RUNNING_GEMINI_PRO_CORES... OK</div>
                   <div className="mt-4 flex gap-2 items-center">
                      <span className="animate-pulse">{'>'}</span>
                      <span className="bg-green-500 text-black px-1 font-bold">Awaiting_Input_</span>
                   </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
      
      {/* Start Menu Popup */}
      {showStartMenu && (
        <div ref={startMenuRef} className="fixed bottom-10 left-0 w-72 bg-[#ECE9D8] border-2 border-[#0055EA] rounded-t-lg shadow-2xl z-[1000] overflow-hidden flex flex-col animate-pop-in">
           <div className="bg-gradient-to-r from-[#102558] to-[#245edc] p-3 flex items-center gap-3 border-b-2 border-orange-400">
              <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                 <Monitor className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-white font-black text-sm drop-shadow-md italic uppercase">Producer OS XP</div>
           </div>
           <div className="flex bg-white">
              <div className="flex-1 p-2 space-y-1">
                 {[
                    { icon: HelpCircle, label: '开发手册', action: () => updateState({ activeApp: 'MANUAL' }) },
                    { icon: Monitor, label: '系统属性', action: () => updateState({ activeApp: 'MY_COMPUTER' }) },
                    { icon: Terminal, label: '内核终端', action: () => updateState({ activeApp: 'TERMINAL' }) },
                    { icon: FolderOpen, label: '历史存档', action: () => updateState({ activeApp: 'DOCUMENTS' }) },
                 ].map((item, i) => (
                    <button key={i} onClick={() => { item.action(); setShowStartMenu(false); }} className="w-full flex items-center gap-3 p-2 hover:bg-[#316AC5] hover:text-white group text-xs font-bold transition-colors">
                       <item.icon className="w-4 h-4 text-blue-600 group-hover:text-white" />
                       {item.label}
                    </button>
                 ))}
              </div>
              <div className="w-24 bg-[#D3E5FA] border-l border-[#A6C8F0] p-2 space-y-2">
                 <div className="text-[10px] text-gray-400 font-black uppercase mb-2">常用</div>
                 <div className="flex flex-col gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400 m-auto" />
                    <Settings className="w-5 h-5 text-blue-400 m-auto" />
                 </div>
              </div>
           </div>
           <div className="bg-[#D3E5FA] p-2 flex justify-end gap-2 border-t border-[#A6C8F0]">
              <button onClick={handleRestart} className="flex items-center gap-1 text-[10px] font-black text-blue-900 hover:text-red-600">
                 <LogOut className="w-3 h-3" /> 注销(L)
              </button>
              <button onClick={handleRestart} className="flex items-center gap-1 text-[10px] font-black text-blue-900 hover:text-red-600">
                 <Trash2 className="w-3 h-3" /> 重启(R)
              </button>
           </div>
        </div>
      )}

      {/* Taskbar */}
      <footer className="h-10 xp-taskbar flex items-center justify-between px-0 z-50 border-t border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]">
         <div className="flex h-full items-center">
            <button 
               onClick={() => { audio.playClick(); setShowStartMenu(!showStartMenu); }}
               className={`flex items-center gap-2 px-4 h-full xp-start-btn rounded-r-2xl border-r-2 border-green-900 group active:brightness-90 transition-all ${showStartMenu ? 'brightness-75' : ''}`}
            >
               <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <Monitor className="w-4 h-4 text-blue-600" />
               </div>
               <span className="text-white font-black italic text-lg tracking-tighter drop-shadow-md">开始</span>
            </button>
            
            {/* Taskbar Active Item Indicators */}
            <div className="flex items-center h-full">
               {[
                  { id: 'MY_COMPUTER', label: '我的电脑', icon: Monitor },
                  { id: 'DOCUMENTS', label: '历史记录', icon: FolderOpen },
                  { id: 'MANUAL', label: '手册', icon: HelpCircle },
                  { id: 'TERMINAL', label: '终端', icon: Terminal },
               ].map((app) => (
                  gameState.activeApp === app.id && (
                     <div key={app.id} className="flex items-center gap-2 px-4 h-full bg-[#3c81f3] border-r border-white/20 text-white shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)] animate-pop-in">
                        <app.icon className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold">{app.label}</span>
                     </div>
                  )
               ))}
            </div>
         </div>
         
         <div className="flex-1 flex items-center px-4 h-full pointer-events-none">
            {/* Logo in center-ish of taskbar */}
            <div className="flex items-center gap-2 opacity-50">
               <Gamepad2 className="w-3.5 h-3.5 text-white" />
               <span className="text-white text-[9px] font-black italic uppercase tracking-tighter">SP XP EDITION</span>
            </div>
         </div>

         <div className="bg-[#0996f1] h-full flex items-center gap-4 px-5 border-l border-[#085db1] shadow-[inset_2px_0_4px_rgba(0,0,0,0.2)] text-white">
            <div className="flex gap-2 items-center">
               <Wallet className="w-4 h-4 text-blue-200" />
               <span className="text-[12px] font-black font-mono tracking-tight">¥{gameState.money.toLocaleString()}</span>
            </div>
            <div className="text-[11px] font-bold tracking-tight border-l border-blue-400 pl-4 h-full flex items-center font-mono">
               {formattedTime}
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;
