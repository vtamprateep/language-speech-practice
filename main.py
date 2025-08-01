from util.audio import VoiceRecorder
from util.languages import Language, TextTranslator
from util.model import QwenCausalLM, SpeechToTextModel, TextToSpeechModel


class MandarinConversationPractice:
    """Conversation must be in Mandarin."""

    def __init__(self):
        self.LANGUAGE = Language.MANDARIN
        self._set_up()

    def _set_up(self) -> None:
        self.VOICE_RECORDER = VoiceRecorder()
        self.VOICE_TRANSCRIBER = SpeechToTextModel(self.LANGUAGE)
        self.TEXT_TO_SPEECH_MODEL = TextToSpeechModel(self.LANGUAGE)

        self.CONVERSATION_GENERATOR = QwenCausalLM()
        self.CONVERSATION_GENERATOR.add_system_prompt(
            (
                "You are having a conversation with me in Mandarin."
                " Respond in short sentences. Converse with me in a way to help me practice"
                " forming sentences with different grammar patterns."
            )
        )

    def _translate_text(self, input: str, target: Language) -> str:
        return TextTranslator.translate(input, target)

    def _get_user_response(self) -> str:
        input("> Press any 'Enter' to start recording audio...")
        audio_data = self.VOICE_RECORDER.record(sampling_rate=24000)
        user_text_response = self.VOICE_TRANSCRIBER.run_inference(audio_data)  # type: ignore
        return user_text_response["text"]  # type: ignore

    def _get_bot_response(self, user_text: str) -> str:
        bot_text_response = self.CONVERSATION_GENERATOR.run_inference(user_text)
        return bot_text_response

    def add_scenario(self, scenario: str) -> None:
        self.CONVERSATION_GENERATOR.add_system_prompt(
            f"This is the conversation role-playing scenario: {scenario}"
        )

    def prioritize_vocabulary(self, vocab_arr: list[str]) -> None:
        self.CONVERSATION_GENERATOR.add_system_prompt(
            f"Prioritize using the following vocabulary when it makes sense: {','.join(vocab_arr)}"
        )

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

            transcript.append(
                {
                    "user": user_text,
                    "user_english": self._translate_text(user_text, Language.ENGLISH),
                    "bot": bot_text,
                    "bot_english": self._translate_text(bot_text, Language.ENGLISH),
                }
            )
            count_turns += 1

        return transcript


if __name__ == "__main__":
    practice = MandarinConversationPractice()
    transcript = practice.start_session(1)
    print(transcript)
