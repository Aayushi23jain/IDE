import { Sparkles } from 'lucide-react';

function ProblemDrawer({ isMenuOpen, setIsMenuOpen, questions, selectedQuestion, handleQuestionSelect }) {
  if (!isMenuOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40" onClick={() => setIsMenuOpen(false)}>
      <div 
        className="bg-slate-900/60 backdrop-blur-xl w-80 h-full p-6 overflow-y-auto left-0 absolute rounded-none rounded-r-2xl border-r border-cyan-500/20 shadow-2xl shadow-cyan-500/10" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent flex items-center gap-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
            <Sparkles className="w-4 h-4 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
            Problem Explorer
          </h2>
        </div>
        
        <div className="flex flex-col gap-2">
          {questions.map((question) => (
            <button
              key={question.id}
              onClick={() => {
                handleQuestionSelect(question);
                setIsMenuOpen(false);
              }}
              className={`p-3.5 rounded-xl text-left transition-all duration-300 border cursor-pointer ${
                selectedQuestion?.id === question.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.02]'
                  : 'bg-slate-900/60 backdrop-blur-xl border-transparent hover:border-white/10 hover:bg-white/5 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-cyan-400">#{question.id}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  question.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/20' :
                  question.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/20' :
                  'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm shadow-rose-500/20'
                }`}>
                  {question.difficulty}
                </span>
              </div>
              <span className="text-sm font-medium text-slate-200 block truncate">{question.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProblemDrawer;
