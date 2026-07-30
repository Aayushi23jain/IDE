import { Code2, Sparkles } from 'lucide-react';

function Header() {
  return (
    <header className="flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
          <Code2 className="w-10 h-10 text-cyan-400 relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
          <Sparkles className="w-5 h-5 text-purple-400 absolute -top-1 -right-1 animate-pulse drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">Code Quest</h1>
         </div>
      </div>
    </header>
  );
}

export default Header;
