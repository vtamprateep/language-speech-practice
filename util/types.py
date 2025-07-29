from dataclasses import dataclass
from enum import Enum

import numpy as np


@dataclass
class AudioData:
    sampling_rate: int
    raw: np.ndarray


class LanguageMode(Enum):
    AUDIO = "AUDIO"
    TEXT = "TEXT"
