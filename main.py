from util.audio import VoiceRecorder
from util.languages import Language
from util.model import (ConversationGeneratorModel, SpeechToTextModel,
                        TextToSpeechModel)
from util.translator import TextTranslator


class ConversationPractice:
    def __init__(self, languange: Language = Language.ENGLISH):
        self.LANGUAGE = languange
        self._set_up()

    def _set_up(self) -> None:
        self.VOICE_RECORDER = VoiceRecorder()
        self.VOICE_TRANSCRIBER = SpeechToTextModel(self.LANGUAGE)
        self.CONVERSATION_GENERATOR = ConversationGeneratorModel()
        self.TEXT_TO_SPEECH_MODEL = TextToSpeechModel(self.LANGUAGE)

    def _translate_text(self, input: str, target: Language) -> str:
        return TextTranslator.translate(input, target)

    def start_session(self, turns: int):
        count_turns = 0
        while count_turns < turns:
            input("> Press any 'Enter' to start recording audio...")
            user_audio_data = self.VOICE_RECORDER.record(
                sampling_rate=24000
            )  # KokoroTTS uses 24K sampling rate
            inference_result = self.VOICE_TRANSCRIBER.run_inference(user_audio_data)
            print(f"> You said: {inference_result['text']}")  # type: ignore

            if self.LANGUAGE != Language.ENGLISH:
                bot_response = self.CONVERSATION_GENERATOR.run_inference(
                    self._translate_text(inference_result["text"], Language.ENGLISH)  # type: ignore
                )
            else:
                bot_response = self.CONVERSATION_GENERATOR.run_inference(
                    inference_result["text"]  # type: ignore
                )

            print(
                f"> Bot responds: {self._translate_text(bot_response, self.LANGUAGE)}"
            )
            bot_audio_data = self.TEXT_TO_SPEECH_MODEL.run_inference(
                self._translate_text(bot_response, self.LANGUAGE)
            )
            self.VOICE_RECORDER.play(bot_audio_data)

            count_turns += 1


if __name__ == "__main__":
    practice = ConversationPractice(Language.MANDARIN)
    practice.start_session(5)
