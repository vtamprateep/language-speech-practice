from .util.model import (
    SpeechToTextModel,
    ConversationGeneratorModel,
)
from .util.audio import (
    VoiceRecorder
)


if __name__ == "__main__":
    # Test VoiceRecorder
    voice_recorder = VoiceRecorder()
    # audio_data = voice_recorder.record(file_name="ch_sample.wav")
    audio_data = voice_recorder.read("ch_sample.wav")
    print("> Audio Data:", audio_data)

    # Feed into voice transcriber
    transcriber = SpeechToTextModel(language="chinese")
    inference_result = transcriber.run_inference(audio_data)
    print(inference_result)
    translate_inference_result = transcriber.run_inference(audio_data, "translate")
    print(translate_inference_result)

    # Feed into conversation model
    conversation = ConversationGeneratorModel()
    response = conversation.run_inference(translate_inference_result["text"])
    print(response)
