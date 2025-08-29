from unittest.mock import MagicMock

from dependencies import get_models
from fastapi.testclient import TestClient
from main import app

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
        }
    )
    assert response.status_code == 200
    assert response.json()["text"] == "Hello"

    