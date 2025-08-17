import math
import queue
from typing import Any, Optional

import numpy as np
import sounddevice as sd  # type: ignore
from scipy.io.wavfile import read, write  # type: ignore
from sounddevice import CallbackFlags

from .type import AudioData


class VoiceRecorder:
    def __init__(self):
        self.audio_block_queue = queue.Queue()

    def _record_callback(
        self, indata: np.ndarray, frames: int, time: Any, status: CallbackFlags
    ) -> None:
        if status:
            print(status)
        self.audio_block_queue.put(indata.copy())

    def _is_silence_detected(
        self, block: np.ndarray, silence_threshold: float = 0.01
    ) -> bool:
        rms = np.sqrt(np.mean(block**2))
        silence_detected = rms < silence_threshold

        if silence_detected:
            print("> Silence detected!")
            return True
        return False

    def record(
        self,
        file_name: Optional[str] = None,
        sampling_rate: int = 24000,
        block_duration: float = 1.0,
        buffer_duration: int = 5,
    ) -> dict:
        block_size = int(block_duration * sampling_rate)
        min_recorded_blocks = math.ceil(buffer_duration / block_duration)
        audio_blocks = []

        print("> Recording stream start...")
        with sd.InputStream(
            samplerate=sampling_rate,
            channels=1,
            blocksize=block_size,
            callback=self._record_callback,
        ):
            while True:
                next_audio_block = self.audio_block_queue.get()
                audio_blocks.append(next_audio_block)
                min_recorded_blocks -= 1

                print(f"> Total recorded blocks: {len(audio_blocks)}")

                if (
                    self._is_silence_detected(next_audio_block)
                    and min_recorded_blocks <= 0
                ):
                    print("> Recording stopped!")
                    break

        full_audio_data = np.concatenate(audio_blocks, axis=0)[:, 0]

        if file_name:
            write(file_name, sampling_rate, full_audio_data)

        return {"sampling_rate": sampling_rate, "raw": full_audio_data}

    def read(self, file_name: str) -> dict:
        sample_rate, audio_data = read(f"{file_name}")
        return {"sampling_rate": sample_rate, "raw": np.array(audio_data)}

    def play(self, data: AudioData) -> None:
        audio_data, sampling_rate = data.raw, data.sampling_rate
        sd.play(audio_data, sampling_rate, blocking=True)
