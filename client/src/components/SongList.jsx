// components/SongList.js
import styles from '../styles/SongList.module.css';

export default function SongList({ songs, onSongSelect }) {
  return (
    <ul className={styles.songList}>
      {songs.map((song) => (
        <li key={song.id} className={styles.songItem}>
          <button onClick={() => {
            onSongSelect(song)
            console.log(song);
            }}>
            {song.title} - {song.artist}
          </button>
        </li>
      ))}
    </ul>
  );
}