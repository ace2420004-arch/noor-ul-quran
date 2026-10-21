/**
 * Precise astronomical solar prayer times & Qibla calculator for Noor-ul-Quran.
 * Fully offline, supporting standard juristic methods and global cities.
 */

export interface PrayerTimeSchedule {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  rawDates: {
    fajr: Date;
    sunrise: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
  };
  nextPrayer: {
    name: 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
    time: string;
    diffMinutes: number;
    diffFormatted: string;
    targetDate: Date;
  };
}

export type JuristicMethod = 'shafii' | 'hanafi';
export type CalculationMethod = 'mwl' | 'isna' | 'makkah' | 'karachi' | 'egypt';

export interface CityPreset {
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezoneOffset?: number; // fallback
}

export const GLOBAL_CITIES: CityPreset[] = [
  { name: 'Makkah', country: 'Saudi Arabia', lat: 21.4225, lng: 39.8262 },
  { name: 'Madinah', country: 'Saudi Arabia', lat: 24.4672, lng: 39.6111 },
  { name: 'Jerusalem (Al-Quds)', country: 'Palestine', lat: 31.7683, lng: 35.2137 },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784 },
  { name: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011 },
  { name: 'Lahore', country: 'Pakistan', lat: 31.5204, lng: 74.3587 },
  { name: 'Islamabad', country: 'Pakistan', lat: 33.6844, lng: 73.0479 },
  { name: 'Delhi', country: 'India', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
  { name: 'Hyderabad', country: 'India', lat: 17.3850, lng: 78.4867 },
  { name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125 },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708 },
  { name: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lng: 46.6753 },
  { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lng: 101.6869 },
  { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
];

// Kaaba Coordinates
export const KAABA_LAT = 21.422487;
export const KAABA_LNG = 39.826206;

/**
 * Calculates Great Circle Qibla bearing in degrees from north (0-360) and distance in km
 */
export function calculateQiblaDirection(userLat: number, userLng: number): {
  bearingDegrees: number;
  cardinal: string;
  distanceKm: number;
} {
  const phi1 = (userLat * Math.PI) / 180;
  const lambda1 = (userLng * Math.PI) / 180;
  const phi2 = (KAABA_LAT * Math.PI) / 180;
  const lambda2 = (KAABA_LNG * Math.PI) / 180;

  const deltaLambda = lambda2 - lambda1;

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = (bearing + 360) % 360;

  // Cardinal direction
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const dirIdx = Math.round(bearing / 22.5) % 16;
  const cardinal = directions[dirIdx];

  // Haversine distance in km
  const R = 6371; // Earth radius in km
  const deltaPhi = phi2 - phi1;
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  return {
    bearingDegrees: Math.round(bearing * 10) / 10,
    cardinal,
    distanceKm,
  };
}

/**
 * Math helpers
 */
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

function getJulianDay(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}

function getSunCoordinates(jd: number) {
  const d = jd - 2451545.0;
  const g = (357.529 + 0.98560028 * d) % 360;
  const q = (280.459 + 0.98564736 * d) % 360;
  const L = (q + 1.915 * Math.sin(rad(g)) + 0.02 * Math.sin(rad(2 * g))) % 360;
  const e = 23.439 - 0.00000036 * d;

  const sinL = Math.sin(rad(L));
  const cosL = Math.cos(rad(L));
  const sinE = Math.sin(rad(e));
  const cosE = Math.cos(rad(e));

  // Right Ascension & Declination
  let RA = deg(Math.atan2(cosE * sinL, cosL)) / 15;
  if (RA < 0) RA += 24;
  const declination = deg(Math.asin(sinE * sinL));

  // Equation of Time in hours
  let EoT = q / 15 - RA;
  if (EoT > 12) EoT -= 24;
  if (EoT < -12) EoT += 24;

  return { declination, EoT };
}

/**
 * Calculates prayer times for a given date, coordinate, juristic method and convention.
 */
export function calculatePrayerTimes(
  date: Date = new Date(),
  latitude: number = 21.4225,
  longitude: number = 39.8262,
  method: CalculationMethod = 'karachi',
  juristic: JuristicMethod = 'hanafi'
): PrayerTimeSchedule {
  const timezoneOffsetHours = -date.getTimezoneOffset() / 60;
  const jd = getJulianDay(date);
  const { declination, EoT } = getSunCoordinates(jd);

  // Solar noon
  const noon = 12 + timezoneOffsetHours - longitude / 15 - EoT;

  // Angles for calculation methods
  let fajrAngle = 18;
  let ishaAngle = 18;

  if (method === 'mwl') {
    fajrAngle = 18;
    ishaAngle = 17;
  } else if (method === 'isna') {
    fajrAngle = 15;
    ishaAngle = 15;
  } else if (method === 'makkah') {
    fajrAngle = 18.5;
    ishaAngle = 18.5;
  } else if (method === 'egypt') {
    fajrAngle = 19.5;
    ishaAngle = 17.5;
  }

  // Hour angle for horizon (-0.833° for refraction and sun diameter)
  const calcHourAngle = (angle: number) => {
    const val =
      (Math.sin(rad(angle)) - Math.sin(rad(latitude)) * Math.sin(rad(declination))) /
      (Math.cos(rad(latitude)) * Math.cos(rad(declination)));
    if (val > 1 || val < -1) return 0;
    return deg(Math.acos(val)) / 15;
  };

  const sunAngleT = calcHourAngle(-0.833);
  const fajrT = calcHourAngle(-fajrAngle);
  const ishaT = calcHourAngle(-ishaAngle);

  // Asr calculation (Shafi'i shadow factor 1, Hanafi shadow factor 2)
  const asrFactor = juristic === 'hanafi' ? 2 : 1;
  const asrAlt = deg(Math.atan(1 / (asrFactor + Math.tan(rad(Math.abs(latitude - declination))))));
  const asrT = calcHourAngle(asrAlt);

  // Times in decimal hours
  const fajrDec = noon - fajrT;
  const sunriseDec = noon - sunAngleT;
  const dhuhrDec = noon + 0.05; // ~3 mins after zenith
  const asrDec = noon + asrT;
  const maghribDec = noon + sunAngleT + 0.03; // ~2 mins after sunset
  const ishaDec = method === 'makkah' ? maghribDec + 1.5 : noon + ishaT;

  const toDate = (decHours: number): Date => {
    const res = new Date(date);
    const hrs = Math.floor(decHours);
    const mins = Math.floor((decHours - hrs) * 60);
    const secs = Math.floor(((decHours - hrs) * 60 - mins) * 60);
    res.setHours(hrs, mins, secs, 0);
    return res;
  };

  const formatTime = (d: Date): string => {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const dFajr = toDate(fajrDec);
  const dSunrise = toDate(sunriseDec);
  const dDhuhr = toDate(dhuhrDec);
  const dAsr = toDate(asrDec);
  const dMaghrib = toDate(maghribDec);
  const dIsha = toDate(ishaDec);

  // Determine next upcoming prayer
  const now = new Date();
  const scheduleItems: { name: PrayerTimeSchedule['nextPrayer']['name']; target: Date }[] = [
    { name: 'Fajr', target: dFajr },
    { name: 'Sunrise', target: dSunrise },
    { name: 'Dhuhr', target: dDhuhr },
    { name: 'Asr', target: dAsr },
    { name: 'Maghrib', target: dMaghrib },
    { name: 'Isha', target: dIsha },
  ];

  let nextP = scheduleItems.find((s) => s.target.getTime() > now.getTime());
  if (!nextP) {
    // Past Isha -> Next is tomorrow's Fajr
    const tomorrowFajr = new Date(dFajr);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    nextP = { name: 'Fajr', target: tomorrowFajr };
  }

  const diffMs = Math.max(0, nextP.target.getTime() - now.getTime());
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const hrsRemain = Math.floor(diffMins / 60);
  const minsRemain = diffMins % 60;
  const diffFormatted = hrsRemain > 0 ? `${hrsRemain}h ${minsRemain}m` : `${minsRemain}m`;

  return {
    fajr: formatTime(dFajr),
    sunrise: formatTime(dSunrise),
    dhuhr: formatTime(dDhuhr),
    asr: formatTime(dAsr),
    maghrib: formatTime(dMaghrib),
    isha: formatTime(dIsha),
    rawDates: {
      fajr: dFajr,
      sunrise: dSunrise,
      dhuhr: dDhuhr,
      asr: dAsr,
      maghrib: dMaghrib,
      isha: dIsha,
    },
    nextPrayer: {
      name: nextP.name,
      time: formatTime(nextP.target),
      diffMinutes: diffMins,
      diffFormatted,
      targetDate: nextP.target,
    },
  };
}
