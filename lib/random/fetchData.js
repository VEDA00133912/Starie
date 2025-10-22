const axios = require('axios');

/**
 * @param {'chunithm' | 'ongeki' | 'maimai'} gameName
 * @returns {Promise<any>}
 */
async function fetchGameData(gameName) {
  const url = `https://otoge-db.net/${gameName}/data/music-ex.json`;

  try {
    const res = await axios.get(url, { timeout: 10000 });
    return res.data;
  } catch (error) {
    throw new Error(`データの取得に失敗しました: ${gameName}`);
  }
}

module.exports = { fetchGameData };
