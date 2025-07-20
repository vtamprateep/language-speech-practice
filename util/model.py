import copy
from typing import Any, Union

import numpy as np
import torch
from kokoro import KPipeline  # type: ignore
from transformers import (AutoModelForCausalLM, AutoModelForSpeechSeq2Seq,
                          AutoProcessor, AutoTokenizer,
                          BlenderbotForConditionalGeneration,
                          BlenderbotTokenizer, pipeline)

from util.languages import Language


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
        self, input: dict, task: str = "transcribe"
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
    ) -> dict:
        audio_segments = [
            audio for _, _, audio in self.PIPE(input, voice, speed, split_pattern)
        ]
        audio_data = np.concatenate(audio_segments)
        return {
            "sampling_rate": 24000,  # KokoroTTS set to 24K sampling rate
            "raw": audio_data,
        }


class QwenCausalLM:
    def __init__(
        self,
        model_name: str = "Qwen/Qwen1.5-0.5B",
        device: str = "cpu",
        torch_dtype=torch.float32,
        trust_remote_code: bool = False,
        max_new_tokens: int = 50,
    ):
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

    def run_inference(
        self,
        prompt: str,
        messages: list = [],
        temperature: float = 0.7,
        top_p: float = 0.9,
        do_sample: bool = True,
        enable_thinking: bool = False,
        return_full_text: bool = False,
    ) -> str:
        messages.append({"role": "user", "content": prompt})
        text = self.tokenizer.apply_chat_template(
            messages,
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
        else:
            # Return just the new text after the prompt
            prompt_len = inputs.input_ids.shape[-1]
            new_tokens = output_ids[0][prompt_len:]
            return self.tokenizer.decode(new_tokens, skip_special_tokens=True).strip()
