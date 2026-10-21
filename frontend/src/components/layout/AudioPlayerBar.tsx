import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  X,
  UserCheck
} from 'lucide-react';
import type { Ayah, Reciter } from '../../types';

interface AudioPlayerBarProps {
  currentAyah: Ayah | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextAyah: () => void;
  onPrevAyah: () => void;
  reciters: Reciter[];
  selectedReciter: string;
  onSelectReciter: (reciterId: string) => void;
  repeatCount: number;
  onChangeRepeatCount: (count: number) => void;
  onClose: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentAyah,
  isPlaying,
  onTogglePlay,
  onNextAyah,
  onPrevAyah,
  reciters,
  selectedReciter,
  onSelectReciter,
  repeatCount,
  onChangeRepeatCount,
  onClose,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentLoopIteration, setCurrentLoopIteration] = useState(1);
  const [audioError, setAudioError] = useState(false);

  const audioUrl = currentAyah?.audio_url;

  useEffect(() => {
    setAudioError(false);
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // auto-play policy or buffering
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioUrl]);

  const handleEnded = () => {
    if (repeatCount > 1 && currentLoopIteration < repeatCount) {
      setCurrentLoopIteration((prev) => prev + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      setCurrentLoopIteration(1);
      onNextAyah();
    }
  };

  if (!currentAyah) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#022c22] text-white border-t border-[#047857]/40 shadow-2xl px-4 py-2.5 transition-all">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={handleEnded}
        onError={() => setAudioError(true)}
        onCanPlay={() => setAudioError(false)}
      />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Ayah info */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[#064e3b] border border-[#047857] flex items-center justify-center text-[#fbbf24] font-bold text-xs shrink-0">
            {currentAyah.verse_key}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              Ayah {currentAyah.verse_key}
            </p>
            {audioError ? (
              <p className="text-[10px] text-amber-300 font-medium truncate">
                Buffering audio from server...
              </p>
            ) : (
              <p className="text-[11px] text-[#fbbf24] font-arabic truncate">
                {currentAyah.text_uthmani.slice(0, 35)}...
              </p>
            )}
          </div>
        </div>

        {/* Center: Controls & Scrubber */}
        <div className="flex flex-col items-center gap-1.5 w-full sm:max-w-md">
          <div className="flex items-center gap-4">
            <button
              onClick={onPrevAyah}
              className="text-emerald-200/80 hover:text-white transition-colors"
              title="Previous Ayah"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-[#d97706] to-[#b45309] hover:brightness-110 flex items-center justify-center text-white shadow-lg transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={onNextAyah}
              className="text-emerald-200/80 hover:text-white transition-colors"
              title="Next Ayah"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Repeat count button */}
            <div className="flex items-center gap-1 bg-[#064e3b] px-2 py-0.5 rounded-lg border border-[#047857] text-[11px]">
              <Repeat className="w-3 h-3 text-[#fbbf24]" />
              <select
                value={repeatCount}
                onChange={(e) => onChangeRepeatCount(Number(e.target.value))}
                className="bg-transparent text-white font-medium focus:outline-hidden cursor-pointer text-[11px]"
              >
                <option value={1} className="bg-[#022c22]">1x</option>
                <option value={3} className="bg-[#022c22]">3x</option>
                <option value={5} className="bg-[#022c22]">5x</option>
                <option value={10} className="bg-[#022c22]">10x</option>
              </select>
            </div>

            {/* Playback Speed */}
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-[#064e3b] px-1.5 py-0.5 rounded-lg border border-[#047857] text-[11px] text-white focus:outline-hidden cursor-pointer"
            >
              <option value={0.75} className="bg-[#022c22]">0.75x</option>
              <option value={1.0} className="bg-[#022c22]">1.0x</option>
              <option value={1.25} className="bg-[#022c22]">1.25x</option>
            </select>
          </div>

          {/* Time & Scrubber */}
          <div className="w-full flex items-center gap-2 text-[10px] text-emerald-200/70">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => {
                const newTime = Number(e.target.value);
                setCurrentTime(newTime);
                if (audioRef.current) audioRef.current.currentTime = newTime;
              }}
              className="flex-1 accent-[#fbbf24] h-1 rounded-lg bg-emerald-900 cursor-pointer"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Reciter Selector & Close */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#064e3b] px-2.5 py-1 rounded-xl border border-[#047857] text-xs">
            <UserCheck className="w-3.5 h-3.5 text-[#fbbf24]" />
            <select
              value={selectedReciter}
              onChange={(e) => onSelectReciter(e.target.value)}
              className="bg-transparent text-white text-xs font-medium focus:outline-hidden cursor-pointer"
            >
              {reciters.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#022c22]">
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-emerald-300 hover:text-white rounded-lg hover:bg-white/10"
            title="Close Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
