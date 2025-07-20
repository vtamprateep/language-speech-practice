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

    def _get_user_response(self) -> str:
        input("> Press any 'Enter' to start recording audio...")
        audio_data = self.VOICE_RECORDER.record(sampling_rate=24000)
        user_text_response = self.VOICE_TRANSCRIBER.run_inference(audio_data)
        return user_text_response["text"]  # type: ignore

    def _get_bot_response(self, user_text: str) -> str:
        if self.LANGUAGE != Language.ENGLISH:
            user_text = self._translate_text(user_text, Language.ENGLISH)

        bot_text_response_english = self.CONVERSATION_GENERATOR.run_inference(user_text)
        bot_text_response = self._translate_text(
            bot_text_response_english, self.LANGUAGE
        )
        return bot_text_response

    def start_session(self, turns: int) -> list[dict[str, str]]:
        count_turns = 0
        transcript = []
        while count_turns < turns:
            user_text = self._get_user_response()
            print(f"> You said: {user_text}")

            bot_text = self._get_bot_response(user_text)
            print(f"> Bot responds: {bot_text}")
            bot_audio_data = self.TEXT_TO_SPEECH_MODEL.run_inference(
                self._translate_text(bot_text, self.LANGUAGE)
            )
            self.VOICE_RECORDER.play(bot_audio_data)

            transcript.append({"user": user_text, "bot": bot_text})
            count_turns += 1

        return transcript


if __name__ == "__main__":
    practice = ConversationPractice(Language.MANDARIN)
    practice.start_session(5)
