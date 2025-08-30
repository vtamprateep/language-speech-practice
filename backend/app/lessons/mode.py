from util.audio import VoiceRecorder
from util.languages import Language
from util.model import (
    QwenCausalLM,
    SpeechToTextModel,
    TextToSpeechModel,
    TextTranslator,
)

from lessons.types import GrammarItem, VocabularyItem


class MandarinSpeech:
    """Conversation must be in Mandarin."""

    def __init__(self):
        self.LANGUAGE = Language.MANDARIN
        self._set_up()

    def _set_up(self) -> None:
        self.VOICE_RECORDER = VoiceRecorder()
        self.VOICE_TRANSCRIBER = SpeechToTextModel(self.LANGUAGE)
        self.TEXT_TO_SPEECH_MODEL = TextToSpeechModel(self.LANGUAGE)

        self.CONVERSATION_GENERATOR = QwenCausalLM()
        self.SESSION_UUID = self._get_session_id()
        self.CONVERSATION_GENERATOR.add_system_prompt(
            (
                "You are having a conversation with me in Mandarin."
                " Respond in short sentences. Converse with me in a way to help me practice"
                " forming sentences with different grammar patterns."
            ),
            self.SESSION_UUID,
        )

    def _translate_text(self, input: str, target: Language) -> str:
        return TextTranslator.translate(input, target)

    def _get_user_response(self) -> str:
        input("> Press any 'Enter' to start recording audio...")
        audio_data = self.VOICE_RECORDER.record(sampling_rate=24000)
        user_text_response = self.VOICE_TRANSCRIBER.run_inference(audio_data)  # type: ignore
        return user_text_response["text"]  # type: ignore

    def _get_bot_response(self, user_text: str) -> str:
        bot_text_response = self.CONVERSATION_GENERATOR.run_inference(
            user_text, self.SESSION_UUID
        )
        return bot_text_response

    def add_context(self, context: str) -> None:
        self.CONVERSATION_GENERATOR.add_system_prompt(
            f"This is the conversation role-playing scenario: {context}",
            self.SESSION_UUID,
        )

    def prioritize_vocabulary(self, vocab_arr: list[str]) -> None:
        self.CONVERSATION_GENERATOR.add_system_prompt(
            f"Prioritize using the following vocabulary when it makes sense: {','.join(vocab_arr)}",
            self.SESSION_UUID,
        )

    def _get_session_id(self) -> str:
        return QwenCausalLM.create_session()


class MandarinText:
    """Class that you can type at a bot back and forth."""

    def __init__(self):
        self.LANGUAGE = Language.MANDARIN
        self.SESSION_UUID = QwenCausalLM.create_session()
        QwenCausalLM.add_system_prompt(
            (
                "You are my Mandarin practice partner."
                " You help me by holding conversations in Mandarin, prompting"
                " me to use key vocabulary and grammar patterns."
            )
        )

    def _translate_text(self, input: str, target: Language) -> str:
        return TextTranslator.translate(input, target)

    def _get_user_response(self) -> str:
        return input("> You: ")

    def _get_bot_response(self, user_text: str) -> str:
        bot_text_response = QwenCausalLM.run_inference(user_text, self.SESSION_UUID)
        return bot_text_response

    def add_scenario(self, scenario: str) -> None:
        QwenCausalLM.add_system_prompt(
            f"This is the conversation role-playing scenario from the perspective of the user: {scenario}",
            self.SESSION_UUID,
        )

    def add_vocabulary(self, vocab_arr: list[VocabularyItem]) -> None:
        QwenCausalLM.add_system_prompt(
            (
                "Prioritize using the following vocabulary when it makes sense:"
                f" {','.join(item['chinese'] for item in vocab_arr)}"
            ),
            self.SESSION_UUID,
        )

    def add_grammar(self, grammar_arr: list[GrammarItem]) -> None:
        QwenCausalLM.add_system_prompt(
            (
                f"Prioritize prompting me to use the following grammar patterns"
                " in my response when it makes sense:"
                f" {','.join(item['structure'] for item in grammar_arr)}"
            ),
            self.SESSION_UUID,
        )

    def clear_session(self) -> None:
        QwenCausalLM.delete_session(self.SESSION_UUID)
        self.SESSION_UUID = QwenCausalLM.create_session()
