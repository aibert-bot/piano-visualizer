import { useState, useEffect, useRef, useCallback } from 'react';
import PianoKeyboard from './PianoKeyboard';
import { chords, chordList, getLHPattern } from '../data/chords';
import { parseChord, getRoots, getQualities, getChordSuggestions } from '../utils/chordParser';

const LH_COLOR = '#3b82f6'; // Blue for left hand

const LEVEL_DESCRIPTIONS = {
  1: 'Block chord (whole note)',
  2: 'Block chord (beats 1 & 3)',
  3: 'Root → 5th → Octave',
  4: 'Root → 3rd → 5th → Octave',
  5: 'Octave bass + Arpeggio',
};

const STORAGE_KEY = 'piano-visualizer-saved-chords';

const ChordExplorer = () => {
  const [selectedChord, setSelectedChord] = useState('Cm');
  const [level, setLevel] = useState(1);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);

  // Universal Chord Input state
  const [chordInput, setChordInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [builderRoot, setBuilderRoot] = useState('C');
  const [builderQuality, setBuilderQuality] = useState('');
  const [savedChords, setSavedChords] = useState([]);
  const [activeChord, setActiveChord] = useState(null); // Parsed chord object
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Load saved chords from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSavedChords(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load saved chords:', e);
    }
  }, []);

  // Save chords to localStorage
  const saveToLocalStorage = useCallback((chords) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chords));
    } catch (e) {
      console.error('Failed to save chords:', e);
    }
  }, []);

  // Get the current chord object (either from presets or parsed)
  const getCurrentChord = useCallback(() => {
    if (activeChord) {
      return activeChord;
    }
    return chords[selectedChord];
  }, [activeChord, selectedChord]);

  // Get pattern for current chord and level
  const getPattern = useCallback(() => {
    const chord = getCurrentChord();
    if (!chord) return [{ notes: [], fingers: [], beat: 1 }];

    // For parsed chords, we need to generate the pattern manually
    if (chord.parsed) {
      return generatePattern(chord, level);
    }

    // For preset chords, use getLHPattern
    return getLHPattern(selectedChord, level);
  }, [getCurrentChord, selectedChord, level]);

  // Generate pattern for parsed chords (compatible with getLHPattern output)
  const generatePattern = (chord, lvl) => {
    const { notes, fingers } = chord;
    const root = notes[0];
    const rootOctave = parseInt(root.slice(-1));
    const rootNote = root.slice(0, -1);
    const octaveNote = `${rootNote}${rootOctave + 1}`;

    switch (lvl) {
      case 1:
        return [{ notes, fingers, beat: 1 }];
      case 2:
        return [
          { notes, fingers, beat: 1 },
          { notes, fingers, beat: 3 },
        ];
      case 3:
        // Root → 5th → Octave
        return [
          { notes: [notes[0]], fingers: [fingers[0]], beat: 1 },
          { notes: [notes[notes.length - 1]], fingers: [fingers[fingers.length - 1]], beat: 2 },
          { notes: [octaveNote], fingers: [1], beat: 3 },
        ];
      case 4:
        // Root → 3rd → 5th → Octave
        if (notes.length >= 3) {
          return [
            { notes: [notes[0]], fingers: [fingers[0]], beat: 1 },
            { notes: [notes[1]], fingers: [fingers[1]], beat: 2 },
            { notes: [notes[2]], fingers: [fingers[2]], beat: 3 },
            { notes: [octaveNote], fingers: [1], beat: 4 },
          ];
        }
        return [
          { notes: [notes[0]], fingers: [fingers[0]], beat: 1 },
          { notes: [notes[notes.length - 1]], fingers: [fingers[fingers.length - 1]], beat: 2 },
          { notes: [octaveNote], fingers: [1], beat: 3 },
          { notes, fingers, beat: 4 },
        ];
      case 5:
        // Octave bass + Arpeggio fill
        if (notes.length >= 3) {
          return [
            { notes: [octaveNote], fingers: [1], beat: 1 },
            { notes: [notes[1]], fingers: [fingers[1]], beat: 2 },
            { notes: [notes[2]], fingers: [fingers[2]], beat: 3 },
            { notes: [notes[1]], fingers: [fingers[1]], beat: 4 },
          ];
        }
        return [
          { notes: [octaveNote], fingers: [1], beat: 1 },
          { notes, fingers, beat: 2 },
          { notes: [notes[0]], fingers: [fingers[0]], beat: 3 },
          { notes, fingers, beat: 4 },
        ];
      default:
        return [{ notes, fingers, beat: 1 }];
    }
  };

  const pattern = getPattern();
  const chord = getCurrentChord();

  // Get highlighted notes based on current beat
  const getHighlightedNotes = () => {
    if (!chord) return [];

    if (level === 1) {
      // For L1, always show all notes
      return chord.notes.map((note, idx) => ({
        note,
        color: LH_COLOR,
        finger: chord.fingers[idx],
      }));
    }

    if (!isAnimating) {
      // Show first beat when not animating
      const firstBeat = pattern[0];
      return firstBeat.notes.map((note, idx) => ({
        note,
        color: LH_COLOR,
        finger: firstBeat.fingers[idx],
      }));
    }

    // Show current beat in animation
    const currentPattern = pattern[currentBeat % pattern.length];
    return currentPattern.notes.map((note, idx) => ({
      note,
      color: LH_COLOR,
      finger: currentPattern.fingers[idx],
    }));
  };

  // Handle chord input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setChordInput(value);

    if (value.trim()) {
      const newSuggestions = getChordSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);

      // Try to parse and preview the chord in real-time
      const parsed = parseChord(value);
      if (parsed) {
        setActiveChord(parsed);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveChord(null);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setChordInput(suggestion);
    const parsed = parseChord(suggestion);
    if (parsed) {
      setActiveChord(parsed);
    }
    setShowSuggestions(false);
  };

  // Handle input submit (Enter key)
  const handleInputSubmit = (e) => {
    if (e.key === 'Enter') {
      const parsed = parseChord(chordInput);
      if (parsed) {
        setActiveChord(parsed);
        setShowSuggestions(false);
      }
    }
  };

  // Handle chord builder change
  const handleBuilderChange = (root, quality) => {
    setBuilderRoot(root);
    setBuilderQuality(quality);
    const chordName = root + quality;
    const parsed = parseChord(chordName);
    if (parsed) {
      setActiveChord(parsed);
      setChordInput(chordName);
    }
  };

  // Select a preset chord
  const handlePresetSelect = (chordKey) => {
    setSelectedChord(chordKey);
    setActiveChord(null);
    setChordInput('');
  };

  // Save current chord to My Chords
  const saveCurrentChord = () => {
    if (!activeChord) return;

    const chordToSave = {
      name: activeChord.name,
      notes: activeChord.notes,
      fingers: activeChord.fingers,
    };

    // Check if already saved
    const exists = savedChords.some(
      (c) => c.name === chordToSave.name && c.notes.join(',') === chordToSave.notes.join(',')
    );

    if (!exists) {
      const newSaved = [...savedChords, chordToSave];
      setSavedChords(newSaved);
      saveToLocalStorage(newSaved);
    }
  };

  // Load a saved chord
  const loadSavedChord = (savedChord) => {
    setActiveChord({
      ...savedChord,
      parsed: true,
      root: savedChord.name.match(/^[A-G][#b]?/)?.[0] || 'C',
      quality: savedChord.name.replace(/^[A-G][#b]?/, '') || 'major',
    });
    setChordInput(savedChord.name);
  };

  // Delete a saved chord
  const deleteSavedChord = (index) => {
    const newSaved = savedChords.filter((_, i) => i !== index);
    setSavedChords(newSaved);
    saveToLocalStorage(newSaved);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animation loop for levels 2-5
  useEffect(() => {
    if (level === 1 || !isAnimating) {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const beatDuration = 500; // ms per beat
    animationRef.current = setInterval(() => {
      setCurrentBeat((prev) => (prev + 1) % pattern.length);
    }, beatDuration);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [level, isAnimating, pattern.length]);

  // Reset animation when chord or level changes
  useEffect(() => {
    setCurrentBeat(0);
    setIsAnimating(false);
  }, [selectedChord, activeChord, level]);

  const toggleAnimation = () => {
    if (level === 1) return;
    setIsAnimating(!isAnimating);
    if (!isAnimating) {
      setCurrentBeat(0);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Chord Explorer</h2>
        <p className="text-gray-400">Type any chord or use the builder below</p>
      </div>

      {/* Universal Chord Input */}
      <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Text Input with Autocomplete */}
          <div className="relative">
            <label className="block text-gray-400 text-sm mb-2">Chord Input</label>
            <input
              ref={inputRef}
              type="text"
              value={chordInput}
              onChange={handleInputChange}
              onKeyDown={handleInputSubmit}
              onFocus={() => chordInput && setSuggestions(getChordSuggestions(chordInput))}
              placeholder="Type any chord..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-piano-blue focus:ring-1 focus:ring-piano-blue transition-all"
            />
            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg overflow-hidden"
              >
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chord Builder */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Chord Builder</label>
            <div className="flex gap-2">
              <select
                value={builderRoot}
                onChange={(e) => handleBuilderChange(e.target.value, builderQuality)}
                className="flex-1 px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-piano-blue transition-all cursor-pointer"
              >
                {getRoots().map((root) => (
                  <option key={root} value={root}>
                    {root}
                  </option>
                ))}
              </select>
              <select
                value={builderQuality}
                onChange={(e) => handleBuilderChange(builderRoot, e.target.value)}
                className="flex-[2] px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-piano-blue transition-all cursor-pointer"
              >
                {getQualities().map((q) => (
                  <option key={q.value} value={q.value}>
                    {q.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {activeChord && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={saveCurrentChord}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <span>Save to My Chords</span>
              <span className="text-piano-blue font-semibold">{activeChord.name}</span>
            </button>
          </div>
        )}
      </div>

      {/* My Saved Chords */}
      {savedChords.length > 0 && (
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">My Chords</h3>
          <div className="flex flex-wrap gap-2">
            {savedChords.map((saved, idx) => (
              <div key={idx} className="group relative">
                <button
                  onClick={() => loadSavedChord(saved)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeChord?.name === saved.name
                      ? 'bg-piano-blue text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {saved.name}
                </button>
                <button
                  onClick={() => deleteSavedChord(idx)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 错位时空 Presets */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3">错位时空 Presets</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {chordList.map((chordKey) => (
            <button
              key={chordKey}
              onClick={() => handlePresetSelect(chordKey)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedChord === chordKey && !activeChord
                  ? 'bg-piano-blue text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {chords[chordKey].name}
            </button>
          ))}
        </div>
      </div>

      {/* Level Selection */}
      <div className="mb-6">
        <div className="flex justify-center gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`w-12 h-12 rounded-lg font-bold transition-all ${
                level === l
                  ? 'bg-piano-blue text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              L{l}
            </button>
          ))}
        </div>
        <p className="text-center text-gray-400 text-sm">
          {LEVEL_DESCRIPTIONS[level]}
        </p>
      </div>

      {/* Piano Keyboard */}
      <div className="bg-gray-800/50 rounded-2xl p-4 mb-6">
        <PianoKeyboard highlightedNotes={getHighlightedNotes()} />
      </div>

      {/* Animation Controls (for levels 2-5) */}
      {level > 1 && (
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={toggleAnimation}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isAnimating
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isAnimating ? 'Stop' : 'Play Pattern'}
          </button>
        </div>
      )}

      {/* Pattern Visualization */}
      <div className="bg-gray-800/30 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Pattern Sequence:</h3>
        <div className="flex flex-wrap gap-2">
          {pattern.map((beat, idx) => (
            <div
              key={idx}
              className={`px-3 py-2 rounded-lg transition-all ${
                isAnimating && currentBeat === idx
                  ? 'bg-piano-blue text-white scale-110'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              <div className="text-xs text-gray-400 mb-1">Beat {beat.beat}</div>
              <div className="font-mono text-sm">
                {beat.notes.join(' + ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chord Info */}
      {chord && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg">
            <span className="text-gray-400">Current Chord:</span>
            <span className="text-xl font-bold text-piano-blue">{chord.name}</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400 font-mono text-sm">
              {chord.notes.join(' - ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChordExplorer;
