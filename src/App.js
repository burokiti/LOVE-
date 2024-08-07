import React, { useState, useEffect } from 'react';
import './App.css';
import characters from './data/characters.json';
import songs from './data/songs.json';

// ハートランクの倍率
const heartRankMultipliers = {
  LOVELIVE: 3.5,
  PERFECT: 3.0,
  GREAT: 2.5,
  GOOD: 2.0,
  NICE: 1.0,
};

function App() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [songData, setSongData] = useState([]);
  const [characterData, setCharacterData] = useState([]);
  const [formData, setFormData] = useState([]);
  const [heartRank, setHeartRank] = useState('LOVELIVE');
  const [error, setError] = useState(null);

  useEffect(() => {
    // 楽曲データを取得
    fetch('/data/songs.json')
      .then(response => response.json())
      .then(data => setSongData(data))
      .catch(err => setError('楽曲データの読み込みに失敗しました'));

    // キャラクターデータを取得
    fetch('/data/characters.json')
      .then(response => response.json())
      .then(data => setCharacterData(data))
      .catch(err => setError('キャラクターデータの読み込みに失敗しました'));
  }, []);

  const handleSongChange = (event) => {
    const songId = event.target.value;
    const song = songData.find(song => song.id === songId);
    if (song) {
      setSelectedSong(song);
      const initialFormData = Array(song.numberOfCharacters).fill({
        happyMain: '',
        coolMain: '',
        pureMain: '',
        happySub: '',
        coolSub: '',
        pureSub: '',
      });
      setFormData(initialFormData);
    }
  };

  const handleFormChange = (index, field, value) => {
    const newFormData = [...formData];
    newFormData[index][field] = value;
    setFormData(newFormData);
  };

  const calculateLove = () => {
    if (!selectedSong) return;

    const totalStatus = formData.reduce((total, character) => {
      const mainStatus = parseInt(character.happyMain || 0, 10)
        + parseInt(character.coolMain || 0, 10)
        + parseInt(character.pureMain || 0, 10);

      const subStatus = (parseInt(character.happySub || 0, 10)
        + parseInt(character.coolSub || 0, 10)
        + parseInt(character.pureSub || 0, 10)) / 10;

      const songAttribute = selectedSong.attribute;
      const mainStatusWithAttribute = songAttribute === 'happy' ? (parseInt(character.happyMain || 0, 10) * 1.5)
        : songAttribute === 'cool' ? (parseInt(character.coolMain || 0, 10) * 1.5)
        : songAttribute === 'pure' ? (parseInt(character.pureMain || 0, 10) * 1.5)
        : mainStatus;

      return total + mainStatusWithAttribute + subStatus;
    }, 0);

    const heartRankMultiplier = heartRankMultipliers[heartRank];
    const love = 120 * (totalStatus / selectedSong.numberOfCharacters) * heartRankMultiplier * selectedSong.heartCount / selectedSong.duration;
    alert(`獲得LOVE: ${love.toFixed(2)}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>獲得LOVE計算ツール</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label htmlFor="song">楽曲選択:</label>
          <select id="song" onChange={handleSongChange}>
            <option value="">選択してください</option>
            {songData.map(song => (
              <option key={song.id} value={song.id}>{song.name}</option>
            ))}
          </select>
        </div>
        {selectedSong && (
          <div>
            {formData.map((_, index) => (
              <div key={index} className="character-form">
                <h2>キャラクター {index + 1}</h2>
                <div>
                  <h3>メインステータス</h3>
                  <label>ハッピー:
                    <input
                      type="number"
                      value={formData[index].happyMain}
                      onChange={(e) => handleFormChange(index, 'happyMain', e.target.value)}
                    />
                  </label>
                  <label>クール:
                    <input
                      type="number"
                      value={formData[index].coolMain}
                      onChange={(e) => handleFormChange(index, 'coolMain', e.target.value)}
                    />
                  </label>
                  <label>ピュア:
                    <input
                      type="number"
                      value={formData[index].pureMain}
                      onChange={(e) => handleFormChange(index, 'pureMain', e.target.value)}
                    />
                  </label>
                </div>
                <div>
                  <h3>サブステータス</h3>
                  <label>ハッピー:
                    <input
                      type="number"
                      value={formData[index].happySub}
                      onChange={(e) => handleFormChange(index, 'happySub', e.target.value)}
                    />
                  </label>
                  <label>クール:
                    <input
                      type="number"
                      value={formData[index].coolSub}
                      onChange={(e) => handleFormChange(index, 'coolSub', e.target.value)}
                    />
                  </label>
                  <label>ピュア:
                    <input
                      type="number"
                      value={formData[index].pureSub}
                      onChange={(e) => handleFormChange(index, 'pureSub', e.target.value)}
                    />
                  </label>
                </div>
              </div>
            ))}
            <div>
              <label htmlFor="heartRank">ハートランク:</label>
              <select id="heartRank" value={heartRank} onChange={(e) => setHeartRank(e.target.value)}>
                {Object.keys(heartRankMultipliers).map(rank => (
                  <option key={rank} value={rank}>{rank}</option>
                ))}
              </select>
            </div>
            <button onClick={calculateLove}>計算</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
