import torch
import sounddevice as sd
import numpy as np
import queue
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration
from scipy.io.wavfile import write, read
from sounddevice import CallbackFlags
from typing import Any


class AudioTranscriberModel:
    def __init__(self, model_id="openai/whisper-tiny"):
        device = "cpu"
        torch_dtype = torch.float32
        processor = AutoProcessor.from_pretrained(model_id)
        model = AutoModelForSpeechSeq2Seq.from_pretrained(
            model_id,
            torch_dtype=torch_dtype,
            low_cpu_mem_usage=True,
            use_safetensors=True,
        )
        model.to(device)

        self.pipe = pipeline(
            "automatic-speech-recognition",
            model=model,
            tokenizer=processor.tokenizer,
            feature_extractor=processor.feature_extractor,
            torch_dtype=torch_dtype,
            device=device,
        )

    def run_inference(self, input: dict) -> dict:
        return self.pipe(inputs=input, return_timestamps=True)


class ConversationGeneratorModel:
    MAX_INPUT_TOKENS = 128

    def __init__(self, model_id: str = "facebook/blenderbot-400M-distill"):
        self.tokenizer = BlenderbotTokenizer.from_pretrained(model_id)
        self.model = BlenderbotForConditionalGeneration.from_pretrained(
            model_id, use_safetensors=True
        )
        self.history = []

    def _truncate_history(self) -> None:
        input_length = 0
        for i in range(len(self.history) - 1, -1, -1):
            input_string = self.history[i]
            input_token = self.tokenizer(input_string, return_tensors="pt")
            input_length += input_token["input_ids"].size(dim=1)

            if input_length > self.MAX_INPUT_TOKENS:
                self.history.pop(i)

    def run_inference(self, input: str) -> list:
        self.history.append(f"User: {input}")
        self._truncate_history()

        context = "\n".join(self.history)
        input_token = self.tokenizer(context, return_tensors="pt")
        reply_ids = self.model.generate(**input_token)
        response = self.tokenizer.decode(reply_ids[0], skip_special_tokens=True)

        self.history.append(f"Bot: {response}")
        return response


class VoiceRecorder:

    def __init__(self):
        self.audio_block_queue = queue.Queue()

    def _record_callback(
        self,
        indata: np.ndarray,
        frames: int,
        time: Any,
        status: CallbackFlags
    ) -> None:
        if status:
            print(status)
        self.audio_block_queue.put(indata.copy())

    def _is_silence_detected(
        self,
        block: np.ndarray,
        silence_threshold: float = 0.01
    ) -> bool:
        rms = np.sqrt(np.mean(block**2))
        silence_detected = rms < silence_threshold

        if silence_detected:
            print("> Silence detected!")
            return True
        return False

    def record(
        self,
        file_name: str = None,
        sampling_rate: int = 16000,
        block_duration: float = 0.5,
        buffer_duration: int = 5,
    ) -> dict:
        block_size = int(block_duration * sampling_rate)
        min_recorded_blocks = int(buffer_duration / block_duration)
        audio_blocks = []

        print("> Recording stream start...")
        with sd.InputStream(
            samplerate=sampling_rate,
            channels=1,
            blocksize=block_size,
            callback=self._record_callback
        ):
            while True:
                next_audio_block = self.audio_block_queue.get()
                audio_blocks.append(next_audio_block)
                min_recorded_blocks -= 1

                print(f"> Total recorded blocks: {len(audio_blocks)}")

                if self._is_silence_detected(next_audio_block) and min_recorded_blocks <= 0:
                    print("> Recording stopped!")
                    break

        full_audio_data = np.concatenate(audio_blocks, axis=0)

        if file_name:
            write(file_name, sampling_rate, full_audio_data)

        return {"sampling_rate": sampling_rate, "raw": full_audio_data}

    def read(self, file_name: str) -> dict:
        sample_rate, audio_data = read(f"{file_name}.wav")
        return {"sampling_rate": sample_rate, "raw": np.array(audio_data)}

    def play(self, file_name: str) -> None:
        print(f"Playing audio file: {file_name}.wav")
        sample_rate, audio_data = read(f"{file_name}.wav")
        sd.play(audio_data, sample_rate, blocking=True)


if __name__ == "__main__":
    # # Test audio transcriber
    # transcriber = AudioTranscriber()
    # file_name = "sample_file"
    # record_audio(file_name, duration = 10)
    # play_audio_file(file_name)
    # audio_input = read_audio_file(file_name)
    # inference_result = transcriber.run_inference(audio_input)
    # print(inference_result)

    # Test text generation
    # conversation_generator = ConversationGeneratorModel()
    # for _ in range(10):
    #     user_input = input("> User Input (if end, press enter): ")
    #     if not user_input:
    #         break

    #     print(conversation_generator.run_inference(user_input))

    # Test VoiceRecorder
    voice_recorder = VoiceRecorder()
    audio_data = voice_recorder.record()
    print(audio_data)