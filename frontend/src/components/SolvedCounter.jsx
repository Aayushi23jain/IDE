import { Trophy } from 'lucide-react';

function SolvedCounter({ problemsSolved }) {
  return (
    <div className="px-5 py-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center gap-3 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105">
      <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
      <div className="flex flex-col">
        <span className="text-xs text-amber-300/70 font-medium">Problems Solved</span>
        <span className="text-lg font-bold text-amber-400">{problemsSolved}</span>
      </div>
    </div>
  );
}

export default SolvedCounter;
