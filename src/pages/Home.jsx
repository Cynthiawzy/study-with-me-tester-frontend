import { useState, useEffect} from "react";
import api from "../api";
import "../styles/Home.css";
import axios from "axios";
import {ACCESS_TOKEN} from "../auth";


function Home() {
    const [mood, setMood] = useState("");
    const [video, setVideo] = useState(null);
    const [previousVideos, setPreviousVideos] = useState({});
    const [videoList, setVideoList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [videoHistory, setVideoHistory] = useState({});
    const [moodOptions, setMoodOptions] = useState([
        'lofi', 'nature', 'coffee shop', 'idol', 'typing'
    ]);
    const [preferredVideos, setPreferredVideos] = useState([]);  
    const [savedVideoIndex, setSavedVideoIndex] = useState(0);

    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
    console.log(API_KEY)

    useEffect(() => {
        getPreferredVideos();  
    }, []);

    const getPreferredVideos = async () => {
        try {
            const token = ACCESS_TOKEN(); 
            const response = await axios.get('http://127.0.0.1:8000/api/video-preferences/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPreferredVideos(response.data);
        } catch (error) {
            console.error('Error fetching preferred videos:', error.response ? error.response.data : error.message);
        }
    };

    const savePreferredVideo = async () => {
        const currentVideoTitle = video?.title;
        const currentVideoUrl = video ? `https://www.youtube.com/watch?v=${video.videoId}` : "";
        const currentVideoMood = mood;
        const thumbnailUrl = video ? `https://img.youtube.com/vi/${video.videoId}/default.jpg` : "";
    
        if (currentVideoTitle && currentVideoUrl) {
            try {
                const token = ACCESS_TOKEN(); 
                if (!token) {
                    throw new Error('No access token available');
                }
                const response = await axios.post('http://127.0.0.1:8000/api/video-preferences/', 
                    { 
                        mood: currentVideoMood,
                        video_url: currentVideoUrl,
                        title: currentVideoTitle,
                        thumbnail_url: thumbnailUrl,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                setPreferredVideos(prev => [...prev, response.data]);
            } catch (error) {
                console.error('Error saving video:', error.response ? error.response.data : error.message);
            }
        }
    };

    const deletePreferredVideo = (id) => {
        const token = ACCESS_TOKEN(); // Retrieve the access token
        api.delete(`http://127.0.0.1:8000/api/video-preferences/delete/${id}/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            if (res.status === 204) alert("Saved video deleted");
            else alert("Failed to delete saved video");
            getPreferredVideos(); // Refresh the list of saved videos
        })
        .catch((error) => alert(error));
    };

    const fetchVideoForMood = async (selectedMood) => {
        try {
            const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                params: {
                    part: 'snippet',
                    q: `${selectedMood} study with me`,
                    maxResults: 10,
                    type: 'video',
                    key: API_KEY,
                }
            });
    
            const videos = response.data.items;
            const previouslyFetched = previousVideos[selectedMood] || [];
    
            const embeddableVideos = [];
    
            for (const videoData of videos) {
                const videoId = videoData.id.videoId;
    
                try {
                    const videoDetails = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
                        params: {
                            part: 'status',
                            id: videoId,
                            key: API_KEY,
                        }
                    });
    
                    const details = videoDetails.data.items[0];
                    if (details.status.embeddable) {
                        embeddableVideos.push(videoData);
                    }
                } catch (error) {
                    console.error(`Error fetching details for video ${videoId}:`, error);
                }
            }
    
            const availableVideos = embeddableVideos.filter(video =>
                !previouslyFetched.includes(video.id.videoId)
            );
    
            if (availableVideos.length === 0) {
                setPreviousVideos(prev => ({
                    ...prev,
                    [selectedMood]: []
                }));
                setVideo(null);
            } else {

                const shuffledVideos = availableVideos.sort(() => Math.random() - 0.5);
                setVideoList(shuffledVideos);
                setCurrentIndex(0);
    
                const embeddableVideo = shuffledVideos[0];
                setVideo({
                    title: embeddableVideo.snippet.title,
                    videoId: embeddableVideo.id.videoId,
                });
    
                setPreviousVideos(prev => ({
                    ...prev,
                    [selectedMood]: [...previouslyFetched, embeddableVideo.id.videoId]
                }));
            }
        } catch (error) {
            console.error("Error fetching video:", error);
            setVideo(null);
        }
    };

    const handleMoodChange = (event) => {
        setMood(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchVideoForMood(mood);
    };

    const handleNextVideo = () => {
        if (!video) return; 

        const moodHistory = videoHistory[mood] || [];
        const currentVideoId = video.videoId;
        const currentIndex = videoList.findIndex(v => v.id.videoId === currentVideoId);

        if (!moodHistory.includes(currentVideoId)) {
            setVideoHistory(prev => ({
                ...prev,
                [mood]: [...moodHistory, currentVideoId]
            }));
        }

        const nextIndex = (currentIndex + 1) % videoList.length;
        const nextVideo = videoList[nextIndex];

        console.log("Playing next video ID:", nextVideo.id.videoId);

        setVideo({
            title: nextVideo.snippet.title,
            videoId: nextVideo.id.videoId,
        });

        setCurrentIndex(nextIndex);
    };
    
    const handlePreviousVideo = () => {
        if (!video)  {
            return; 
        }

        const moodHistory = videoHistory[mood] || [];
        const currentVideoId = video.videoId;

        const currentIndex = videoList.findIndex(v => v.id.videoId === currentVideoId);

        if (moodHistory.length > 0 && currentIndex !== -1) {
            const prevIndex = currentIndex - 1;
            
            if (prevIndex >= 0 && prevIndex < videoList.length) {
                const prevVideo = videoList[prevIndex];
                
                if (prevVideo) {
                    console.log("Previous video found:", prevVideo.snippet.title);
                    setVideo({
                        title: prevVideo.snippet.title,
                        videoId: prevVideo.id.videoId,
                    });
    
                    setVideoHistory(prev => ({
                        ...prev,
                        [mood]: moodHistory.slice(0, moodHistory.length - 1) 
                    }));
    
                    setCurrentIndex(prevIndex);
                }
            } else {
                console.log("No previous video available.");
            }
        } else {
            console.log("No previous video available.");
        }
    };

    const handleNextSavedVideo = () => {
        setSavedVideoIndex((prevIndex) => 
            Math.min(prevIndex + 3, preferredVideos.length - 3)
        );
    };

    const handlePreviousSavedVideo = () => {
        setSavedVideoIndex((prevIndex) => Math.max(prevIndex - 3, 0));
    };


    return (
        <div className="home-container">
            <header className="header-container">
                <h2>Select Your Mood</h2>
            </header>
            <form onSubmit={handleSubmit}>
                <select value={mood} onChange={handleMoodChange} required>
                    <option value="">Select a mood</option>
                    {moodOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <button type="submit">Submit</button>
            </form>
            {video && (
                <div className="video-container">
                    <iframe
                        width="1000"
                        height="600"
                        src={`https://www.youtube.com/embed/${video.videoId}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.title}
                        onLoad={() => console.log("Video embed URL:", `https://www.youtube.com/embed/${video.videoId}`)}
                    ></iframe>
                    <div className="video-controls">
                        <button onClick={handlePreviousVideo} className="prev-video">&#9664;&#9664;</button>
                        <button onClick={savePreferredVideo} className="save-button">
                            Save Video
                        </button>
                        <button onClick={handleNextVideo} className="next-video">&#9654;&#9654;</button>
                    </div>
                </div>
            )}
            {preferredVideos.length > 0 && (
                <div className="saved-videos-carousel">
                    <h2>Saved Videos</h2>
                    <div className={`carousel-container ${
                    preferredVideos.length < 3 ? 'fewer-than-three' : ''
                }`} >
                        <button className="prev-carousel" onClick={handlePreviousSavedVideo}>&#9664;</button>
                            <div className="carousel">
                                {preferredVideos.slice(savedVideoIndex, savedVideoIndex + 3).map((video, index) => (
                                    <div key={index} className="carousel-video">
                                        <img
                                            src={video.thumbnail_url}
                                            alt={video.title}
                                            className="video-thumbnail"
                                            onClick={() => {
                                                console.log("Clicked saved video ID:", video.video_id); // Log the clicked video ID
                                                console.log("Clicked saved video Title:", video.title); // Log the clicked video title
                                                if (video.video_id) {
                                                    setVideo({ title: video.title, videoId: video.video_id });
                                                } else {
                                                    console.error("Video ID is undefined or missing");
                                            }}}
                                        />
                                        <span className="video-title" title={video.title}>
                                            {video.title.length > 20 
                                                ? video.title.substring(0, 20) + "..."
                                                : video.title}
                                        </span>
                                        <button onClick={() => deletePreferredVideo(video.id)}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        <button className="next-carousel" onClick={handleNextSavedVideo}>&#9654;</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;