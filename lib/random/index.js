const { fetchGameData } = require('./fetchData');
const { selectMusic } = require('./selectMusic');

/**
 * @param {'chunithm' | 'ongeki' | 'maimai'} gameName
 * @param {import('./selectMusic').MusicFilter} [filter={}]
 * @param {number} [count=1]
 */
async function getRandomMusic(gameName, filter = {}, count = 1) {
  const data = await fetchGameData(gameName);

  return await selectMusic(gameName, data, filter, count);
}

/**
 * @param {string} url
 * @returns {string}
 */
function encodeWikiUrl(url) {
  if (!url) return '#';
  try {
    const u = new URL(url);
    u.pathname = u.pathname.split('/').map(encodeURIComponent).join('/');
    return u.toString();
  } catch {
    return url;
  }
}

module.exports = {
  getRandomMusic,
  encodeWikiUrl,
};
