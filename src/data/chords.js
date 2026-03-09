// Chord definitions for Left Hand (LH)
// Notes are in scientific pitch notation

export const chords = {
  Cm: {
    name: 'Cm',
    notes: ['C3', 'Eb3', 'G3'],
    fingers: [5, 3, 1], // LH fingering: pinky on root, middle on 3rd, thumb on 5th
  },
  Gm: {
    name: 'Gm',
    notes: ['G2', 'Bb2', 'D3'],
    fingers: [5, 3, 1],
  },
  Ab: {
    name: 'A♭',
    notes: ['Ab2', 'C3', 'Eb3'],
    fingers: [5, 3, 1],
  },
  Eb: {
    name: 'E♭',
    notes: ['Eb3', 'G3', 'Bb3'],
    fingers: [5, 3, 1],
  },
  Fm: {
    name: 'Fm',
    notes: ['F2', 'Ab2', 'C3'],
    fingers: [5, 3, 1],
  },
  Db: {
    name: 'D♭',
    notes: ['Db3', 'F3', 'Ab3'],
    fingers: [5, 3, 1],
  },
  Bb: {
    name: 'B♭',
    notes: ['Bb2', 'D3', 'F3'],
    fingers: [5, 3, 1],
  },
  G: {
    name: 'G',
    notes: ['G2', 'B2', 'D3'],
    fingers: [5, 3, 1],
  },
};

export const chordList = ['Cm', 'Gm', 'Ab', 'Eb', 'Fm', 'Db', 'Bb', 'G'];

// LH pattern generators for different levels
export const getLHPattern = (chord, level) => {
  const { notes } = chords[chord];
  const [root, third, fifth] = notes;

  // Calculate octave note (root + 1 octave)
  const rootNote = root.slice(0, -1);
  const rootOctave = parseInt(root.slice(-1));
  const octaveNote = rootNote + (rootOctave + 1);

  switch (level) {
    case 1: // Block chord - all notes at once
      return [{ notes: [root, third, fifth], fingers: [5, 3, 1], beat: 1 }];

    case 2: // Block chord on beats 1 & 3
      return [
        { notes: [root, third, fifth], fingers: [5, 3, 1], beat: 1 },
        { notes: [root, third, fifth], fingers: [5, 3, 1], beat: 3 },
      ];

    case 3: // Root-5th-octave pattern
      return [
        { notes: [root], fingers: [5], beat: 1 },
        { notes: [fifth], fingers: [1], beat: 2 },
        { notes: [octaveNote], fingers: [1], beat: 3 },
      ];

    case 4: // Root-3rd-5th-octave pattern
      return [
        { notes: [root], fingers: [5], beat: 1 },
        { notes: [third], fingers: [3], beat: 2 },
        { notes: [fifth], fingers: [1], beat: 3 },
        { notes: [octaveNote], fingers: [1], beat: 4 },
      ];

    case 5: // Octave bass + arpeggio fill
      return [
        { notes: [root, octaveNote], fingers: [5, 1], beat: 1 },
        { notes: [third], fingers: [3], beat: 2 },
        { notes: [fifth], fingers: [1], beat: 3 },
        { notes: [third], fingers: [3], beat: 4 },
      ];

    default:
      return [{ notes: [root, third, fifth], fingers: [5, 3, 1], beat: 1 }];
  }
};
