/**
 * Universal Chord Parser
 * Parses chord names like "Am", "F#m7", "Bb", "Dmaj7", "Gsus4", "Cdim", "Eaug"
 * Returns chord object compatible with getLHPattern() and PianoKeyboard
 */

// All 12 chromatic notes with enharmonic mappings
const NOTE_MAP = {
  'C': 0, 'C#': 1, 'Db': 1,
  'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'Fb': 4, 'E#': 5,
  'F': 5, 'F#': 6, 'Gb': 6,
  'G': 7, 'G#': 8, 'Ab': 8,
  'A': 9, 'A#': 10, 'Bb': 10,
  'B': 11, 'Cb': 11, 'B#': 0
};

// Canonical note names (using flats for consistency with existing chords.js)
const CANONICAL_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Display names (using sharps for some, flats for others - common convention)
const DISPLAY_ROOTS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

// Chord quality definitions: intervals from root (in semitones)
const CHORD_QUALITIES = {
  // Major variants
  '': { intervals: [0, 4, 7], name: '', display: '' },
  'maj': { intervals: [0, 4, 7], name: '', display: '' },
  'M': { intervals: [0, 4, 7], name: '', display: '' },
  'maj7': { intervals: [0, 4, 7, 11], name: 'maj7', display: 'maj7' },
  'M7': { intervals: [0, 4, 7, 11], name: 'maj7', display: 'maj7' },
  '7': { intervals: [0, 4, 7, 10], name: '7', display: '7' },
  'dom7': { intervals: [0, 4, 7, 10], name: '7', display: '7' },
  'add9': { intervals: [0, 4, 7, 14], name: 'add9', display: 'add9' },

  // Minor variants
  'm': { intervals: [0, 3, 7], name: 'm', display: 'm' },
  'min': { intervals: [0, 3, 7], name: 'm', display: 'm' },
  '-': { intervals: [0, 3, 7], name: 'm', display: 'm' },
  'm7': { intervals: [0, 3, 7, 10], name: 'm7', display: 'm7' },
  'min7': { intervals: [0, 3, 7, 10], name: 'm7', display: 'm7' },
  '-7': { intervals: [0, 3, 7, 10], name: 'm7', display: 'm7' },
  'mM7': { intervals: [0, 3, 7, 11], name: 'mM7', display: 'mM7' },
  'minmaj7': { intervals: [0, 3, 7, 11], name: 'mM7', display: 'mM7' },

  // Suspended
  'sus4': { intervals: [0, 5, 7], name: 'sus4', display: 'sus4' },
  'sus': { intervals: [0, 5, 7], name: 'sus4', display: 'sus4' },
  'sus2': { intervals: [0, 2, 7], name: 'sus2', display: 'sus2' },
  '7sus4': { intervals: [0, 5, 7, 10], name: '7sus4', display: '7sus4' },

  // Diminished
  'dim': { intervals: [0, 3, 6], name: 'dim', display: 'dim' },
  'o': { intervals: [0, 3, 6], name: 'dim', display: '°' },
  '°': { intervals: [0, 3, 6], name: 'dim', display: '°' },
  'dim7': { intervals: [0, 3, 6, 9], name: 'dim7', display: 'dim7' },
  'o7': { intervals: [0, 3, 6, 9], name: 'dim7', display: '°7' },

  // Augmented
  'aug': { intervals: [0, 4, 8], name: 'aug', display: 'aug' },
  '+': { intervals: [0, 4, 8], name: 'aug', display: '+' },
  'aug7': { intervals: [0, 4, 8, 10], name: 'aug7', display: 'aug7' },
  '+7': { intervals: [0, 4, 8, 10], name: 'aug7', display: '+7' },

  // Extended
  '6': { intervals: [0, 4, 7, 9], name: '6', display: '6' },
  'm6': { intervals: [0, 3, 7, 9], name: 'm6', display: 'm6' },
  '9': { intervals: [0, 4, 7, 10, 14], name: '9', display: '9' },
  'm9': { intervals: [0, 3, 7, 10, 14], name: 'm9', display: 'm9' },
  'maj9': { intervals: [0, 4, 7, 11, 14], name: 'maj9', display: 'maj9' },
};

// Default LH fingering patterns based on chord size
const FINGERING_PATTERNS = {
  3: [5, 3, 1],        // Triads: pinky, middle, thumb
  4: [5, 3, 2, 1],     // 7th chords: pinky, middle, index, thumb
  5: [5, 4, 3, 2, 1],  // 9th chords: all fingers
};

// Base octave for LH chords
const LH_BASE_OCTAVE = 3;

/**
 * Convert semitone number to note name at given octave
 */
function semitoneToNote(semitone, baseOctave = LH_BASE_OCTAVE) {
  const normalizedSemitone = ((semitone % 12) + 12) % 12;
  const octaveOffset = Math.floor(semitone / 12);
  const octave = baseOctave + octaveOffset;
  return `${CANONICAL_NOTES[normalizedSemitone]}${octave}`;
}

/**
 * Parse root note from chord string
 * Returns { root: 'C#', rootIndex: 1, remaining: 'm7' }
 */
function parseRoot(chordStr) {
  const str = chordStr.trim();
  if (!str) return null;

  // Check for two-character root (with accidental)
  if (str.length >= 2) {
    const twoChar = str.substring(0, 2);
    if (NOTE_MAP[twoChar] !== undefined) {
      return {
        root: twoChar,
        rootIndex: NOTE_MAP[twoChar],
        remaining: str.substring(2)
      };
    }
  }

  // Check for single character root
  const oneChar = str.substring(0, 1).toUpperCase();
  if (NOTE_MAP[oneChar] !== undefined) {
    // Check if second char is an accidental
    if (str.length >= 2) {
      const secondChar = str[1];
      if (secondChar === '#' || secondChar === 'b') {
        const withAccidental = oneChar + secondChar;
        if (NOTE_MAP[withAccidental] !== undefined) {
          return {
            root: withAccidental,
            rootIndex: NOTE_MAP[withAccidental],
            remaining: str.substring(2)
          };
        }
      }
    }
    return {
      root: oneChar,
      rootIndex: NOTE_MAP[oneChar],
      remaining: str.substring(1)
    };
  }

  return null;
}

/**
 * Parse quality from remaining string after root
 */
function parseQuality(qualityStr) {
  const str = qualityStr.trim();

  // Try exact match first
  if (CHORD_QUALITIES[str] !== undefined) {
    return CHORD_QUALITIES[str];
  }

  // Try case-insensitive match
  const lowerStr = str.toLowerCase();
  for (const [key, value] of Object.entries(CHORD_QUALITIES)) {
    if (key.toLowerCase() === lowerStr) {
      return value;
    }
  }

  // Default to major if empty or unrecognized
  return CHORD_QUALITIES[''];
}

/**
 * Main chord parser function
 * @param {string} chordStr - Chord name like "Am", "F#m7", "Bbmaj7"
 * @returns {object|null} - Chord object compatible with getLHPattern
 */
export function parseChord(chordStr) {
  if (!chordStr || typeof chordStr !== 'string') return null;

  const parsed = parseRoot(chordStr);
  if (!parsed) return null;

  const quality = parseQuality(parsed.remaining);
  const intervals = quality.intervals;

  // Generate notes in LH range
  const notes = intervals.map(interval => {
    const semitone = parsed.rootIndex + interval;
    return semitoneToNote(semitone, LH_BASE_OCTAVE);
  });

  // Get appropriate fingering
  const noteCount = notes.length;
  const fingers = FINGERING_PATTERNS[noteCount] ||
    Array.from({ length: noteCount }, (_, i) => Math.min(5, noteCount - i));

  // Build display name
  const displayRoot = DISPLAY_ROOTS[parsed.rootIndex];
  const displayName = displayRoot + quality.display;

  return {
    name: displayName,
    notes,
    fingers,
    root: displayRoot,
    quality: quality.name || 'major',
    parsed: true // Flag to identify parsed chords
  };
}

/**
 * Get all available root notes
 */
export function getRoots() {
  return DISPLAY_ROOTS;
}

/**
 * Get all available chord qualities
 */
export function getQualities() {
  return [
    { value: '', label: 'Major', display: '' },
    { value: 'm', label: 'Minor', display: 'm' },
    { value: '7', label: '7th', display: '7' },
    { value: 'maj7', label: 'Major 7th', display: 'maj7' },
    { value: 'm7', label: 'Minor 7th', display: 'm7' },
    { value: 'dim', label: 'Diminished', display: 'dim' },
    { value: 'aug', label: 'Augmented', display: 'aug' },
    { value: 'sus2', label: 'Suspended 2nd', display: 'sus2' },
    { value: 'sus4', label: 'Suspended 4th', display: 'sus4' },
    { value: 'add9', label: 'Add 9', display: 'add9' },
    { value: '6', label: '6th', display: '6' },
    { value: 'm6', label: 'Minor 6th', display: 'm6' },
    { value: 'dim7', label: 'Diminished 7th', display: 'dim7' },
    { value: 'aug7', label: 'Augmented 7th', display: 'aug7' },
    { value: '9', label: '9th', display: '9' },
  ];
}

/**
 * Generate chord suggestions for autocomplete
 * @param {string} input - Partial chord input
 * @returns {string[]} - Array of chord suggestions
 */
export function getChordSuggestions(input) {
  if (!input || input.length === 0) return [];

  const suggestions = [];
  const inputUpper = input.toUpperCase();
  const inputLower = input.toLowerCase();

  // Parse partial input
  const parsed = parseRoot(input);

  if (parsed) {
    // We have a valid root, suggest qualities
    const root = DISPLAY_ROOTS[parsed.rootIndex];
    const qualityInput = parsed.remaining.toLowerCase();

    const qualityOptions = ['', 'm', '7', 'maj7', 'm7', 'dim', 'aug', 'sus4', 'sus2', 'add9'];

    for (const q of qualityOptions) {
      if (q.startsWith(qualityInput) || qualityInput === '') {
        suggestions.push(root + q);
      }
    }
  } else {
    // Suggest roots that match
    for (const root of DISPLAY_ROOTS) {
      if (root.toUpperCase().startsWith(inputUpper)) {
        suggestions.push(root);
        suggestions.push(root + 'm');
        suggestions.push(root + '7');
      }
    }
  }

  // Remove duplicates and limit
  return [...new Set(suggestions)].slice(0, 8);
}

/**
 * Build a chord from root and quality
 */
export function buildChord(root, quality) {
  return parseChord(root + quality);
}

/**
 * Validate if a string is a valid chord
 */
export function isValidChord(chordStr) {
  return parseChord(chordStr) !== null;
}

export default {
  parseChord,
  getRoots,
  getQualities,
  getChordSuggestions,
  buildChord,
  isValidChord
};
