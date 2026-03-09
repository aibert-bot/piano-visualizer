import { useState } from 'react';
import Navigation from './components/Navigation';
import ChordExplorer from './components/ChordExplorer';
import MelodyPlayer from './components/MelodyPlayer';

function App() {
  const [activeTab, setActiveTab] = useState('chords');

  return (
    <div className="min-h-screen bg-piano-bg">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="py-8">
        {activeTab === 'chords' && <ChordExplorer />}
        {activeTab === 'melody' && <MelodyPlayer />}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-600 text-sm">
        <p>错位时空 (Cuo Wei Shi Kong) by 艾辰 (Ai Chen)</p>
      </footer>
    </div>
  );
}

export default App;
