// Chance that the bot will just not respond with approriate info for a given command
// hessBot is kinda random like that.
const FAIL_CHANCE = 0.05;

// Image Extensions
const VALID_IMG_EXT = ['png', 'gif', 'jpg', 'jpeg'];
const TAG_LINE = 'HessBot the bess Bot';

// Subs that hessBot likes
const MEMES_SUBS = [
  'NoahGetTheBoat',
  'HolUp',
  'cringe',
  'Yiffinhell',
  'SuddenlyGay',
  'Suddenlysexoffender',
  'Tihi',
  'Notkenm',
  'trashy',
  'Notdisneyvacation',
  'Whoooosh',
  'makemesuffer',
  'makemesuffermore',
  'Shhhhhh',
];

const AWW_SUBS = [
  'cats',
  'aww',
  'catpranks',
  'catculations',
  'chonkers',
  'eyebleach',
  'kittypupperlove',
  'AbsoluteUnits',
];


const EMOJIS = {
  cake: '🎂',
  spacers: [
    '❤️', '⭐', '⬜', '🟩', '🟦', '🟥', '🟫',
  ],
  letters: {
    a: '🇦',
    b: '🇧',
    c: '🇨',
    d: '🇩',
    e: '🇪',
    f: '🇫',
    g: '🇬',
    h: '🇭',
    i: '🇮',
    j: '🇯',
    k: '🇰',
    l: '🇱',
    m: '🇲',
    n: '🇳',
    o: '🇴',
    p: '🇵',
    q: '🇶',
    r: '🇷',
    s: '🇸',
    t: '🇹',
    u: '🇺',
    v: '🇻',
    w: '🇼',
    x: '🇽',
    y: '🇾',
    z: '🇿',
  },
};


// -____- face that can be called, formatted for discord
const _FACE_ = '-\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_-';

module.exports = {
  _FACE_,
  FAIL_CHANCE,
  EMOJIS,
  AWW_SUBS,
  MEMES_SUBS,
  TAG_LINE,
  VALID_IMG_EXT,
};
