import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "ERR_0x01: NOISE", artist: "SYS.BOT", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "SECTOR_9_CORRUPTION", artist: "NULL_PTR", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "BUFFER_OVERFLOW", artist: "MEM_LEAK", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const prevTrack = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) setProgress((current / duration) * 100);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percentage = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full bg-black p-6 glitch-border flex flex-col gap-6">
      <div className="border-b-2 border-cyan-500 pb-2">
        <h3 className="text-2xl font-bold text-fuchsia-500 tracking-widest">AUDIO.SYS</h3>
      </div>

      <div className="flex flex-col gap-2 bg-[#0a0a0a] p-4 border border-fuchsia-500/50">
        <div className="flex justify-between text-cyan-400 text-xl">
          <span>FILE:</span>
          <span className="truncate ml-4">{currentTrack.title}.wav</span>
        </div>
        <div className="flex justify-between text-fuchsia-500 text-lg">
          <span>AUTHOR:</span>
          <span>{currentTrack.artist}</span>
        </div>
        <div className="flex justify-between text-cyan-400 text-lg">
          <span>STATUS:</span>
          <span className={isPlaying ? "animate-pulse text-fuchsia-500" : ""}>{isPlaying ? "STREAMING..." : "IDLE"}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-6 w-full bg-black border-2 border-cyan-500 cursor-pointer relative"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-fuchsia-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-black font-bold mix-blend-difference pointer-events-none">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-cyan-400">VOL:</span>
          <input 
            type="range" min="0" max="1" step="0.01" value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-black border border-cyan-500 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-fuchsia-500"
          />
          <span className="text-fuchsia-500 w-12 text-right">{Math.round(volume * 100)}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-2">
          <button onClick={prevTrack} className="btn-glitch py-2 text-xl">{'<<'}</button>
          <button onClick={togglePlay} className="btn-glitch py-2 text-xl">{isPlaying ? '||' : '>'}</button>
          <button onClick={nextTrack} className="btn-glitch py-2 text-xl">{'>>'}</button>
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack.url} onTimeUpdate={handleTimeUpdate} onEnded={nextTrack} />
    </div>
  );
}
