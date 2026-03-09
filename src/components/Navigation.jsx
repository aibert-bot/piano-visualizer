const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'chords', label: 'Chord Explorer', icon: '🎹' },
    { id: 'melody', label: 'Melody Player', icon: '🎵' },
  ];

  return (
    <nav className="w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎹</span>
            <span className="text-white font-bold text-lg hidden sm:block">
              Piano Visualizer
            </span>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-piano-blue text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="hidden sm:inline">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
