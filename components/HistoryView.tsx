
import React from 'react';
import { X, FolderOpen, FileText, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface HistoryEntry {
  title: string;
  theme: string;
  genre: string;
  profit: number;
}

interface Props {
  history: HistoryEntry[];
  onClose: () => void;
}

const HistoryView: React.FC<Props> = ({ history, onClose }) => {
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/20 p-4">
      <div className="xp-window w-full max-w-2xl animate-pop-in">
        <div className="xp-title-bar">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            <span>我的文档 - 项目历史存档</span>
          </div>
          <X className="w-4 h-4 cursor-pointer" onClick={onClose} />
        </div>
        
        <div className="bg-white border-2 border-inset border-gray-400 flex flex-col h-[400px]">
          <div className="bg-[#F1F1F1] border-b border-gray-300 p-2 flex items-center gap-4">
            <div className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" /> 修改日期: 2024年10月27日
            </div>
            <div className="text-[10px] text-gray-500 font-bold">大小: {history.length} 个项目</div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <FileText className="w-12 h-12 opacity-20" />
                <div className="text-xs italic uppercase">没有找到项目存档</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {history.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-colors group">
                    <div className="w-10 h-10 bg-[#FFF] border border-gray-200 flex items-center justify-center rounded shadow-sm group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-blue-900 truncate">《{entry.title}》</div>
                      <div className="text-[9px] text-gray-500">{entry.genre} | {entry.theme}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-black flex items-center justify-end gap-1 ${entry.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {entry.profit >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        ¥{Math.abs(entry.profit).toLocaleString()}
                      </div>
                      <div className="text-[8px] text-gray-400 font-bold uppercase">最终收益</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#ECE9D8] p-3 flex justify-end">
           <button className="xp-btn px-6 font-bold" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
