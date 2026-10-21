import React, { useState, useRef } from 'react';
import {
  Compass,
  Navigation,
  CheckCircle2,
  RotateCw,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import {
  calculateQiblaDirection,
  GLOBAL_CITIES,
  type CityPreset
} from '../../utils/prayerTimes';

export const QiblaCompassWidget: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityPreset>(GLOBAL_CITIES[8]); // Delhi default
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Compass rotation & sensor state
  const [viewMode, setViewMode] = useState<'fixed_north' | 'heading'>('fixed_north');
  const [heading, setHeading] = useState<number>(0); // Current compass/device heading (0 = North)
  const [sensorActive, setSensorActive] = useState<boolean>(false);
  const [sensorError, setSensorError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const compassDialRef = useRef<HTMLDivElement | null>(null);

  const qibla = calculateQiblaDirection(selectedCity.lat, selectedCity.lng);

  // Auto detect GPS
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('GPS not supported in this browser.');
      return;
    }
    setIsDetecting(true);
    setLocationStatus('Locating your position via GPS...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetecting(false);
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setSelectedCity({
          name: 'My Current Location (GPS)',
          country: `${userLat.toFixed(2)}°N, ${userLng.toFixed(2)}°E`,
          lat: userLat,
          lng: userLng,
        });
        setLocationStatus('Location updated to your exact GPS coordinates!');
        setTimeout(() => setLocationStatus(null), 3500);
      },
      (err) => {
        setIsDetecting(false);
        setLocationStatus('Could not access GPS. Please select your city from the list.');
        console.warn('Geolocation error:', err);
        setTimeout(() => setLocationStatus(null), 4000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Mobile Gyroscope / Compass Sensor Activation
  const requestSensorPermission = async () => {
    setSensorError(null);

    // iOS 13+ requires explicit permission request
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          attachOrientationListeners();
        } else {
          setSensorError('Sensor permission was denied on this device.');
        }
      } catch (err) {
        setSensorError('Error requesting device orientation permission.');
      }
    } else if ('ondeviceorientationabsolute' in window) {
      // Android Chrome with true absolute north
      attachOrientationListeners();
    } else if ('ondeviceorientation' in window) {
      attachOrientationListeners();
    } else {
      setSensorError('Hardware compass/gyroscope is not available on this computer/browser.');
    }
  };

  const attachOrientationListeners = () => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // 1. iOS Safari provides webkitCompassHeading (0 to 360, where 0 is true North)
      if ((e as any).webkitCompassHeading !== undefined) {
        const compassHeading = (e as any).webkitCompassHeading;
        setHeading(Math.round(compassHeading));
        setSensorActive(true);
        setViewMode('heading');
        return;
      }

      // 2. Android Chrome with absolute alpha
      if (e.alpha !== null && e.alpha !== undefined) {
        // e.alpha is counter-clockwise, invert to clockwise compass heading
        let compassHeading = 360 - e.alpha;
        setHeading(Math.round(compassHeading) % 360);
        setSensorActive(true);
        setViewMode('heading');
      }
    };

    if ('ondeviceorientationabsolute' in window) {
      (window as any).addEventListener('deviceorientationabsolute', handleOrientation, true);
    } else {
      (window as any).addEventListener('deviceorientation', handleOrientation, true);
    }

    setSensorActive(true);
    setViewMode('heading');
  };

  // Mouse / Touch Drag-to-Rotate on the Compass Dial
  const handleDialPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateHeadingFromPointer(e);
  };

  const handleDialPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateHeadingFromPointer(e);
  };

  const handleDialPointerUp = () => {
    setIsDragging(false);
  };

  const updateHeadingFromPointer = (e: React.PointerEvent) => {
    if (!compassDialRef.current) return;
    const rect = compassDialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Angle in degrees from top (0 = North)
    let angleDeg = (Math.atan2(deltaY, deltaX) * 180) / Math.PI + 90;
    if (angleDeg < 0) angleDeg += 360;

    setHeading(Math.round(angleDeg));
    setViewMode('heading');
  };

  // Plain language direction instruction
  const getDirectionAdvice = () => {
    const b = qibla.bearingDegrees;
    let mainDirection = 'West';
    let tiltAdvice = '';

    if (b >= 250 && b <= 290) {
      mainDirection = 'West (Maghrib)';
      const diff = b - 270;
      if (Math.abs(diff) < 2) {
        tiltAdvice = 'Face directly West';
      } else if (diff < 0) {
        tiltAdvice = `Face West and turn ${Math.abs(Math.round(diff))}° slightly to your Left (South)`;
      } else {
        tiltAdvice = `Face West and turn ${Math.round(diff)}° slightly to your Right (North)`;
      }
    } else if (b >= 40 && b <= 80) {
      mainDirection = 'North-East (Ishan)';
      tiltAdvice = `Face North-East (${Math.round(b)}°)`;
    } else if (b >= 100 && b <= 160) {
      mainDirection = 'South-East';
      tiltAdvice = `Face South-East (${Math.round(b)}°)`;
    } else {
      tiltAdvice = `Face ${qibla.cardinal} (${Math.round(b)}° from North)`;
    }

    return { mainDirection, tiltAdvice };
  };

  const advice = getDirectionAdvice();

  // Needle and Dial Rotations
  // In 'fixed_north': Dial is fixed (North at top). Needle points to qibla.bearingDegrees.
  // In 'heading': Dial rotates by -heading so device orientation is up. Needle points to (qibla.bearingDegrees - heading).
  const dialRotation = viewMode === 'heading' ? -heading : 0;
  const needleRotation = viewMode === 'heading'
    ? (qibla.bearingDegrees - heading + 360) % 360
    : qibla.bearingDegrees;

  // Aligned when needle is within ±5° of 12 o'clock in heading mode, or within ±5° in fixed mode
  const isAligned = viewMode === 'heading'
    ? (needleRotation <= 5 || needleRotation >= 355)
    : false;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
      {/* Top Header & City Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-[#fbbf24] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>Qibla Direction & Kaaba Compass</span>
                <span className="text-xs font-arabic text-emerald-600 dark:text-[#fbbf24]">
                  اتجاه القبلة الشريفة
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Exact great-circle bearing to the Holy Kaaba ({qibla.bearingDegrees}° {qibla.cardinal})
              </p>
            </div>
          </div>
        </div>

        {/* City Picker & GPS button */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedCity.name}
              onChange={(e) => {
                const city = GLOBAL_CITIES.find((c) => c.name === e.target.value);
                if (city) setSelectedCity(city);
              }}
              className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden"
            >
              {GLOBAL_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}, {c.country}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50"
            title="Auto detect my GPS location"
          >
            <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Use GPS</span>
          </button>
        </div>
      </div>

      {locationStatus && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{locationStatus}</span>
        </div>
      )}

      {/* Main Grid: Compass Dial on Left, Telemetry & Practical Guidance on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Column: Interactive Compass Dial */}
        <div className="md:col-span-7 flex flex-col items-center justify-center select-none">
          {/* Compass Display Mode Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold mb-4">
            <button
              onClick={() => setViewMode('fixed_north')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'fixed_north'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              North Up (Fixed Dial)
            </button>
            <button
              onClick={() => setViewMode('heading')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'heading'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Live Compass (Rotatable)
            </button>
          </div>

          {/* Interactive Dial with Pointer Events (Click & Drag supported on PC / Mobile) */}
          <div
            ref={compassDialRef}
            onPointerDown={handleDialPointerDown}
            onPointerMove={handleDialPointerMove}
            onPointerUp={handleDialPointerUp}
            className="relative w-64 h-64 sm:w-80 sm:h-80 cursor-grab active:cursor-grabbing touch-none"
            title="Click and drag to rotate compass dial"
          >
            {/* Outer Compass Bezel */}
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full drop-shadow-2xl transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${dialRotation}deg)` }}
            >
              {/* Dial Background */}
              <circle
                cx="100"
                cy="100"
                r="95"
                className="fill-slate-50 dark:fill-slate-950 stroke-emerald-800 dark:stroke-emerald-600"
                strokeWidth="3.5"
              />
              <circle
                cx="100"
                cy="100"
                r="86"
                className="fill-none stroke-amber-500/40 dark:stroke-amber-400/30"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Cardinal Letters */}
              <text x="100" y="24" textAnchor="middle" className="text-[14px] font-black fill-red-600">N</text>
              <text x="180" y="105" textAnchor="middle" className="text-[12px] font-bold fill-slate-500">E</text>
              <text x="100" y="185" textAnchor="middle" className="text-[12px] font-bold fill-slate-500">S</text>
              <text x="22" y="105" textAnchor="middle" className="text-[12px] font-bold fill-slate-500">W</text>

              {/* 30-degree tick lines */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 100 + 86 * Math.sin(angle);
                const y1 = 100 - 86 * Math.cos(angle);
                const x2 = 100 + 78 * Math.sin(angle);
                const y2 = 100 - 78 * Math.cos(angle);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className="stroke-slate-400 dark:stroke-slate-600"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Degree numbers */}
              <text x="100" y="38" textAnchor="middle" className="text-[7px] fill-slate-400">0°</text>
              <text x="165" y="103" textAnchor="middle" className="text-[7px] fill-slate-400">90°</text>
              <text x="100" y="168" textAnchor="middle" className="text-[7px] fill-slate-400">180°</text>
              <text x="35" y="103" textAnchor="middle" className="text-[7px] fill-slate-400">270°</text>
            </svg>

            {/* Qibla Indicator Needle */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${needleRotation}deg)` }}
            >
              <div className="relative w-full h-full flex flex-col items-center">
                {/* Kaaba Badge at needle tip */}
                <div className="absolute top-1 flex flex-col items-center -translate-y-1/2">
                  <span className="text-2xl filter drop-shadow-lg">🕋</span>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 shadow-md uppercase tracking-tight">
                    KAABA
                  </span>
                </div>

                {/* Gilded North-pointing arrow */}
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[72px] border-b-amber-500 mt-7 drop-shadow-md" />

                {/* Hub */}
                <div className="w-7 h-7 rounded-full bg-emerald-900 border-2 border-amber-300 absolute top-1/2 -translate-y-1/2 shadow-lg flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                </div>

                {/* Tail pointer */}
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[48px] border-t-slate-400 absolute bottom-10 opacity-70" />
              </div>
            </div>
          </div>

          {/* Interactive Drag Hint */}
          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Click & drag dial to simulate rotation, or use mobile sensor below.</span>
          </p>

          {/* Alignment Notification */}
          <div className="mt-3">
            {isAligned ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold shadow-md animate-bounce border border-emerald-300 dark:border-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You are facing the Holy Kaaba! 🕋</span>
              </span>
            ) : viewMode === 'heading' ? (
              <span className="text-xs text-slate-500 font-medium">
                Turn your device until the 🕋 Kaaba pointer is at the very top (12 o'clock).
              </span>
            ) : null}
          </div>
        </div>

        {/* Right Column: Practical Human Guide & Telemetry */}
        <div className="md:col-span-5 space-y-4">
          {/* Practical Plain Language Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#064e3b] to-[#047857] text-white shadow-lg space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#fbbf24] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Easy Standing Direction (سمتِ قبلہ)
            </span>
            <h4 className="text-xl font-bold leading-snug">
              {advice.tiltAdvice}
            </h4>
            <p className="text-xs text-emerald-100 leading-relaxed pt-1 border-t border-white/10">
              In <strong>{selectedCity.name}</strong>, Qibla is located at <strong>{qibla.bearingDegrees}°</strong> ({qibla.cardinal}), approximately {qibla.distanceKm.toLocaleString()} km away.
            </p>
          </div>

          {/* Telemetry Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Exact Angle */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Qibla Bearing</span>
              <p className="text-2xl font-mono font-extrabold text-[#064e3b] dark:text-[#fbbf24]">
                {qibla.bearingDegrees}°
              </p>
              <span className="text-[11px] text-slate-500">{qibla.cardinal} (Clockwise from North)</span>
            </div>

            {/* Distance to Kaaba */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Kaaba Distance</span>
              <p className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white">
                {qibla.distanceKm.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500">Kilometers to Makkah</span>
            </div>
          </div>

          {/* Sensor / Calibrate Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <Smartphone className="w-4 h-4 text-emerald-600 dark:text-[#fbbf24]" />
                <span>Mobile Gyroscope / Compass Sensor</span>
              </div>
              {sensorActive ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Sensor Active ({heading}°)
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Desktop / Manual Mode</span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Agar aap phone me chala rahe hain to neeche button dabakar phone ke live compass ko connect karein. Desktop/laptop me magnetometer sensor nahi hota, isliye dial par mouse se drag karke ya slider se test karein.
            </p>

            {sensorError && (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-[11px]">
                {sensorError}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={requestSensorPermission}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Connect Phone Compass Sensor</span>
              </button>

              <button
                onClick={() => {
                  setHeading(0);
                  setViewMode('fixed_north');
                }}
                className="py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors"
                title="Reset to North"
              >
                Reset
              </button>
            </div>

            {/* Slider for manual rotation */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Manual Device Heading:</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{heading}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="359"
                value={heading}
                onChange={(e) => {
                  setHeading(Number(e.target.value));
                  setViewMode('heading');
                }}
                className="w-full accent-[#064e3b]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
