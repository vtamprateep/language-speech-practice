import uuid
from dataclasses import dataclass
from enum import Enum
from typing import Any

import librosa
import numpy as np
import torch
from deep_translator import GoogleTranslator  # type: ignore
from kokoro import KPipeline  # type: ignore
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


class WhisperModel:
    LANGUAGE_MODEL_CONFIG = {Language.ENGLISH: "en", Language.MANDARIN: "zh"}

    class TaskValues(Enum):
        TRANSLATE = "translate"
        TRANSCRIBE = "transcribe"

    def __init__(
        self,
        language: Language = Language.ENGLISH,
        model_id: str = "openai/whisper-tiny",
        device: str = "cpu",
    ):
        self.LANGUAGE = language
        self.MODEL_ID = model_id
        self.DEVICE = device

        self.processor = AutoProcessor.from_pretrained(self.MODEL_ID)
        self.model = AutoModelForSpeechSeq2Seq.from_pretrained(
            self.MODEL_ID,
            torch_dtype=torch.float32,
            low_cpu_mem_usage=True,
            use_safetensors=True,
        )
        self.model.to(self.DEVICE)

        self._setup_pipeline(self.LANGUAGE_MODEL_CONFIG[self.LANGUAGE])

    def _setup_pipeline(self, task: str, language: Language | None = None):
        generate_kwargs = {"language": language} if language else {}
        pipe = pipeline(
            task="automatic-speech-recognition",
            model=self.model,
            tokenizer=self.processor.tokenizer,
            feature_extractor=self.processor.feature_extractor,
            torch_dtype=torch.float32,
            device=self.DEVICE,
            generate_kwargs={"task": task, **generate_kwargs},
        )
        return pipe

    def _resample_audio(self, input: AudioData, target_sample_rate: int) -> AudioData:
        if input.sampling_rate == target_sample_rate:
            return input

        data = librosa.resample(
            input.raw, orig_sr=input.sampling_rate, target_sr=target_sample_rate
        )
        return AudioData(target_sample_rate, data)

    def run_inference(
        self,
        input: AudioData,
        task: TaskValues = "transcribe",  # type: ignore
        source_language: Language | None = None,
    ) -> dict[str, Any] | list[dict[str, Any]]:
        input_resampled = self._resample_audio(input, 16000)
        input_format = {
            "sampling_rate": input_resampled.sampling_rate,
            "raw": input_resampled.raw,
        }

        pipeline = self._setup_pipeline(task=task, language=source_language)  # type: ignore
        return pipeline(inputs=input_format, return_timestamps=True)


class KokoroModel:
    """
    🇺🇸 'a' => American English, 🇬🇧 'b' => British English
    🇪🇸 'e' => Spanish es
    🇫🇷 'f' => French fr-fr
    🇮🇳 'h' => Hindi hi
    🇮🇹 'i' => Italian it
    🇯🇵 'j' => Japanese: pip install misaki[ja]
    🇧🇷 'p' => Brazilian Portuguese pt-br
    🇨🇳 'z' => Mandarin Chinese: pip install misaki[zh]
    """

    LANGUAGE_MODEL_CONFIG = {Language.ENGLISH: "a", Language.MANDARIN: "z"}

    def _setup_pipeline(self, language: Language):
        return KPipeline(lang_code=self.LANGUAGE_MODEL_CONFIG[language])

    def run_inference(
        self,
        input: str,
        language: Language,
        voice: str = "af_heart",
        speed: int = 1,
        split_pattern: str = r"\n+",
    ) -> AudioData:
        pipeline = self._setup_pipeline(language)
        audio_segments = [
            audio for _, _, audio in pipeline(input, voice, speed, split_pattern)
        ]
        audio_data = np.concatenate(audio_segments)
        return AudioData(24000, audio_data)


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
