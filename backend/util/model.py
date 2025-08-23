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


class ConversationGeneratorModel:
    MAX_INPUT_TOKENS = 128

    def __init__(self, model_id: str = "facebook/blenderbot-400M-distill"):
        self.tokenizer = BlenderbotTokenizer.from_pretrained(model_id)
        self.model = BlenderbotForConditionalGeneration.from_pretrained(
            model_id, use_safetensors=True
        )
        self.history: list[str] = []

    def _truncate_history(self) -> None:
        input_length = 0
        for i in range(len(self.history) - 1, -1, -1):
            input_string = self.history[i]
            input_token = self.tokenizer(input_string, return_tensors="pt")
            input_length += input_token["input_ids"].size(dim=1)

            if input_length > self.MAX_INPUT_TOKENS:
                self.history.pop(i)

    def run_inference(self, input: str) -> str:
        self.history.append(f"User: {input}")
        self._truncate_history()

        context = "\n".join(self.history)
        input_token = self.tokenizer(context, return_tensors="pt")
        reply_ids = self.model.generate(**input_token)
        response = self.tokenizer.decode(reply_ids[0], skip_special_tokens=True)

        self.history.append(f"Bot: {response}")
        return response


class TextToSpeechModel:
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
    PIPE: KPipeline = None

    def __init__(self, language: Language) -> None:
        self.PIPE = KPipeline(lang_code=self.LANGUAGE_MODEL_CONFIG[language])

    def run_inference(
        self,
        input: str,
        voice: str = "af_heart",
        speed: int = 1,
        split_pattern: str = r"\n+",
    ) -> AudioData:
        audio_segments = [
            audio for _, _, audio in self.PIPE(input, voice, speed, split_pattern)
        ]
        audio_data = np.concatenate(audio_segments)
        return AudioData(24000, audio_data)


class QwenCausalLM:
    _instance = None

    def __init__(
        self,
        model_name: str = "Qwen/Qwen1.5-0.5B-Chat",
        device: str = "cpu",
        torch_dtype=torch.float32,
        trust_remote_code: bool = True,
        max_new_tokens: int = 50,
    ):
        if QwenCausalLM._instance is not None:
            raise Exception(
                "Use QwenCausalLM.get_instance() to access the singleton instance"
            )

        self.device = device
        self.max_new_tokens = max_new_tokens
        self.tokenizer = AutoTokenizer.from_pretrained(
            model_name, trust_remote_code=trust_remote_code
        )

        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            trust_remote_code=trust_remote_code,
            torch_dtype=torch_dtype,
            device_map=device,
        ).to(device)

        self.pad_token_id = self.tokenizer.pad_token_id or self.tokenizer.eos_token_id
        self.eos_token_id = self.tokenizer.eos_token_id

        self.session_messages: dict = dict()

        QwenCausalLM._instance = self

    @classmethod
    def _get_instance(cls):
        if cls._instance is None:
            cls()
        return cls._instance

    @classmethod
    def run_inference(
        cls,
        prompt: str,
        session_id: str,
        temperature: float = 0.7,
        top_p: float = 0.9,
        do_sample: bool = True,
        enable_thinking: bool = False,
        return_full_text: bool = False,
    ) -> str:
        instance = cls._get_instance()
        return instance._run_inference(
            prompt,
            session_id,
            temperature,
            top_p,
            do_sample,
            enable_thinking,
            return_full_text,
        )

    def _run_inference(
        self,
        prompt: str,
        session_id: str,
        temperature: float,
        top_p: float,
        do_sample: bool,
        enable_thinking: bool,
        return_full_text: bool,
    ) -> str:
        self._add_user_prompt(prompt, session_id)
        text = self.tokenizer.apply_chat_template(
            self.session_messages,
            tokenize=False,
            add_generation_prompt=True,
            enable_thinking=enable_thinking,
        )
        inputs = self.tokenizer(text, return_tensors="pt").to(self.device)

        output_ids = self.model.generate(
            inputs.input_ids,
            max_new_tokens=self.max_new_tokens,
            temperature=temperature,
            top_p=top_p,
            do_sample=do_sample,
            pad_token_id=self.pad_token_id,
            eos_token_id=self.eos_token_id,
        )

        decoded_full_text = self.tokenizer.decode(
            output_ids[0], skip_special_tokens=True
        )

        prompt_len = inputs.input_ids.shape[-1]
        new_tokens = output_ids[0][prompt_len:]
        decoded_new_tokens = self.tokenizer.decode(
            new_tokens, skip_special_tokens=True
        ).strip()

        self.session_messages[session_id].append(
            {"role": "assistant", "content": decoded_new_tokens}
        )

        if return_full_text:
            return decoded_full_text

        return decoded_new_tokens

    @classmethod
    def add_system_prompt(cls, prompt: str, session_id: str) -> None:
        instance = cls._get_instance()
        instance.session_messages[session_id].append(
            {"role": "system", "content": prompt}
        )

    @classmethod
    def _add_user_prompt(cls, prompt: str, session_id: str) -> None:
        instance = cls._get_instance()
        instance.session_messages[session_id].append(
            {
                "role": "user",
                "content": prompt,
            }
        )

    @classmethod
    def delete_session(cls, session_id: str) -> None:
        instance = cls._get_instance()
        instance.session_messages.pop(session_id)

    @classmethod
    def create_session(cls) -> str:
        session_uuid = str(uuid.uuid4())
        instance = cls._get_instance()
        instance.session_messages[session_uuid] = []
        return session_uuid


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


class MandarinTranslator:
    """Class that can take any type of Mandarin inputs, convert them to English,
    and then back to the target form and language.
    """

    def translate_to_english(self, input: str | AudioData) -> str:
        if isinstance(input, AudioData):
            voice_transcriber = WhisperModel(Language.MANDARIN)
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
