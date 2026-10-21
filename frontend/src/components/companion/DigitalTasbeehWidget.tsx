import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Smartphone,
} from 'lucide-react';

interface DhikrPreset {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
}

const PRESET_DHIKRS: DhikrPreset[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    translation: 'Glory be to Allah (33 times after Salah)',
    target: 33,
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'All praise is due to Allah (33 times after Salah)',
    target: 33,
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest (34 times after Salah)',
    target: 34,
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness from Allah (100 times daily Sunnah)',
    target: 100,
  },
  {
    id: 'tahlil',
    arabic: 'لَا إِلٰهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illallah',
    translation: 'None is worthy of worship except Allah',
    target: 100,
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',
    transliteration: 'Allahumma Salli \'Ala Muhammad',
    translation: 'Blessings upon the Prophet Muhammad ﷺ',
    target: 100,
  },
  {
    id: 'subhanallahi_bihamdihi',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: 'SubhanAllahi wa bihamdihi SubhanAllahil Azeem',
    translation: 'Two phrases light on the tongue, heavy on the scales',
    target: 100,
  },
];

export const DigitalTasbeehWidget: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<DhikrPreset>(() => {
    try {
      const storedId = localStorage.getItem('noor_tasbeeh_preset_id');
      if (storedId) {
        const found = PRESET_DHIKRS.find((d) => d.id === storedId);
        if (found) return found;
      }
    } catch {}
    return PRESET_DHIKRS[0];
  });
  const [count, setCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('noor_tasbeeh_current_count');
      if (stored !== null) {
        const val = parseInt(stored, 10);
        if (!isNaN(val) && val >= 0) return val;
      }
    } catch {}
    return 0;
  });
  const [completedSets, setCompletedSets] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('noor_tasbeeh_completed_sets');
      if (stored !== null) {
        const val = parseInt(stored, 10);
        if (!isNaN(val) && val >= 0) return val;
      }
    } catch {}
    return 0;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('noor_tasbeeh_sound') !== 'false';
    } catch {
      return true;
    }
  });
  const [vibrateEnabled, setVibrateEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('noor_tasbeeh_vibrate') !== 'false';
    } catch {
      return true;
    }
  });
  const [totalLifetimeCount, setTotalLifetimeCount] = useState<number>(0);

  // Sync state to localStorage so refresh retains active dhikr count
  useEffect(() => {
    try {
      localStorage.setItem('noor_tasbeeh_preset_id', selectedPreset.id);
      localStorage.setItem('noor_tasbeeh_current_count', count.toString());
      localStorage.setItem('noor_tasbeeh_completed_sets', completedSets.toString());
      localStorage.setItem('noor_tasbeeh_sound', soundEnabled.toString());
      localStorage.setItem('noor_tasbeeh_vibrate', vibrateEnabled.toString());
    } catch {}
  }, [selectedPreset.id, count, completedSets, soundEnabled, vibrateEnabled]);

  // Load lifetime count from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('noor_lifetime_tasbeeh');
      if (stored) setTotalLifetimeCount(Number(stored));
    } catch {}
  }, []);

  // Web Audio click synthesis
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  };

  const handleIncrement = () => {
    const nextCount = count + 1;
    playClickSound();

    if (vibrateEnabled && navigator.vibrate) {
      navigator.vibrate(30);
    }

    if (nextCount >= selectedPreset.target) {
      // Completed a set!
      setCount(0);
      setCompletedSets((prev) => prev + 1);
      if (vibrateEnabled && navigator.vibrate) {
        navigator.vibrate([60, 50, 100]);
      }
    } else {
      setCount(nextCount);
    }

    const nextTotal = totalLifetimeCount + 1;
    setTotalLifetimeCount(nextTotal);
    try {
      localStorage.setItem('noor_lifetime_tasbeeh', String(nextTotal));
    } catch {}
  };

  const handleReset = () => {
    if (confirm('Reset the current count to 0?')) {
      setCount(0);
    }
  };

  const progressPercent = Math.min(100, Math.round((count / selectedPreset.target) * 100));

  // Progress ring dimensions
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* Left: Interactive Tasbeeh Main Pad */}
      <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center space-y-6">
        {/* Active Dhikr Display */}
        <div className="text-center space-y-1.5 w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 text-emerald-800 dark:text-[#fbbf24] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Target: {selectedPreset.target} Counts</span>
          </div>

          <h3 className="font-arabic text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white pt-2" dir="rtl">
            {selectedPreset.arabic}
          </h3>

          <p className="font-semibold text-sm text-slate-600 dark:text-slate-300">
            {selectedPreset.transliteration}
          </p>
          <p className="text-xs text-slate-400">
            {selectedPreset.translation}
          </p>
        </div>

        {/* Big Tactile Click Button with SVG Ring */}
        <div className="relative flex items-center justify-center">
          <svg className="w-56 h-56 transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="112"
              cy="112"
              r={radius}
              className="stroke-slate-100 dark:stroke-slate-800 fill-none"
              strokeWidth="10"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="112"
              cy="112"
              r={radius}
              className="stroke-[#064e3b] dark:stroke-[#fbbf24] fill-none transition-all duration-200"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Central Tap Target */}
          <button
            onClick={handleIncrement}
            className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-[#064e3b] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-all active:scale-90 select-none group"
          >
            <span className="text-4xl sm:text-5xl font-mono font-extrabold tracking-tight group-hover:scale-105 transition-transform">
              {count}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#fbbf24] mt-1">
              Tap to Count
            </span>
          </button>
        </div>

        {/* Stats & Quick Settings Bar */}
        <div className="w-full flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Completed Sets</span>
              <span className="font-bold text-slate-800 dark:text-white text-sm">
                {completedSets} Cycles ({completedSets * selectedPreset.target + count} total)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl transition-colors ${
                soundEnabled
                  ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-[#fbbf24]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
              title={soundEnabled ? 'Mute sound' : 'Enable sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setVibrateEnabled(!vibrateEnabled)}
              className={`p-2 rounded-xl transition-colors ${
                vibrateEnabled
                  ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-[#fbbf24]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
              title={vibrateEnabled ? 'Disable vibration' : 'Enable vibration'}
            >
              <Smartphone className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 text-slate-500 transition-colors"
              title="Reset counter"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right: Preset Dhikr Library */}
      <div className="md:col-span-5 space-y-4">
        {/* Lifetime Dhikr Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-100 block">Total Dhikr Count</span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono mt-0.5">
              {totalLifetimeCount.toLocaleString()}
            </p>
            <span className="text-[11px] text-amber-100 mt-0.5 block">Stored locally on this device</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-xl">
            📿
          </div>
        </div>

        {/* Preset Selector List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select Prophetic Dhikr:
          </h4>

          <div className="space-y-2">
            {PRESET_DHIKRS.map((item) => {
              const isSelected = selectedPreset.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedPreset(item);
                    setCount(0);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-slate-800 border-emerald-500 dark:border-emerald-500/80 shadow-xs ring-1 ring-emerald-500/30'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/60 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      {item.transliteration}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate block max-w-[200px]">
                      {item.translation}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-arabic font-bold text-sm text-[#064e3b] dark:text-[#fbbf24] block" dir="rtl">
                      {item.arabic}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {item.target}x
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
