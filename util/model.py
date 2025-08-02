from typing import Any

import numpy as np
import torch
from deep_translator import GoogleTranslator  # type: ignore
from kokoro import KPipeline  # type: ignore
from transformers import (AutoModelForCausalLM, AutoModelForSpeechSeq2Seq,
                          AutoProcessor, AutoTokenizer,
                          BlenderbotForConditionalGeneration,
                          BlenderbotTokenizer, pipeline)

from .languages import Language
from .types import AudioData, LanguageMode


class SpeechToTextModel:
    LANGUAGE_MODEL_CONFIG = {Language.ENGLISH: "en", Language.MANDARIN: "zh"}

    def __init__(
        self,
        language: Language = Language.ENGLISH,
        model_id: str = "openai/whisper-tiny",
        device: str = "cpu",
    ):
        self.LANGUAGE = language
        self.MODEL_ID = model_id
        self.DEVICE = device

        self._setup_pipeline(self.LANGUAGE_MODEL_CONFIG[self.LANGUAGE])

    def _setup_pipeline(self, language: str):
        generate_kwargs = {"language": language} if language else {}

        processor = AutoProcessor.from_pretrained(self.MODEL_ID)
        model = AutoModelForSpeechSeq2Seq.from_pretrained(
            self.MODEL_ID,
            torch_dtype=torch.float32,
            low_cpu_mem_usage=True,
            use_safetensors=True,
        )
        model.to(self.DEVICE)

        self.TRANSCRIBE_PIPE = pipeline(
            "automatic-speech-recognition",
            model=model,
            tokenizer=processor.tokenizer,
            feature_extractor=processor.feature_extractor,
            torch_dtype=torch.float32,
            device=self.DEVICE,
            generate_kwargs={"task": "transcribe", **generate_kwargs},
        )

        if language:
            self.TRANSLATE_PIPE = pipeline(
                "automatic-speech-recognition",
                model=model,
                tokenizer=processor.tokenizer,
                feature_extractor=processor.feature_extractor,
                torch_dtype=torch.float32,
                device=self.DEVICE,
                generate_kwargs={"task": "translate", **generate_kwargs},
            )

    def run_inference(
        self, input: AudioData, task: str = "transcribe"
    ) -> dict[str, Any] | list[dict[str, Any]]:
        input_format = {"sampling_rate": input.sampling_rate, "raw": input.raw}
        if task == "transcribe":
            return self.TRANSCRIBE_PIPE(inputs=input_format, return_timestamps=True)
        else:
            return self.TRANSLATE_PIPE(inputs=input_format, return_timestamps=True)


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
        self.messages: list[dict] = []

        QwenCausalLM._instance = self

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls()
        return cls._instance

    @classmethod
    def run_inference(
        cls,
        prompt: str,
        temperature: float = 0.7,
        top_p: float = 0.9,
        do_sample: bool = True,
        enable_thinking: bool = False,
        return_full_text: bool = False,
    ) -> str:
        instance = cls.get_instance()
        return instance._run_inference(
            prompt, temperature, top_p, do_sample, enable_thinking, return_full_text
        )

    def _run_inference(
        self,
        prompt: str,
        temperature: float,
        top_p: float,
        do_sample: bool,
        enable_thinking: bool,
        return_full_text: bool,
    ) -> str:
        self._add_user_prompt(prompt)
        text = self.tokenizer.apply_chat_template(
            self.messages,
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

        decoded = self.tokenizer.decode(output_ids[0], skip_special_tokens=True)

        if return_full_text:
            return decoded

        prompt_len = inputs.input_ids.shape[-1]
        new_tokens = output_ids[0][prompt_len:]
        return self.tokenizer.decode(new_tokens, skip_special_tokens=True).strip()

    @classmethod
    def add_system_prompt(cls, prompt: str) -> None:
        instance = cls.get_instance()
        instance.messages.append({"role": "system", "content": prompt})

    @classmethod
    def _add_user_prompt(cls, prompt: str) -> None:
        instance = cls.get_instance()
        instance.messages.append(
            {
                "role": "user",
                "content": prompt,
            }
        )

    @classmethod
    def clear_history(cls) -> None:
        instance = cls.get_instance()
        instance.messages = []


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
