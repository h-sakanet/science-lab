import { useState } from 'react';
import { ColorLesson } from './components/ColorLesson';
import { Beaker, ArrowRight, Eye } from 'lucide-react';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'color_lesson'>('home');

  if (currentScreen === 'color_lesson') {
    return <ColorLesson onBack={() => setCurrentScreen('home')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Beaker className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Science Lab</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Card: Color Lesson */}
          <button
            onClick={() => setCurrentScreen('color_lesson')}
            className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all text-left"
          >
            <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 mb-4 shadow-lg shadow-orange-100 flex items-center justify-center text-white">
              <Eye className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2">色の見え方</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              光の反射と吸収、色のフィルター効果について学びます。
            </p>
          </button>

          {/* Placeholder Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center opacity-60">
            <span className="text-sm font-medium text-slate-400">Coming Soon</span>
            <p className="text-xs text-slate-400 mt-1">新しい実験を準備中...</p>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
