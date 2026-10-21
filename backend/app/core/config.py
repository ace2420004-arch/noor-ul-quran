import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "Noor-ul-Quran"
    PROJECT_NAME_ARABIC: str = "نور القرآن"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./noor_ul_quran.db")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Audio CDNs
    AUDIO_CDNS: dict[str, str] = {
        "alafasy": "https://everyayah.com/data/Alafasy_128kbps",
        "abdulbasit": "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps",
        "alhusary": "https://everyayah.com/data/Husary_128kbps",
        "alghamdi": "https://everyayah.com/data/Ghamadi_40kbps",
        "minshawi": "https://everyayah.com/data/Minshawy_Murattal_128kbps",
    }
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "noor-ul-quran-dev-secret-key-change-in-prod-123456789")

settings = Settings()
