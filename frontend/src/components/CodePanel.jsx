import { Code2, Play, RefreshCw, Terminal } from 'lucide-react';
import CodeEditor from './CodeEditor';
import { useState } from 'react';

function CodePanel({ code, setCode, isRunning, handleRunCode, handleResetCode }) {
  const [customInput, setCustomInput] = useState('');
  const [showInputTerminal, setShowInputTerminal] = useState(false);

  const handleRunButtonClick = () => {
    if (showInputTerminal && customInput.trim()) {
      handleRunCode(customInput);
    } else {
      handleRunCode(null);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl p-4 border border-cyan-500/30 shadow-[0_0_25px_rgba(34,211,238,0.12)] h-full flex flex-col overflow-hidden shadow-2xl shadow-cyan-500/10">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full"></div>
            <Code2 className="w-5 h-5 text-cyan-400 relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">Main.cpp</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInputTerminal(!showInputTerminal)}
            disabled={isRunning}
            className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 border border-white/10 active:scale-95 disabled:opacity-50 flex items-center gap-1.5 text-xs shadow-lg hover:shadow-cyan-500/20 hover:scale-105"
          >
            <Terminal className="w-3.5 h-3.5" />
            {showInputTerminal ? 'Hide Input' : 'Custom Input'}
          </button>
          
          <button
            onClick={handleResetCode}
            disabled={isRunning}
            className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 border border-white/10 active:scale-95 disabled:opacity-50 flex items-center gap-1.5 text-xs shadow-lg hover:shadow-cyan-500/20 hover:scale-105"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
          
          <button
            onClick={handleRunButtonClick}
            disabled={isRunning}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Code
              </>
            )}
          </button>
        </div>
      </div>

      {showInputTerminal && (
        <div className="mb-3 p-3 bg-black/40 rounded-lg border border-white/10 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Custom Input</span>
          </div>
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter your custom input here (e.g., 5 10 15)"
            className="w-full bg-slate-800/50 text-gray-200 text-xs font-mono p-2 rounded border border-white/10 focus:border-cyan-500/50 focus:outline-none resize-none h-16 placeholder-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            This input will be provided to your program via stdin
          </p>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-hidden">
        <CodeEditor code={code} setCode={setCode} />
      </div>
    </div>
  );
}

export default CodePanel;
