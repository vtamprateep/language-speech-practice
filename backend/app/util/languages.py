from enum import Enum


class Language(str, Enum):
    MANDARIN = "MANDARIN"
    ENGLISH = "ENGLISH"


whisper_languages = {
    "English": "en",
    "Spanish": "es",
    "French": "fr",
    "German": "de",
    "Italian": "it",
    "Portuguese": "pt",
    "Polish": "pl",
    "Dutch": "nl",
    "Russian": "ru",
    "Ukrainian": "uk",
    "Czech": "cs",
    "Arabic": "ar",
    "Chinese": "zh",
    "Japanese": "ja",
    "Korean": "ko",
    "Hindi": "hi",
    "Turkish": "tr",
    "Vietnamese": "vi",
    "Thai": "th",
    "Greek": "el",
    "Romanian": "ro",
    "Hungarian": "hu",
    "Swedish": "sv",
    "Finnish": "fi",
    "Norwegian": "no",
    "Danish": "da",
    "Hebrew": "he",
    "Indonesian": "id",
    "Malay": "ms",
    "Filipino": "fil",
    "Bengali": "bn",
    "Tamil": "ta",
    "Telugu": "te",
    "Marathi": "mr",
    "Gujarati": "gu",
    "Kannada": "kn",
    "Malayalam": "ml",
    "Punjabi": "pa",
    "Urdu": "ur",
    "Swahili": "sw",
}
