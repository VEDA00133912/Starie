const axios = require('axios');

/**
 * @param {'phigros'} type
 * @param {{ difficulty: string, level?: string }} filter
 * @param {number} count
 * @returns {Promise<Array>}
 */
async function getRandomMusic(type, filter, count = 1) {
  if (type !== 'phigros') throw new Error('phigrosを指定してください');

  const difficulty = filter.difficulty.toLowerCase();
  const level = filter.level;

  const params = { difficulty };
  if (level) params.level = level;

  try {
    const res = await axios.get('https://random-taiko.onrender.com/api/phigros/random-phigros', { params });
    let data = Array.isArray(res.data.songs) ? res.data.songs : [];
    if (data.length === 0) return [];

    const unique = Array.from(new Map(data.map(s => [s.name, s])).values());

    const shuffled = unique.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    return selected.map(song => {
      const songLevel = level ?? song.difficulties?.[difficulty] ?? null;

      return {
        title: song.name,
        composers: Array.isArray(song.composers) ? song.composers : [],
        difficulty: difficulty,
        level: songLevel,
        wiki_url: encodeWikiUrl(song.name),
      };
    });
  } catch (err) {
    console.error('[ERROR] getRandomMusic:', err.message);
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
