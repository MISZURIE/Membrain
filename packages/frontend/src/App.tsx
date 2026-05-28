import { useState } from 'react';
import ChatPage from './pages/ChatPage';
import MemoryDashboard from './pages/MemoryDashboard';
import CheckpointPage from './pages/CheckpointPage';

type Page = 'chat' | 'dashboard' | 'checkpoint';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('chat');

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'dashboard', label: 'Memory', icon: '🧠' },
    { id: 'checkpoint', label: 'Checkpoint', icon: '🗑️' },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-gray-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            🧠 MemBrain
          </h1>
          <p className="text-[11px] text-gray-600 mt-1">Remember Less, Know More</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                currentPage === item.id
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Token Budget Mini */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Token Budget</span>
            <span>0%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: '0%' }} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {currentPage === 'chat' && <ChatPage />}
        {currentPage === 'dashboard' && <MemoryDashboard />}
        {currentPage === 'checkpoint' && <CheckpointPage />}
      </main>
    </div>
  );
}

export default App;
