import copy
from typing import Union, Any

import numpy as np
import torch
from kokoro import KPipeline  # type: ignore
from transformers import (AutoModelForSpeechSeq2Seq, AutoProcessor,
                          BlenderbotForConditionalGeneration,
                          BlenderbotTokenizer, pipeline)

from util.languages import Language


class SpeechToTextModel:

    def __init__(
        self,
        language: Language = Language.ENGLISH,
        model_id: str = "openai/whisper-tiny",
        device: str = "cpu",
    ):
        self.LANGUAGE = language
        self.MODEL_ID = model_id
        self.DEVICE = device

        self._setup_pipeline(self.LANGUAGE)

    def _setup_pipeline(self, language: Language):
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
        self,
        input: dict,
        task: str = "transcribe"
    ) -> Union[dict[str, Any], list[dict[str, Any]]]:
        copy_input = copy.deepcopy(input)
        if task == "transcribe":
            return self.TRANSCRIBE_PIPE(inputs=copy_input, return_timestamps=True)
        elif task == "translate":
            return self.TRANSLATE_PIPE(inputs=copy_input, return_timestamps=True)
        else:
            return {}


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

    PIPE: KPipeline = None

    def __init__(self, language: str) -> None:
        self.PIPE = KPipeline(lang_code=language)

    def run_inference(
        self,
        input: str,
        voice: str = "af_heart",
        speed: int = 1,
        split_pattern: str = r"\n+",
    ) -> dict:
        audio_segments = [
            audio for _, _, audio in self.PIPE(input, voice, speed, split_pattern)
        ]
        audio_data = np.concatenate(audio_segments)
        return {
            "sampling_rate": 24000,  # KokoroTTS set to 24K sampling rate
            "raw": audio_data,
        }
