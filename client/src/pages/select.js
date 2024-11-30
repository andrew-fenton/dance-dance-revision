// pages/song-select.js
import { useRouter } from 'next/router';
import SongList from '../components/SongList';
import songs from '../data/songs';

export default function SongSelect() {
  const router = useRouter();

  const handleSongSelect = (song) => {
    router.push({
      pathname: '/gameNoWebcamScreen',
      query: { songId: song.id },
    });
  };

  return (
    <div>
      <h1>Select a Song</h1>
      <SongList songs={songs} onSongSelect={handleSongSelect} />
    </div>
  );
}
