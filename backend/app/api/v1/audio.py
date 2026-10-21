from fastapi import APIRouter, HTTPException
from backend.app.core.config import settings

router = APIRouter(prefix="/audio", tags=["Audio & Recitation"])

RECITERS = [
    {"id": "alafasy", "name": "Mishary Rashid Alafasy", "name_ar": "مشاري راشد العفاسي", "style": "Murattal", "quality": "128kbps"},
    {"id": "abdulbasit", "name": "Abdul Basit Abdul Samad", "name_ar": "عبد الباسط عبد الصمد", "style": "Classic Murattal", "quality": "192kbps"},
    {"id": "alhusary", "name": "Mahmoud Khalil Al-Husary", "name_ar": "محمود خليل الحصري", "style": "Murattal (Strict Tajweed)", "quality": "128kbps"},
    {"id": "alghamdi", "name": "Saad Al-Ghamdi", "name_ar": "سعد الغامدي", "style": "Murattal", "quality": "40kbps"},
    {"id": "minshawi", "name": "Muhammad Siddiq Al-Minshawi", "name_ar": "محمد صديق المنشاوي", "style": "Murattal", "quality": "128kbps"},
]

@router.get("/reciters")
def list_reciters():
    """List authenticated reciters available for verse-by-verse recitation playback."""
    return RECITERS

@router.get("/ayah/{reciter_id}/{verse_key}")
def get_ayah_audio(reciter_id: str, verse_key: str):
    """Retrieve CDN streaming audio URL for an Ayah and reciter."""
    parts = verse_key.split(":")
    if len(parts) != 2 or not parts[0].isdigit() or not parts[1].isdigit():
        raise HTTPException(status_code=400, detail="Invalid verse_key format. Expected 'surah:ayah' (e.g. '1:1')")

    s_id = int(parts[0])
    v_num = int(parts[1])
    cdn = settings.AUDIO_CDNS.get(reciter_id, settings.AUDIO_CDNS["alafasy"])
    audio_url = f"{cdn}/{s_id:03d}{v_num:03d}.mp3"

    return {
        "verse_key": verse_key,
        "reciter_id": reciter_id,
        "audio_url": audio_url
    }
