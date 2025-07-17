from util.audio import VoiceRecorder
from util.languages import Language
from util.model import (ConversationGeneratorModel, SpeechToTextModel,
                        TextToSpeechModel)
from util.translator import TextTranslator


# class PracticeSession:

#     def __init__(self, languange: Language = Language.ENGLISH):
#         pass

#     def start_session(self, turns: int):
#         count_turns = 0
#         while count_turns < turns:
#             input("> Press any key to start recording audio...")
#             user_audio_data = voice_recorder.record(
#                 sampling_rate=24000
#             )  # KokoroTTS uses 24K sampling rate
#             inference_result = voice_transcriber.run_inference(user_audio_data)
#             print(f"> You said: {inference_result['text']}")

#             bot_response = dialogue_generator.run_inference(inference_result["text"])
#             print(f"> Bot responds: {bot_response}")
#             bot_audio_data = text_to_speech_generator.run_inference(bot_response)
#             voice_recorder.play(bot_audio_data)

#             count_turns += 1


if __name__ == "__main__":
    text_to_speech_generator = TextToSpeechModel("a")
    data = text_to_speech_generator.run_inference("Hello!")
    print(data)
        
