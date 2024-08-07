import React, { useState, useEffect } from 'react';
import './App.css';

// characters.json と songs.json のファイルを src/data から読み込む
import charactersData from './data/characters.json';
import songsData from './data/songs.json';

function App() {
  const [characters, setCharacters] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [mainStatus, setMainStatus] = useState({
    happy: 0,
    pure: 0,
    cool: 0,
  });
  const [subStatus, setSubStatus] = useState({
    happy: 0,
    pure: 0,
    cool: 0,
  });

  useEffect(() => {
    // charactersData と songsData をセット
    setCharacters(charactersData);
    setSongs(songsData);
  }, []);

  const handleSongChange = (event) => {
    const songId = event.target.value;
    const song = songs.find((s) => s.id === songId);
    setSelectedSong(song);
  };

  const handleMainStatusChange = (event) => {
    const { name, value } = event.target;
    setMainStatus((prevStatus) => ({
      ...prevStatus,
      [name]: Number(value),
    }));
  };

  const handleSubStatusChange = (event) => {
    const { name, value } = event.target;
    setSubStatus((prevStatus) => ({
      ...prevStatus,
      [name]: Number(value),
    }));
  };

  const calculateResult = () => {
    if (selectedSong) {
      const subStatusCalculated = {
        happy: mainStatus.happy / 10,
        pure: mainStatus.pure / 10,
        cool: mainStatus.cool / 10,
      };

      return {
        mainStatus,
        subStatus: subStatusCalculated,
      };
    }
    return null;
  };

  const result = calculateResult();

  return (
    <div className="App">
      <h1>獲得LOVE計算ツール</h1>
      <div>
        <label htmlFor="song-select">曲を選択:</label>
        <select id="song-select" onChange={handleSongChange}>
          <option value="">選択してください</option>
          {songs.map((song) => (
            <option key={song.id} value={song.id}>
              {song.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSong && (
        <div>
          <h2>{selectedSong.name}</h2>
          <div>
            <h3>メインステータス</h3>
            <label>
              ハッピー:
              <input
                type="number"
                name="happy"
                value={mainStatus.happy}
                onChange={handleMainStatusChange}
              />
            </label>
            <label>
              ピュア:
              <input
                type="number"
                name="pure"
                value={mainStatus.pure}
                onChange={handleMainStatusChange}
              />
            </label>
            <label>
              クール:
              <input
                type="number"
                name="cool"
                value={mainStatus.cool}
                onChange={handleMainStatusChange}
              />
            </label>
          </div>

          <div>
            <h3>サブステータス</h3>
            <label>
              ハッピー:
              <input
                type="number"
                name="happy"
                value={subStatus.happy}
                onChange={handleSubStatusChange}
              />
            </label>
            <label>
              ピュア:
              <input
                type="number"
                name="pure"
                value={subStatus.pure}
                onChange={handleSubStatusChange}
              />
            </label>
            <label>
              クール:
              <input
                type="number"
                name="cool"
                value={subStatus.cool}
                onChange={handleSubStatusChange}
              />
            </label>
          </div>

          <button onClick={calculateResult}>計算</button>

          {result && (
            <div>
              <h3>計算結果</h3>
              <p>
                メインステータス - ハッピー: {result.mainStatus.happy} ピュア: {result.mainStatus.pure} クール: {result.mainStatus.cool}
              </p>
              <p>
                サブステータス - ハッピー: {result.subStatus.happy} ピュア: {result.subStatus.pure} クール: {result.subStatus.cool}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
