import { useState, useEffect, useRef } from 'react';
import PianoKeyboard from './PianoKeyboard';
import { chords, chordList, getLHPattern } from '../data/chords';

const LH_COLOR = '#3b82f6'; // Blue for left hand

const LEVEL_DESCRIPTIONS = {
  1: 'Block chord (whole note)',
  2: 'Block chord (beats 1 & 3)',
  3: 'Root → 5th → Octave',
  4: 'Root → 3rd → 5th → Octave',
  5: 'Octave bass + Arpeggio',
};

const ChordExplorer = () => {
  const [selectedChord, setSelectedChord] = useState('Cm');
  const [level, setLevel] = useState(1);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);

  const pattern = getLHPattern(selectedChord, level);
  const chord = chords[selectedChord];

  // Get highlighted notes based on current beat
  const getHighlightedNotes = () => {
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
  }, [selectedChord, level]);

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
        <p className="text-gray-400">Select a chord and practice level</p>
      </div>

      {/* Chord Selection */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {chordList.map((chordKey) => (
          <button
            key={chordKey}
            onClick={() => setSelectedChord(chordKey)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedChord === chordKey
                ? 'bg-piano-blue text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {chords[chordKey].name}
          </button>
        ))}
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
    </div>
  );
};

export default ChordExplorer;
