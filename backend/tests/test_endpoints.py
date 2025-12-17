from unittest.mock import MagicMock, call, patch

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
def create_supabase_client_mock(
    mock_methods: list[str] = [], mock_attrs: list[str] = []
) -> MagicMock:
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
    mock_supabase_client = create_supabase_client_mock(["table", "select", "eq"])
    mock_clients.__getitem__.return_value = mock_supabase_client

    test_client.get(url="/api/v1/get_vocabulary_by_level", params={"level": 1})

    mock_supabase_client.table.assert_called_with("vocabulary")
    mock_supabase_client.eq.assert_called_with("level", 1)


def test_get_vocabulary_by_id():
    # Mock client and chain of calls
    mock_supabase_client = create_supabase_client_mock(["table", "select", "eq"])
    mock_clients.__getitem__.return_value = mock_supabase_client

    test_client.get(url="/api/v1/get_vocabulary_by_id", params={"arr_id": [0, 1]})

    mock_supabase_client.table.assert_called_with("vocabulary")
    mock_supabase_client.in_.assert_called_with("id", [0, 1])


def test_get_vocabulary_top_n_frequency():
    # Mock client and chain of calls
    mock_supabase_client = create_supabase_client_mock(
        ["table", "select", "is_", "order", "limit", "execute"], ["not_"]
    )

    mock_clients.__getitem__.return_value = mock_supabase_client

    # Call with no value sets default n=10
    test_client.get(
        url="/api/v1/get_vocabulary_top_n_frequency",
    )

    mock_supabase_client.table.assert_called_with("vocabulary")
    mock_supabase_client.is_.assert_called_with("relative_freq_pct", "null")
    mock_supabase_client.order.assert_called_with("relative_freq_pct", desc=True)

    # Call with value sets n appropriately
    test_client.get(url="/api/v1/get_vocabulary_top_n_frequency", params={"n": 5})

    mock_supabase_client.limit.assert_called_with(5)


def test_get_vocabulary_progress():
    # Mock client and chain of calls
    mock_supabase_client = create_supabase_client_mock(
        ["table", "select", "eq", "in_", "execute"]
    )

    mock_clients.__getitem__.return_value = mock_supabase_client

    test_client.get(
        url="/api/v1/get_vocabulary_progress", params={"user_id": "test", "arr_id": [0]}
    )

    mock_supabase_client.table.assert_called_with("vocabulary_progress")
    mock_supabase_client.select.assert_called_with(
        "id", "user_id", "vocabulary_id", "count_wrong", "count_correct"
    )
    mock_supabase_client.eq.assert_called_with("user_id", "test")
    mock_supabase_client.in_.assert_called_with("vocabulary_id", [0])


def test_put_vocabulary_progress_new_records():
    # Mock client and chain of calls
    mock_supabase_client = create_supabase_client_mock(["table", "insert", "execute"])

    mock_clients.__getitem__.return_value = mock_supabase_client

    test_client.put(
        url="/api/v1/put_vocabulary_progress_new_records/test_id",
        json={"vocabulary_id": [0]},
    )

    mock_supabase_client.table.assert_called_with("vocabulary_progress")
    mock_supabase_client.insert.assert_called_with(
        [{"user_id": "test_id", "vocabulary_id": 0}]
    )


def test_put_vocabulary_progress_update_records():
    # Mock client and chain of calls
    mock_supabase_client = create_supabase_client_mock(["table", "update", "eq"])

    mock_clients.__getitem__.return_value = mock_supabase_client

    test_client.put(
        url="/api/v1/put_vocabulary_progress_update_records",
        json=[
            {
                "id": 1,
                "user_id": "test1",
                "vocabulary_id": 1,
                "count_wrong": 1,
                "count_correct": 1,
            },
            {
                "id": 2,
                "user_id": "test2",
                "vocabulary_id": 2,
                "count_wrong": 2,
                "count_correct": 2,
            },
        ],
    )

    mock_supabase_client.table.assert_called_with("vocabulary_progress")
    mock_supabase_client.update.assert_has_calls(
        [
            call(
                {
                    "id": 1,
                    "user_id": "test1",
                    "vocabulary_id": 1,
                    "count_wrong": 1,
                    "count_correct": 1,
                }
            ),
            call(
                {
                    "id": 2,
                    "user_id": "test2",
                    "vocabulary_id": 2,
                    "count_wrong": 2,
                    "count_correct": 2,
                }
            ),
        ]
    )
    mock_supabase_client.eq.assert_has_calls([call("id", 1), call("id", 2)])


@patch("app.util.srs.policy.ExponentialSRSPolicy")
def test_get_vocabulary_id_by_policy(mock_policy):
    # Create mock responses
    mock_progress_response = MagicMock()
    mock_progress_response.data = [
        {
            "id": 10,
            "user_id": "test_user",
            "vocabulary_id": 100,
            "count_wrong": 1,
            "count_correct": 3,
        },
        {
            "id": 11,
            "user_id": "test_user",
            "vocabulary_id": 101,
            "count_wrong": 0,
            "count_correct": 5,
        },
    ]

    # Second supabase call: vocabulary (padding)
    mock_vocab_response = MagicMock()
    mock_vocab_response.data = [
        {"id": 200},
        {"id": 201},
        {"id": 202},
        {"id": 203},
        {"id": 204},
        {"id": 205},
    ]

    # Mock client and chain of calls
    mock_supabase_client = create_supabase_client_mock(
        ["table", "select", "eq", "is_", "in_", "order", "limit", "execute"],
        ["not_"]
    )

    mock_supabase_client.execute.side_effect = [
        mock_progress_response,
        mock_vocab_response,
    ]

    mock_clients.__getitem__.return_value = mock_supabase_client

    # Mock policy response
    mock_policy.retrieve_items.return_value = [entry["vocabulary_id"] for entry in mock_progress_response.data]

    # Run test with non-zero vocabulary in progress
    resp = test_client.get("/api/v1/get_vocabulary_id_by_policy/test_user")
    assert resp.status_code == 200
    assert resp.json() == [200, 201, 202, 203, 204, 205, 100, 101]

    mock_supabase_client.table.assert_any_call("vocabulary_progress")
    mock_supabase_client.table.assert_called_with("vocabulary")

    mock_policy.retrieve_items.is_called()

    # Run test with zero vocabulary in progress
    mock_progress_response.data = []
    mock_vocab_response.data = [
        {"id": 200},
        {"id": 201},
        {"id": 202},
        {"id": 203},
        {"id": 204},
        {"id": 205},
        {"id": 206},
        {"id": 207},
    ]

    # Reset mocks
    mock_policy.reset_mock()
    mock_policy.retrieve_items.return_value = [entry["vocabulary_id"] for entry in mock_progress_response.data]
    mock_supabase_client.execute.side_effect = [
        mock_progress_response,
        mock_vocab_response,
    ]

    resp = test_client.get("/api/v1/get_vocabulary_id_by_policy/test_user")
    assert resp.status_code == 200
    assert resp.json() == [200, 201, 202, 203, 204, 205, 206, 207]

    mock_policy.retrieve_items.is_not_called()

