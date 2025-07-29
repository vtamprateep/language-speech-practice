from enum import Enum

from deep_translator import GoogleTranslator  # type: ignore

from util.model import SpeechToTextModel, TextToSpeechModel
from util.types import AudioData, LanguageMode


class Language(Enum):
    MANDARIN = "MANDARIN"
    ENGLISH = "ENGLISH"


class TextTranslator:
    """Uses Google Translate to convert text from one language to another."""

    LANGUAGE_MODEL_CONFIG = {Language.ENGLISH: "en", Language.MANDARIN: "zh-TW"}

    @staticmethod
    def translate(text: str, target: Language = Language.ENGLISH) -> str:
        return GoogleTranslator(
            "auto", TextTranslator.LANGUAGE_MODEL_CONFIG[target]
        ).translate(text)


class MandarinTranslator:
    """Class that can take any type of Mandarin inputs, convert them to English,
    and then back to the target form and language.
    """

    def translate_to_english(self, input: str | AudioData) -> str:
        if isinstance(input, AudioData):
            voice_transcriber = SpeechToTextModel(Language.MANDARIN)
            captioned_text = voice_transcriber.run_inference(input)["text"]  # type: ignore
            return TextTranslator.translate(captioned_text, Language.MANDARIN)

        return TextTranslator.translate(input, Language.MANDARIN)

    def translate_to_mandarin(self, input: str, mode: LanguageMode) -> str | AudioData:
        translated_text = TextTranslator.translate(input, Language.MANDARIN)

        if mode == LanguageMode.TEXT:
            return translated_text

        tts_model = TextToSpeechModel(Language.MANDARIN)
        translated_audio = tts_model.run_inference(translated_text)
        return translated_audio


class ModelLanguageConfig:
    pass


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
