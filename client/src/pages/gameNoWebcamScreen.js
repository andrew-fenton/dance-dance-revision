import { useRouter } from 'next/router'; // Import useRouter
import { useEffect, useState } from "react";
import GameNoWebcam from "../components/GameNoWebcam";
import songs from '../data/songs'; // Import your songs data

const GameNoWebcamScreen = () => {
    const router = useRouter();
    const { songId } = router.query; // Get songId from query parameters
    const [songData, setSongData] = useState(null);

    useEffect(() => {
        // Ensure songId is available (router.query may be undefined initially)
        if (songId) {
            const selectedSong = songs.find((song) => song.id === songId);
            if (selectedSong) {
                setSongData(selectedSong);
            } else {
                // Handle invalid songId, e.g., redirect back to song-select
                router.push('/song-select');
            }
        }
    }, [songId]);

    if (!songData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Now Playing: {songData.title}</h1>
            <GameNoWebcam song={songData} />
        </div>
    );

};

export default GameNoWebcamScreen;