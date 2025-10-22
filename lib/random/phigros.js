const axios = require('axios');

/**
 * @param {'phigros'} type
 * @param {{ difficulty?: string, level?: string }} filter
 * @param {number} count
 * @returns {Promise<Array>}
 */
async function getRandomMusic(type, filter, count = 1) {
  if (type !== 'phigros') throw new Error('phigrosを指定してください');

  const { difficulty = 'master', level } = filter || {};

  const params = {};
  if (difficulty) params.difficulty = difficulty.toLowerCase();
  if (level) params.level = level;

  try {
    const res = await axios.get('https://random-taiko.onrender.com/api/phigros/random-phigros', { params });
    const data = Array.isArray(res.data.songs) ? res.data.songs : [];
    if (data.length === 0) return [];

    const unique = Array.from(new Map(data.map(s => [s.name, s])).values());
    const shuffled = unique.sort(() => 0.5 - Math.random());

    return shuffled.slice(0, count).map(song => ({
      title: song.name,
      composers: Array.isArray(song.composers) ? song.composers : [],
      difficulty: difficulty.toLowerCase(),
      lev_ez: song.difficulties?.ez ?? null,
      lev_hd: song.difficulties?.hd ?? null,
      lev_in: song.difficulties?.in ?? null,
      lev_at: song.difficulties?.at ?? null,
      wiki_url: encodeWikiUrl(song.name),
    }));
  } catch (err) {
    return [];
  }
}

/**
 * @param {string} songName
 * @returns {string}
 */
function encodeWikiUrl(songName) {
  if (!songName) return '';
  return `https://wikiwiki.jp/phigros/${encodeURIComponent(songName)}`;
}

module.exports = { getRandomMusic, encodeWikiUrl };
