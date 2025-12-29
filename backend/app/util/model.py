from enum import Enum

from deep_translator import GoogleTranslator  # type: ignore
from .languages import Language


class TextTranslator:
    """Uses Google Translate to convert text from one language to another."""

    LANGUAGE_MODEL_CONFIG = {Language.ENGLISH: "en", Language.MANDARIN: "zh-TW"}

    @staticmethod
    def translate(
        text: str, source: Language, target: Language = Language.ENGLISH
    ) -> str:
        return GoogleTranslator(
            TextTranslator.LANGUAGE_MODEL_CONFIG[source],
            TextTranslator.LANGUAGE_MODEL_CONFIG[target],
        ).translate(text)


class LanguageMode(Enum):
    AUDIO = "AUDIO"
    TEXT = "TEXT"
