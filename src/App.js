import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [stats, setStats] = useState([]);
  const [heartRank, setHeartRank] = useState(3.5);
  const [heartCount, setHeartCount] = useState(1);
  const [loveBonus, setLoveBonus] = useState(1);
  const [centerBonus, setCenterBonus] = useState(1);
  const [loveAttract, setLoveAttract] = useState(1);
  const heartRanks = { LOVELIVE: 3.5, PERFECT: 3.0, GREAT: 2.5, GOOD: 2.0, NICE: 1.0 };

  useEffect(() => {
    // 楽曲とキャラクターのデータをフェッチします。
    fetch('/data/songs.json')
      .then(response => response.json())
      .then(data => setSongs(data));
    fetch('/data/characters.json')
      .then(response => response.json())
      .then(data => setCharacters(data));
  }, []);

  const handleSongChange = (event) => {
    const selected = songs.find(song => song.id === event.target.value);
    setSelectedSong(selected);
    setStats(new Array(selected.singers.length).fill({ pure: 0, cool: 0, happy: 0 }));
  };

  const handleStatChange = (index, stat, value) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [stat]: value };
    setStats(newStats);
  };

  const calculateLove = () => {
    if (!selectedSong) return 0;
    const totalStats = stats.reduce((sum, stat) => {
      const pure = parseFloat(stat.pure) || 0;
      const cool = parseFloat(stat.cool) || 0;
      const happy = parseFloat(stat.happy) || 0;
      let charTotal = pure + cool + happy;
      if (selectedSong.attribute === 'ピュア') charTotal += pure * 0.5;
      if (selectedSong.attribute === 'クール') charTotal += cool * 0.5;
      if (selectedSong.attribute === 'ハッピー') charTotal += happy * 0.5;
      return sum + charTotal;
    }, 0);

    const averageStats = totalStats / selectedSong.singers.length;
    return 120 * averageStats * heartRank * heartCount * centerBonus * loveBonus / selectedSong.duration * loveAttract;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Music Love Calculator</h1>
        <div>
          <label>Song: </label>
          <select onChange={handleSongChange}>
            <option value="">Select a song</option>
            {songs.map(song => (
              <option key={song.id} value={song.id}>{song.name}</option>
            ))}
          </select>
        </div>
        {selectedSong && (
          <>
            <h2>{selectedSong.name}</h2>
            <div>
              <label>Heart Rank: </label>
              <select value={heartRank} onChange={(e) => setHeartRank(parseFloat(e.target.value))}>
                {Object.keys(heartRanks).map(rank => (
                  <option key={rank} value={heartRanks[rank]}>{rank}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Heart Count: </label>
              <input type="number" value={heartCount} onChange={(e) => setHeartCount(parseFloat(e.target.value))} />
            </div>
            <div>
              <label>Center Bonus: </label>
              <input type="number" value={centerBonus} onChange={(e) => setCenterBonus(parseFloat(e.target.value))} />
            </div>
            <div>
              <label>Love Bonus: </label>
              <input type="number" value={loveBonus} onChange={(e) => setLoveBonus(parseFloat(e.target.value))} />
            </div>
            <div>
              <label>Love Attract: </label>
              <input type="number" value={loveAttract} onChange={(e) => setLoveAttract(parseFloat(e.target.value))} />
            </div>
            {selectedSong.singers.map((singer, index) => (
              <div key={index}>
                <h3>{singer}</h3>
                <div>
                  <label>Pure: </label>
                  <input type="number" value={stats[index]?.pure || 0} onChange={(e) => handleStatChange(index, 'pure', e.target.value)} />
                </div>
                <div>
                  <label>Cool: </label>
                  <input type="number" value={stats[index]?.cool || 0} onChange={(e) => handleStatChange(index, 'cool', e.target.value)} />
                </div>
                <div>
                  <label>Happy: </label>
                  <input type="number" value={stats[index]?.happy || 0} onChange={(e) => handleStatChange(index, 'happy', e.target.value)} />
                </div>
              </div>
            ))}
            <div>
              <h2>Calculated LOVE: {calculateLove().toFixed(2)}</h2>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
