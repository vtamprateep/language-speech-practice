from deep_translator import GoogleTranslator  # type: ignore


class TextTranslator:

    @staticmethod
    def translate(text: str, target: str = "en", source: str = "auto") -> str:
        return GoogleTranslator(source, target).translate(text)
