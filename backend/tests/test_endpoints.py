import io
from unittest.mock import MagicMock

import numpy as np
from fastapi.testclient import TestClient

from app.dependencies import get_models
from app.main import app
from app.util.model import AudioData

# Dynamically create magic mock for each model to be loaded
mock_models = MagicMock()
app.dependency_overrides[get_models] = lambda: mock_models
test_client = TestClient(app)


def test_translate_text():
    # Set-up mock
    mock_translator = MagicMock()
    mock_translator.translate.return_value = "Hello"
    mock_models.__getitem__.return_value = mock_translator

    # Test method
    response = test_client.post(
        url="/api/v1/translate_text",
        json={
            "text": "你好",
            "sourceLang": "MANDARIN",
            "targetLang": "ENGLISH",
        },
    )
    assert response.status_code == 200
    assert response.json()["text"] == "Hello"
    mock_translator.translate.assert_called_once()


def test_calculate_similarity():
    mock_semantic_matcher = MagicMock()
    mock_semantic_matcher.get_similarity.return_value = 0.5
    mock_models.__getitem__.return_value = mock_semantic_matcher

    response = test_client.post(
        url="/api/v1/calculate_similarity",
        json={"text_1": "Text 1", "text_2": "Text 2"},
    )
    assert response.status_code == 200
    assert response.json()["score"] == 0.5
    mock_semantic_matcher.get_similarity.assert_called_once()


def test_transcribe_audio(monkeypatch):
    mock_whisper_model = MagicMock()
    mock_whisper_model.run_inference.return_value = {"text": "Test"}
    mock_models.__getitem__.return_value = mock_whisper_model
    mock_audio = io.BytesIO(b"Sample Audio")

    # Monkey patch AudioSegment.from_file
    class FakeAudio:
        sample_width = 2
        frame_rate = 16000

        def set_channels(self, n):
            return self

        def set_frame_rate(self, rate):
            return self

        def get_array_of_samples(self):
            return [0, 1, 2, 3]

    monkeypatch.setattr(
        "app.api.v1.endpoints.AudioSegment.from_file", lambda *a, **kw: FakeAudio()
    )

    response = test_client.post(
        url="/api/v1/transcribe_audio",
        files={
            "file": ("test.webm", mock_audio, "audio/webm"),
        },
        data={"language": "MANDARIN"},
    )
    assert response.status_code == 200
    assert response.json()["text"] == "Test"
    mock_whisper_model.run_inference.assert_called_once()


def test_generate_audio(monkeypatch):
    mock_kokoro_model = MagicMock()
    mock_kokoro_model.run_inference.return_value = AudioData(
        sampling_rate=16000, raw=np.zeros(16000, dtype=np.float32)
    )
    mock_models.__getitem__.return_value = mock_kokoro_model

    response = test_client.post(
        url="/api/v1/generate_audio", json={"text": "Test", "language": "MANDARIN"}
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/webm"
    assert "attachment; filename=output.webm" in response.headers["content-disposition"]
