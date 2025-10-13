import io
from unittest.mock import MagicMock

import numpy as np
from fastapi.testclient import TestClient

from app.dependencies import get_clients, get_models
from app.main import app
from app.util.model import AudioData

# Dynamically create magic mock for each model to be loaded
mock_models = MagicMock()
mock_clients = MagicMock()
app.dependency_overrides[get_models] = lambda: mock_models
app.dependency_overrides[get_clients] = lambda: mock_clients
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
    mock_hf_client = MagicMock()
    mock_hf_client.sentence_similarity.return_value = [1.0]
    mock_clients.__getitem__.return_value = mock_hf_client

    response = test_client.post(
        url="/api/v1/calculate_similarity",
        json={"text_1": "Text 1", "text_2": "Text 2"},
    )
    assert response.status_code == 200
    assert response.json()["score"] == "1.0"
    mock_hf_client.sentence_similarity.assert_called_once()
