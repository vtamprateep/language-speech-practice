import uuid
from dataclasses import dataclass
from enum import Enum
from typing import Any

import librosa
import numpy as np
import torch
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


class SemanticMatcher:
    """Takes two sentences and calculate cosine similarity"""

    _instance = None

    def __init__(
        self,
        model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
    ):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)

    def _embed_text(self, text: str):
        tokens = self.tokenizer(
            text, padding=True, truncation=True, return_tensors="pt"
        )
        with torch.no_grad():
            output = self.model(**tokens)

        return output.last_hidden_state.mean(dim=1).numpy()[0]

    def _cosine_similarity(self, vector_a, vector_b):
        return np.dot(vector_a, vector_b) / (
            np.linalg.norm(vector_a) * np.linalg.norm(vector_b)
        )

    def get_similarity(self, text_1: str, text_2: str):
        vector_a = self._embed_text(text_1)
        vector_b = self._embed_text(text_2)
        return self._cosine_similarity(vector_a, vector_b)


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
