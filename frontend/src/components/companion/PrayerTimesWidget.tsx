import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Clock,
  MapPin,
  Play,
  Pause,
  Sun,
  Sunset,
  Sunrise,
  Moon,
  Navigation,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  calculatePrayerTimes,
  GLOBAL_CITIES,
  type CalculationMethod,
  type JuristicMethod,
  type CityPreset,
  type PrayerTimeSchedule
} from '../../utils/prayerTimes';

export const PrayerTimesWidget: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityPreset>(GLOBAL_CITIES[0]); // Makkah default
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [juristic, setJuristic] = useState<JuristicMethod>('hanafi');
  const [method, setMethod] = useState<CalculationMethod>('karachi');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isPlayingAdhan, setIsPlayingAdhan] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live schedule
  const schedule: PrayerTimeSchedule = useMemo(() => {
    return calculatePrayerTimes(
      currentTime,
      selectedCity.lat,
      selectedCity.lng,
      method,
      juristic
    );
  }, [currentTime, selectedCity, method, juristic]);

  // Request browser GPS location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingLocation(false);
        setSelectedCity({
          name: 'Your Current Location',
          country: 'GPS Detected',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setIsDetectingLocation(false);
        setLocationError('Could not access GPS location. Please choose a city below.');
        console.warn(err);
      },
      { timeout: 8000 }
    );
  };

  const handleToggleAdhan = () => {
    if (isPlayingAdhan) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlayingAdhan(false);
    } else {
      if (!audioRef.current) {
        // Authentic Masjid al-Haram Makkah Adhan audio
        audioRef.current = new Audio('/audio/makkah_adhan.mp3');
        audioRef.current.onended = () => setIsPlayingAdhan(false);
        audioRef.current.onerror = () => setIsPlayingAdhan(false);
      }
      audioRef.current.play().then(() => setIsPlayingAdhan(true)).catch((err) => {
        console.error('Audio playback error:', err);
        setIsPlayingAdhan(false);
      });
    }
  };

  const prayerCards = [
    { name: 'Fajr', time: schedule.fajr, icon: Sunrise, desc: 'Dawn to Sunrise' },
    { name: 'Sunrise', time: schedule.sunrise, icon: Sun, desc: 'Ishraq / Shurooq' },
    { name: 'Dhuhr', time: schedule.dhuhr, icon: Sun, desc: 'Midday solar noon' },
    { name: 'Asr', time: schedule.asr, icon: Sun, desc: juristic === 'hanafi' ? 'Hanafi (2x shadow)' : 'Standard (1x shadow)' },
    { name: 'Maghrib', time: schedule.maghrib, icon: Sunset, desc: 'Sunset to twilight' },
    { name: 'Isha', time: schedule.isha, icon: Moon, desc: 'Night prayer' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Location & Settings Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* City Selector */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={selectedCity.name}
                onChange={(e) => {
                  const city = GLOBAL_CITIES.find((c) => c.name === e.target.value);
                  if (city) setSelectedCity(city);
                }}
                className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-sm px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden"
              >
                {GLOBAL_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}, {c.country}
                  </option>
                ))}
              </select>

              <button
                onClick={handleDetectLocation}
                disabled={isDetectingLocation}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-700 transition-colors"
                title="Use my current GPS Location"
              >
                <Navigation className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Coordinates: {selectedCity.lat.toFixed(2)}° N, {selectedCity.lng.toFixed(2)}° E
            </p>
          </div>
        </div>

        {/* Method & Juristic Selector */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Asr Juristic Method */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setJuristic('hanafi')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                juristic === 'hanafi'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Hanafi
            </button>
            <button
              onClick={() => setJuristic('shafii')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                juristic === 'shafii'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Shafi'i/Standard
            </button>
          </div>

          {/* Convention */}
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as CalculationMethod)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium px-2.5 py-1.5 rounded-xl border border-transparent focus:outline-hidden"
          >
            <option value="karachi">Karachi (UIS)</option>
            <option value="mwl">Muslim World League (MWL)</option>
            <option value="makkah">Umm al-Qura (Makkah)</option>
            <option value="isna">ISNA (North America)</option>
            <option value="egypt">Egyptian Authority</option>
          </select>
        </div>
      </div>

      {locationError && (
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs">
          {locationError}
        </div>
      )}

      {/* Hero Countdown Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#022c22] p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[#fbbf24] text-xs font-semibold mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upcoming Salah • الصلاة القادمة</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {schedule.nextPrayer.name} at {schedule.nextPrayer.time}
            </h2>

            <p className="text-emerald-100 text-sm mt-1.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#fbbf24]" />
              <span>In approximately <strong className="text-white text-base font-bold">{schedule.nextPrayer.diffFormatted}</strong> ({schedule.nextPrayer.diffMinutes} mins remaining)</span>
            </p>
          </div>

          {/* Adhan Audio Button & Clock */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={handleToggleAdhan}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-md active:scale-95 ${
                isPlayingAdhan
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-900 animate-pulse'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
              }`}
            >
              {isPlayingAdhan ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Stop Adhan Audio</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Listen Makkah Adhan</span>
                </>
              )}
            </button>

            <div className="px-4 py-2 rounded-2xl bg-black/20 backdrop-blur-xs border border-white/10 text-right">
              <span className="text-[10px] text-emerald-200 uppercase font-bold block">Current Local Time</span>
              <span className="font-mono text-sm font-bold text-[#fbbf24]">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Prayer Times Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {prayerCards.map((p) => {
          const isNext = schedule.nextPrayer.name === p.name;
          const IconComp = p.icon;

          return (
            <div
              key={p.name}
              className={`p-4 rounded-2xl border transition-all duration-200 ${
                isNext
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500/80 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold ${isNext ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500'}`}>
                  {p.name}
                </span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isNext ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  <IconComp className="w-4 h-4" />
                </div>
              </div>

              <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                {p.time}
              </p>

              <span className="text-[10px] text-slate-400 mt-1 block truncate">
                {p.desc}
              </span>

              {isNext && (
                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Next Up
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
