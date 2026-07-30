import { Menu, X } from 'lucide-react';

function HamburgerMenu({ isMenuOpen, setIsMenuOpen }) {
  return (
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 hover:border-cyan-400/50 text-slate-200 transition-all duration-300 cursor-pointer shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95"
    >
      {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
}

export default HamburgerMenu;
