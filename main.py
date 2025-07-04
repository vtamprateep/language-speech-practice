import torch
import sounddevice as sd
import numpy as np
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
from scipy.io.wavfile import write, read


class AudioTranscriber:
    def __init__(
        self, 
        model_id = "openai/whisper-tiny"
    ):
        device = "cpu"
        torch_dtype = torch.float32
        processor = AutoProcessor.from_pretrained(model_id)
        model = AutoModelForSpeechSeq2Seq.from_pretrained(
            model_id,
            torch_dtype=torch_dtype,
            low_cpu_mem_usage=True,
            use_safetensors=True
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


def record_audio(file_name: str, sampling_rate = 16000) -> None:
    duration = 5
    print("Recording...")
    audio = sd.rec(
        int(duration * sampling_rate),
        samplerate=sampling_rate,
        channels=1,
        dtype="float32"
    )
    sd.wait()
    print("Done recording.")
    if file_name:
        write(f"{file_name}.wav", sampling_rate, audio)
        print(f"Saved to {file_name}.wav")

    return {
        "sampling_rate": sampling_rate,
        "raw": np.array(audio)
    }

def read_audio_file(file_name: str) -> dict:
    sample_rate, audio_data = read(f"{file_name}.wav")
    return {
        "sampling_rate": sample_rate,
        "raw": np.array(audio_data)
    }

def play_audio_file(file_name: str) -> None:
    print(f"Playing audio file: {file_name}.wav")
    sample_rate, audio_data = read(f"{file_name}.wav")
    sd.play(audio_data, sample_rate, blocking=True)

if __name__ == "__main__":
    transcriber = AudioTranscriber()
    file_name = "sample_file"
    record_audio(file_name)
    play_audio_file(file_name)
    audio_input = read_audio_file(file_name)
    inference_result = transcriber.run_inference(audio_input)
