from fastapi import APIRouter

router = APIRouter(prefix="/learning", tags=["Learning Academy"])

COURSES = [
    {
        "id": "quran_foundations",
        "title": "Quran Reading Foundations",
        "title_ar": "أسس قراءة القرآن الكريم",
        "level": "Beginner",
        "lessons_count": 8,
        "description": "Master Arabic letters, vowels (harakat), tanween, sukun, and essential recitation rules.",
        "progress_percent": 60,
        "flashcards": [
            {"arabic": "بِسْمِ", "transliteration": "Bismi", "meaning": "In the name of", "root": "س م و"},
            {"arabic": "ٱلرَّحْمَـٰنِ", "transliteration": "Ar-Rahman", "meaning": "The Entirely Merciful (Universal Grace)", "root": "ر ح م"},
            {"arabic": "ٱلْحَمْدُ", "transliteration": "Al-Hamd", "meaning": "All praise and gratitude", "root": "ح م د"},
            {"arabic": "ٱلْعَـٰلَمِينَ", "transliteration": "Al-Alamin", "meaning": "All creation and worlds", "root": "ع ل م"},
        ],
        "quiz": {
            "title": "Surah Al-Fatihah Comprehension Quiz",
            "questions": [
                {
                    "id": 1,
                    "question": "What does the root 'R-H-M' (ر ح م) signify in Arabic?",
                    "options": ["Judgment and punishment", "Boundless tender mercy and compassionate love", "Kingdom and majesty", "Knowledge and science"],
                    "correct_index": 1,
                    "explanation": "R-H-M denotes compassion and womb-like tender mercy, forming divine names Ar-Rahman and Ar-Rahim."
                },
                {
                    "id": 2,
                    "question": "In Ayah 1:5 ('Iyyaka na'budu'), what does the grammatical structure denote?",
                    "options": ["Past tense action", "Exclusive dedication of worship to Allah alone", "A passive request", "Conditional command"],
                    "correct_index": 1,
                    "explanation": "Fronting the object ('Iyyaka') before the verb ('na'budu') signifies exclusivity (hasr) in Arabic grammar."
                }
            ]
        }
    },
    {
        "id": "intro_to_tafsir",
        "title": "Introduction to Tafsir Methodology",
        "title_ar": "مقدمة في أصول التفسير",
        "level": "Intermediate",
        "lessons_count": 6,
        "description": "Understand the principles of interpreting the Quran through the Quran, prophetic Sunnah, and classical Arabic linguistics.",
        "progress_percent": 25,
        "flashcards": [
            {"arabic": "تَفْسِير بِالْمَأْثُور", "transliteration": "Tafsir bi-l-Ma'thur", "meaning": "Commentary based on primary transmitted narrations", "root": "أ ث ر"},
            {"arabic": "أَسْبَاب النُّزُول", "transliteration": "Asbab an-Nuzul", "meaning": "Historical occasions and contexts of revelation", "root": "س ب ب"},
            {"arabic": "مُحْكَم وَمُتَشَابِه", "transliteration": "Muhkam & Mutashabih", "meaning": "Decisive clear verses and allegorical verses", "root": "ح ك م"},
        ],
        "quiz": {
            "title": "Tafsir Principles Assessment",
            "questions": [
                {
                    "id": 1,
                    "question": "What is the highest and most authentic level of Tafsir according to classical scholars?",
                    "options": ["Personal philosophical reasoning", "Tafsir of the Quran by the Quran itself", "Modern scientific concordance", "Grammatical poetry analysis"],
                    "correct_index": 1,
                    "explanation": "Explaining the Quran by the Quran is the supreme form of exegesis because passages elucidate each other."
                }
            ]
        }
    }
]

@router.get("/courses")
def get_courses():
    """Retrieve all structured courses, flashcards, and quizzes."""
    return COURSES

@router.get("/courses/{course_id}")
def get_course(course_id: str):
    """Retrieve details, flashcards, and quiz for a specific course."""
    for c in COURSES:
        if c["id"] == course_id:
            return c
    return COURSES[0]
