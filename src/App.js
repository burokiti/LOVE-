import React, { useState, useEffect } from 'react';
import characters from './data/characters.json';
import songs from './data/songs.json';

function App() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [heartRank, setHeartRank] = useState(1);
  const [heartCount, setHeartCount] = useState(1);
  const [masteryBonus, setMasteryBonus] = useState(1);
  const [loveBonusLevel, setLoveBonusLevel] = useState(1);
  const [loveAttract, setLoveAttract] = useState(1);
  const [results, setResults] = useState({});

  useEffect(() => {
    if (selectedSong) {
      const song = songs.find((song) => song.id === selectedSong);
      if (song) {
        setResults({ ...results, song });
      }
    }
  }, [selectedSong]);

  const handleCalculate = () => {
    if (selectedSong) {
      const song = songs.find((song) => song.id === selectedSong);
      if (song) {
        const numMembers = song.members.length;
        const mainStatusSum = song.members.reduce((sum, member) => {
          return sum + member.mainStatus.happy + member.mainStatus.pure + member.mainStatus.cool;
        }, 0);
        const avgStatus = mainStatusSum / numMembers;
        const love = 120 * avgStatus * heartRank * heartCount * masteryBonus * loveBonusLevel / (song.duration * loveAttract);
        setResults({
          ...results,
          love
        });
      }
    }
  };

  return (
    <div className="App">
      <h1>獲得LOVE計算ツール</h1>
      <label htmlFor="song-select">楽曲を選択:</label>
      <select
        id="song-select"
        onChange={(e) => setSelectedSong(e.target.value)}
        value={selectedSong || ""}
      >
        <option value="">選択してください</option>
        {songs.map((song) => (
          <option key={song.id} value={song.id}>
            {song.name}
          </option>
        ))}
      </select>

      {selectedSong && results.song && (
        <div>
          <h2>{results.song.name}</h2>
          <p>センターキャラクター: {results.song.centerCharacter}</p>
          
          {results.song.members.map((member, index) => (
            <div key={index}>
              <h3>{member.name}</h3>
              <div>
                <h4>メインステータス</h4>
                <label>ハッピー:</label>
                <input type="number" defaultValue={member.mainStatus.happy} />
                <label>ピュア:</label>
                <input type="number" defaultValue={member.mainStatus.pure} />
                <label>クール:</label>
                <input type="number" defaultValue={member.mainStatus.cool} />
              </div>
              <div>
                <h4>サブステータス</h4>
                <label>ハッピー:</label>
                <input type="number" defaultValue={member.subStatus.happy / 10} />
                <label>ピュア:</label>
                <input type="number" defaultValue={member.subStatus.pure / 10} />
                <label>クール:</label>
                <input type="number" defaultValue={member.subStatus.cool / 10} />
              </div>
            </div>
          ))}

          <div>
            <h4>計算項目</h4>
            <label>ハートランク:</label>
            <input
              type="number"
              value={heartRank}
              onChange={(e) => setHeartRank(Number(e.target.value))}
              min="1"
            />
            <label>ハートの個数:</label>
            <input
              type="number"
              value={heartCount}
              onChange={(e) => setHeartCount(Number(e.target.value))}
              min="1"
            />
            <label>楽曲マスタリーボーナス:</label>
            <input
              type="number"
              value={masteryBonus}
              onChange={(e) => setMasteryBonus(Number(e.target.value))}
              min="1"
            />
            <label>ラブボーナスのレベル:</label>
            <input
              type="number"
              value={loveBonusLevel}
              onChange={(e) => setLoveBonusLevel(Number(e.target.value))}
              min="1"
            />
            <label>ラブアトラクト:</label>
            <input
              type="number"
              value={loveAttract}
              onChange={(e) => setLoveAttract(Number(e.target.value))}
              min="1"
            />
          </div>
          
          <button onClick={handleCalculate}>計算</button>

          {results.love !== undefined && (
            <div>
              <h2>獲得LOVE: {results.love.toFixed(2)}</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
