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


# Utility function to mock chain of calls in supabase client
def create_supabase_client_mock(mock_methods: list[str], mock_attrs: list[str]) -> MagicMock:
    mock_supabase_client = MagicMock()
    for method in mock_methods:
        getattr(mock_supabase_client, method).return_value = mock_supabase_client

    for attr in mock_attrs:
        setattr(mock_supabase_client, attr, mock_supabase_client)

    return mock_supabase_client


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


def test_get_vocabulary_by_id():
    # Mock client and chain of calls
    mock_supabase_client = MagicMock()
    mock_supabase_client.table.return_value = mock_supabase_client
    mock_supabase_client.select.return_value = mock_supabase_client
    mock_supabase_client.eq.return_value = mock_supabase_client

    mock_clients.__getitem__.return_value = mock_supabase_client

    test_client.get(
        url="/api/v1/get_vocabulary_by_id",
        params={"arr_id": [0, 1]}
    )

    mock_supabase_client.table.assert_called_with("vocabulary")
    mock_supabase_client.in_.assert_called_with("id", [0, 1])


def test_get_vocabulary_top_n_frequency():
    # Mock client and chain of calls
    mock_supabase_client = create_supabase_client_mock([
        "table",
        "select",
        "is_",
        "order",
        "limit",
        "execute"
    ], ["not_"])

    mock_clients.__getitem__.return_value = mock_supabase_client

    # Call with no value sets default n=10
    test_client.get(
        url="/api/v1/get_vocabulary_top_n_frequency",
    )

    mock_supabase_client.table.assert_called_with("vocabulary")
    mock_supabase_client.is_.assert_called_with("relative_freq_pct", "null")
    mock_supabase_client.order.assert_called_with("relative_freq_pct", desc=True)

    # Call with value sets n appropriately
    test_client.get(
        url="/api/v1/get_vocabulary_top_n_frequency",
        params={"n": 5}
    )

    mock_supabase_client.limit.assert_called_with(5)
