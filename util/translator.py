from deep_translator import GoogleTranslator  # type: ignore

from util.languages import Language


class TextTranslator:
    LANGUAGE_MODEL_CONFIG = {Language.ENGLISH: "en", Language.MANDARIN: "zh-TW"}

    @staticmethod
    def translate(text: str, target: Language = Language.ENGLISH) -> str:
        return GoogleTranslator(
            "auto", TextTranslator.LANGUAGE_MODEL_CONFIG[target]
        ).translate(text)
