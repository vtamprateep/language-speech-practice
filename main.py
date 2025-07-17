from util.model import SpeechToTextModel, ConversationGeneratorModel, TextToSpeechModel
from util.audio import VoiceRecorder


if __name__ == "__main__":
    voice_recorder = VoiceRecorder()
    voice_transcriber = SpeechToTextModel()
    dialogue_generator = ConversationGeneratorModel()
    text_to_speech_generator = TextToSpeechModel("a")

    print("> Starting conversation session with bot!\n\n")
    while True:
        input("> Press any key to start recording audio...")
        user_audio_data = voice_recorder.record(
            sampling_rate=24000
        )  # KokoroTTS uses 24K sampling rate
        inference_result = voice_transcriber.run_inference(user_audio_data)
        print(f"> You said: {inference_result['text']}")

        bot_response = dialogue_generator.run_inference(inference_result["text"])
        print(f"> Bot responds: {bot_response}")
        bot_audio_data = text_to_speech_generator.run_inference(bot_response)
        voice_recorder.play(bot_audio_data)
