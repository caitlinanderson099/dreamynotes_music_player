import React, { useRef, useState, useEffect } from "react";
import "./App.css";

import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { IoPlayBack } from "react-icons/io5";
import { IoPlayForward } from "react-icons/io5";
import { FaMusic } from "react-icons/fa6";
import { FaVolumeUp } from "react-icons/fa";



const songs = [
  {
    title: "Tower of Memories - ivri",
    genre: "Alternative/Indie",
    cover: "/towerofmemories.jpeg",
    file: "/towerofmemories.mp3",
  },
  {
    title: "Here With Me - d4vd",
    genre: "Alternative/Indie",
    cover: "/herewithme.jpeg",
    file: "/herewithme.mp3",
  },
  {
    title: "I Like The Way You Kiss Me - Artemas",
    genre: "Alternative/Indie",
    cover: "/iliketheway.jpg",
    file: "/iliketheway.mp3",
  },
  {
    title: "All I wanted Was You - Paramore",
    genre: "Pop Punk",
    cover: "/alliwanted.jpeg",
    file: "/alliwanted.mp3",
  },
];

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;
  if (!audio) return;

  const updateProgress = () => {
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);
    setProgress((audio.currentTime / audio.duration) * 100 || 0);
  };

  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("loadedmetadata", updateProgress);

  return () => {
    audio.removeEventListener("timeupdate", updateProgress);
    audio.removeEventListener("loadedmetadata", updateProgress);
  };
  }, []);

  const formatTime = (time) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const spawnFloatingEmoji = () => {
    const container = document.querySelector(".window-widget");
    if (!container) return;
    const emoji = document.createElement("span");
    const emojis = ["💖", "⭐", "🌸", "✨"];
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.className = "floating-emoji";
    emoji.style.left = Math.random() * 70 + 15 + "%";
    container.appendChild(emoji);
    setTimeout(() => {
      emoji.remove();
    }, 2000);
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    setTimeout(() => {
      audioRef.current.play();
      setIsPlaying(true);
    }, 100);
    spawnFloatingEmoji();
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) =>
      prev === 0 ? songs.length - 1 : prev - 1
    );
    setTimeout(() => {
      audioRef.current.play();
      setIsPlaying(true);
    }, 100);
    spawnFloatingEmoji();
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  const handleVolume = (e) => {
    const newVolume = e.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  return (
    <div className="app-wrap">
      <h1 className="app-title">DreamyNotes</h1>
      <div className="window-widget">
        {/* Title Bar */}
        <div className="title-bar">
          <div className="window-controls">
            <button className="wc red" aria-label="close" />
            <button className="wc yellow" aria-label="minimize" />
            <button className="wc green" aria-label="maximize" />
          </div>
          <div className="title-text">{currentSong.title}</div>
          <div className="title-right"><FaMusic /></div>
        </div>

        {/* Window Content */}
        <div className="music-player">
          <h2 className="title">{currentSong.title}</h2>
          <p className="genre">{currentSong.genre}</p>
          <img className="cover" src={currentSong.cover} alt={currentSong.title} />

          <div className="controls">
            <button onClick={prevSong}>
              <IoPlayBack />
            </button>

            <button onClick={togglePlay}>
              {isPlaying ? <FaPause/> : <FaPlay />
}
            </button>

            <button onClick={nextSong}>
              <IoPlayForward />
            </button>
          </div>

         <div className="progress-container">
  <span className="time">{formatTime(currentTime)}</span>
  <input
    type="range"
    className="progress-bar"
    min="0"
    max="100"
    value={progress}
    onChange={handleSeek}
    style={{ '--progress': `${progress}%` }}
  />
  <span className="time">{formatTime(duration)}</span>
</div>

          <div className="volume">
            <span><FaVolumeUp color="#ff80b5"/></span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
            />
          </div>

          <audio ref={audioRef} src={currentSong.file} onEnded={nextSong}></audio>
        </div>
      </div>
    </div>
  );
}

export default App;
