import uuid
from dataclasses import dataclass
from enum import Enum
from typing import Any

import librosa
import numpy as np
from deep_translator import GoogleTranslator  # type: ignore

# from kokoro import KPipeline  # type: ignore
from transformers import (
    AutoModel,
    AutoModelForCausalLM,
    AutoModelForSpeechSeq2Seq,
    AutoProcessor,
    AutoTokenizer,
    BlenderbotForConditionalGeneration,
    BlenderbotTokenizer,
    pipeline,
)

from .languages import Language


@dataclass
class AudioData:
    sampling_rate: int
    raw: np.ndarray


# class KokoroModel:
#     """
#     🇺🇸 'a' => American English, 🇬🇧 'b' => British English
#     🇪🇸 'e' => Spanish es
#     🇫🇷 'f' => French fr-fr
#     🇮🇳 'h' => Hindi hi
#     🇮🇹 'i' => Italian it
#     🇯🇵 'j' => Japanese: pip install misaki[ja]
#     🇧🇷 'p' => Brazilian Portuguese pt-br
#     🇨🇳 'z' => Mandarin Chinese: pip install misaki[zh]
#     """

#     LANGUAGE_MODEL_CONFIG = {Language.ENGLISH: "a", Language.MANDARIN: "z"}

#     def _setup_pipeline(self, language: Language):
#         return KPipeline(lang_code=self.LANGUAGE_MODEL_CONFIG[language])

#     def run_inference(
#         self,
#         input: str,
#         language: Language,
#         voice: str = "af_heart",
#         speed: int = 1,
#         split_pattern: str = r"\n+",
#     ) -> AudioData:
#         pipeline = self._setup_pipeline(language)
#         audio_segments = [
#             audio for _, _, audio in pipeline(input, voice, speed, split_pattern)
#         ]
#         audio_data = np.concatenate(audio_segments)
#         return AudioData(24000, audio_data)


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
