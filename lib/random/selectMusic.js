/**
 * @typedef {Object} MusicFilter
 * @property {string} [difficulty]
 * @property {string} [level] // +も許可するようにstringで
 */

/**
 * @param {'chunithm' | 'ongeki' | 'maimai'} gameName
 * @param {any[]} data - fetchGameData()で取得した曲データ
 * @param {MusicFilter} [filter={}]
 * @param {number} [count=1]
 * @returns {Promise<any[]>}
 */
async function selectMusic(gameName, data, filter = {}, count = 1) {
  const fieldMap = {
    basic: 'lev_bas',
    advanced: 'lev_adv',
    expert: 'lev_exc',
    master: 'lev_mas',
    lunatic: 'lev_lnt',
    ultima: 'lev_ult',
    remaster: 'lev_remas'
  };

  let results = data.filter(song => {
    if (!filter.difficulty) return true;

    const levField = fieldMap[filter.difficulty.toLowerCase()];
    if (!levField) return false;

    const fieldsToCheck = [levField];
    // maimaiだけdx_lev_XXXも
    if (gameName === 'maimai') {
      fieldsToCheck.unshift('dx_' + levField);
    }

    if (filter.level) {
      return fieldsToCheck.some(f => song[f]?.toString() === filter.level);
    }

    return fieldsToCheck.some(f => song[f] !== undefined && song[f] !== '');
  });

  if (results.length === 0) return [];

  const selected = [];
  const limit = Math.min(count, 10);
  for (let i = 0; i < limit; i++) {
    const idx = Math.floor(Math.random() * results.length);
    selected.push(results[idx]);
  }

  return selected;
}

module.exports = { selectMusic };
