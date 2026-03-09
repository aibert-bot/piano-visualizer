import { useMemo } from 'react';

// Piano key dimensions
const WHITE_KEY_WIDTH = 40;
const WHITE_KEY_HEIGHT = 150;
const BLACK_KEY_WIDTH = 24;
const BLACK_KEY_HEIGHT = 95;

// Note mappings for 3 octaves (C3 to B5)
const OCTAVES = [2, 3, 4, 5];
const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_NOTES = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'];

// Black key offsets relative to white key position
const BLACK_KEY_OFFSETS = {
  'Db': 0, // After C
  'Eb': 1, // After D
  'Gb': 3, // After F
  'Ab': 4, // After G
  'Bb': 5, // After A
};

// Alternate note names (flats and sharps)
const NOTE_ALIASES = {
  'C#': 'Db', 'Db': 'Db',
  'D#': 'Eb', 'Eb': 'Eb',
  'F#': 'Gb', 'Gb': 'Gb',
  'G#': 'Ab', 'Ab': 'Ab',
  'A#': 'Bb', 'Bb': 'Bb',
};

// Normalize note name (handle sharps and flats)
const normalizeNote = (note) => {
  const noteName = note.slice(0, -1);
  const octave = note.slice(-1);

  if (NOTE_ALIASES[noteName]) {
    return NOTE_ALIASES[noteName] + octave;
  }
  return note;
};

const PianoKeyboard = ({
  highlightedNotes = [], // Array of { note, color, finger }
  startOctave = 2,
  endOctave = 5,
}) => {
  // Build the keyboard keys
  const { whiteKeys, blackKeys, totalWidth } = useMemo(() => {
    const whites = [];
    const blacks = [];
    let whiteKeyIndex = 0;

    for (let octave = startOctave; octave <= endOctave; octave++) {
      WHITE_NOTES.forEach((note, noteIndex) => {
        const noteName = `${note}${octave}`;
        const x = whiteKeyIndex * WHITE_KEY_WIDTH;

        whites.push({
          note: noteName,
          x,
          width: WHITE_KEY_WIDTH,
          height: WHITE_KEY_HEIGHT,
        });

        // Add black key if applicable
        const blackNote = Object.keys(BLACK_KEY_OFFSETS).find(
          bn => BLACK_KEY_OFFSETS[bn] === noteIndex && noteIndex !== 2 && noteIndex !== 6
        );

        if (blackNote && noteIndex < 6) {
          // Check if this position should have a black key
          if (noteIndex === 0 || noteIndex === 1 || noteIndex === 3 || noteIndex === 4 || noteIndex === 5) {
            const blackNoteName = `${blackNote}${octave}`;
            blacks.push({
              note: blackNoteName,
              x: x + WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2,
              width: BLACK_KEY_WIDTH,
              height: BLACK_KEY_HEIGHT,
            });
          }
        }

        whiteKeyIndex++;
      });
    }

    return {
      whiteKeys: whites,
      blackKeys: blacks,
      totalWidth: whiteKeyIndex * WHITE_KEY_WIDTH,
    };
  }, [startOctave, endOctave]);

  // Regenerate black keys properly
  const properBlackKeys = useMemo(() => {
    const blacks = [];
    let whiteKeyIndex = 0;

    for (let octave = startOctave; octave <= endOctave; octave++) {
      WHITE_NOTES.forEach((note, noteIndex) => {
        const x = whiteKeyIndex * WHITE_KEY_WIDTH;

        // Black keys come after C, D, F, G, A (not after E and B)
        if (noteIndex === 0) { // After C -> C#/Db
          blacks.push({
            note: `Db${octave}`,
            x: x + WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2,
          });
        } else if (noteIndex === 1) { // After D -> D#/Eb
          blacks.push({
            note: `Eb${octave}`,
            x: x + WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2,
          });
        } else if (noteIndex === 3) { // After F -> F#/Gb
          blacks.push({
            note: `Gb${octave}`,
            x: x + WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2,
          });
        } else if (noteIndex === 4) { // After G -> G#/Ab
          blacks.push({
            note: `Ab${octave}`,
            x: x + WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2,
          });
        } else if (noteIndex === 5) { // After A -> A#/Bb
          blacks.push({
            note: `Bb${octave}`,
            x: x + WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2,
          });
        }

        whiteKeyIndex++;
      });
    }

    return blacks;
  }, [startOctave, endOctave]);

  // Get highlight info for a note
  const getHighlight = (note) => {
    const normalizedNote = normalizeNote(note);
    return highlightedNotes.find(h => normalizeNote(h.note) === normalizedNote);
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <svg
        viewBox={`0 0 ${totalWidth} ${WHITE_KEY_HEIGHT + 30}`}
        className="w-full max-w-4xl mx-auto"
        style={{ minWidth: '600px' }}
      >
        {/* White keys */}
        {whiteKeys.map((key) => {
          const highlight = getHighlight(key.note);
          const isHighlighted = !!highlight;
          const fillColor = isHighlighted ? highlight.color : '#f8f8f8';
          const strokeColor = '#333';

          return (
            <g key={key.note}>
              <rect
                x={key.x}
                y={0}
                width={key.width - 2}
                height={key.height}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={1}
                rx={3}
                className="transition-all duration-150"
              />
              {/* Finger number for highlighted keys */}
              {isHighlighted && highlight.finger && (
                <text
                  x={key.x + key.width / 2 - 1}
                  y={key.height - 15}
                  textAnchor="middle"
                  className="text-lg font-bold fill-white"
                  style={{
                    fontSize: '16px',
                    fill: highlight.color === '#3b82f6' || highlight.color === '#f97316' ? '#fff' : '#000',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {highlight.finger}
                </text>
              )}
              {/* Note label at bottom */}
              <text
                x={key.x + key.width / 2 - 1}
                y={key.height + 20}
                textAnchor="middle"
                className="text-xs"
                style={{ fontSize: '10px', fill: '#666' }}
              >
                {key.note}
              </text>
            </g>
          );
        })}

        {/* Black keys */}
        {properBlackKeys.map((key) => {
          const highlight = getHighlight(key.note);
          const isHighlighted = !!highlight;
          const fillColor = isHighlighted ? highlight.color : '#222';

          return (
            <g key={key.note}>
              <rect
                x={key.x}
                y={0}
                width={BLACK_KEY_WIDTH}
                height={BLACK_KEY_HEIGHT}
                fill={fillColor}
                stroke="#111"
                strokeWidth={1}
                rx={2}
                className="transition-all duration-150"
              />
              {/* Finger number for highlighted keys */}
              {isHighlighted && highlight.finger && (
                <text
                  x={key.x + BLACK_KEY_WIDTH / 2}
                  y={BLACK_KEY_HEIGHT - 10}
                  textAnchor="middle"
                  className="text-sm font-bold"
                  style={{
                    fontSize: '14px',
                    fill: '#fff',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  }}
                >
                  {highlight.finger}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default PianoKeyboard;
