import json
from enum import Enum

from lessons.mode import MandarinSpeech, MandarinText
from lessons.types import LessonModule


class LessonMode(Enum):
    SPEECH = "SPEECH"
    TEXT = "TEXT"


class LessonManager:
    def __init__(self, config: LessonModule, mode: LessonMode):
        if mode == LessonMode.TEXT:
            self.dialogue_engine = MandarinText()  # type: ignore
        else:
            self.dialogue_engine = MandarinSpeech()  # type: ignore

    def _set_up(self, config: LessonModule):
        self.dialogue_engine.add_scenario(config["scenarios"])
        self.dialogue_engine.add_vocabulary(config["vocabulary"])
        self.dialogue_engine.add_grammar(config["grammar"])

    def start(self):
        transcript = self.dialogue_engine.start_session(5)
        print(json.dumps(transcript))
