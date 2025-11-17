from unittest.mock import MagicMock

from fastapi.testclient import TestClient

from app.dependencies import get_clients, get_models
from app.main import app

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


def test_get_vocabulary_by_level():
    # Mock client and chain of calls
    mock_supabase_client = MagicMock()
    mock_supabase_client.table.return_value = mock_supabase_client
    mock_supabase_client.select.return_value = mock_supabase_client
    mock_supabase_client.eq.return_value = mock_supabase_client

    mock_clients.__getitem__.return_value = mock_supabase_client

    test_client.get(
        url="/api/v1/get_vocabulary_by_level",
        params={"level": 1}
    )

    mock_supabase_client.table.assert_called_with("vocabulary")
    mock_supabase_client.eq.assert_called_with("level", 1)

