import { useState, useEffect, useCallback } from 'react';
import PianoKeyboard from './PianoKeyboard';
import { chorusMelody } from '../data/melody';
import { chords } from '../data/chords';

const RH_COLOR = '#f97316'; // Orange for right hand
const LH_COLOR = '#3b82f6'; // Blue for left hand

const MelodyPlayer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showChordNotes, setShowChordNotes] = useState(true);

  const currentNote = chorusMelody[currentIndex];
  const currentChord = chords[currentNote.chord];

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      setCurrentIndex((prev) => Math.min(prev + 1, chorusMelody.length - 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setCurrentIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setCurrentIndex(chorusMelody.length - 1);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Get highlighted notes (melody note + optional chord notes)
  const getHighlightedNotes = () => {
    const notes = [];

    // Add melody note (RH)
    notes.push({
      note: currentNote.note,
      color: RH_COLOR,
      finger: currentNote.finger,
    });

    // Add chord notes (LH) if enabled
    if (showChordNotes && currentChord) {
      currentChord.notes.forEach((note, idx) => {
        notes.push({
          note,
          color: LH_COLOR,
          finger: currentChord.fingers[idx],
        });
      });
    }

    return notes;
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, chorusMelody.length - 1));
  };

  const goToStart = () => {
    setCurrentIndex(0);
  };

  // Group lyrics by chord for display
  const getLyricSegments = () => {
    const segments = [];
    let currentSegment = { chord: chorusMelody[0].chord, lyrics: [] };

    chorusMelody.forEach((item, idx) => {
      if (item.chord !== currentSegment.chord) {
        segments.push(currentSegment);
        currentSegment = { chord: item.chord, lyrics: [] };
      }
      currentSegment.lyrics.push({ lyric: item.lyric, index: idx });
    });
    segments.push(currentSegment);

    return segments;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Melody Player</h2>
        <p className="text-gray-400">错位时空 - Chorus</p>
      </div>

      {/* Lyrics Display */}
      <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap justify-center items-center gap-1 text-2xl">
          {chorusMelody.map((item, idx) => (
            <span
              key={idx}
              className={`px-1 py-0.5 rounded transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'bg-piano-orange text-white scale-125 font-bold'
                  : idx < currentIndex
                  ? 'text-gray-500'
                  : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              {item.lyric}
            </span>
          ))}
        </div>
      </div>

      {/* Current Note Info */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="bg-gray-800/50 rounded-xl px-6 py-3 text-center">
          <div className="text-gray-400 text-sm mb-1">Note</div>
          <div className="text-2xl font-bold text-piano-orange">
            {currentNote.note}
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl px-6 py-3 text-center">
          <div className="text-gray-400 text-sm mb-1">Finger</div>
          <div className="text-2xl font-bold text-piano-orange">
            {currentNote.finger}
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl px-6 py-3 text-center">
          <div className="text-gray-400 text-sm mb-1">Chord</div>
          <div className="text-2xl font-bold text-piano-blue">
            {chords[currentNote.chord]?.name || currentNote.chord}
          </div>
        </div>
      </div>

      {/* Piano Keyboard */}
      <div className="bg-gray-800/50 rounded-2xl p-4 mb-6">
        <PianoKeyboard highlightedNotes={getHighlightedNotes()} />
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <button
          onClick={goToStart}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all"
          title="Go to start (Home)"
        >
          ⏮
        </button>
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
          title="Previous (←)"
        >
          ← Prev
        </button>
        <div className="px-4 py-2 bg-gray-800 rounded-lg text-gray-400">
          {currentIndex + 1} / {chorusMelody.length}
        </div>
        <button
          onClick={goToNext}
          disabled={currentIndex === chorusMelody.length - 1}
          className="px-6 py-3 bg-piano-orange text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
          title="Next (→ or Space)"
        >
          Next →
        </button>
      </div>

      {/* Options */}
      <div className="flex justify-center mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showChordNotes}
            onChange={(e) => setShowChordNotes(e.target.checked)}
            className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-piano-blue focus:ring-piano-blue"
          />
          <span className="text-gray-300">Show chord (LH) notes</span>
        </label>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="text-center text-gray-500 text-sm">
        <p>Keyboard shortcuts: ← → (navigate) | Space (next) | Home/End (jump)</p>
      </div>

      {/* Color Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-piano-orange"></div>
          <span className="text-gray-400 text-sm">Right Hand (Melody)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-piano-blue"></div>
          <span className="text-gray-400 text-sm">Left Hand (Chord)</span>
        </div>
      </div>
    </div>
  );
};

export default MelodyPlayer;
