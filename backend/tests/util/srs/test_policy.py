from app.util.srs.policy import ExponentialSRSPolicy, SRSItem


def test_returns_list_of_ids():
    items = [
        SRSItem(id=1, count_correct=0, count_wrong=0),
        SRSItem(id=2, count_correct=1, count_wrong=0),
    ]

    result = ExponentialSRSPolicy.retrieve_items(None, items, N=2)

    assert isinstance(result, list)
    assert all(isinstance(x, int) for x in result)


def test_items_with_lower_scores_returned_first():
    # Item 1 should have a lower score (worse correctness)
    items = [
        SRSItem(id=1, count_correct=0, count_wrong=10),
        SRSItem(id=2, count_correct=10, count_wrong=0),
    ]

    result = ExponentialSRSPolicy.retrieve_items(None, items, N=2)

    assert result[0] == 1      # worst item first
    assert result[1] == 2


def test_threshold_filters_out_high_scores():
    # Item 2 should be filtered out by score_threshold
    items = [
        SRSItem(id=1, count_correct=0, count_wrong=5),   # low score
        SRSItem(id=2, count_correct=20, count_wrong=0),  # high score
    ]

    result = ExponentialSRSPolicy.retrieve_items(
        None, items, score_threshold=10, N=2
    )

    assert 2 not in result
    assert 1 in result


def test_returns_at_most_n_items():
    items = [
        SRSItem(id=1, count_correct=0, count_wrong=5),
        SRSItem(id=2, count_correct=0, count_wrong=5),
        SRSItem(id=3, count_correct=0, count_wrong=5),
    ]

    result = ExponentialSRSPolicy.retrieve_items(None, items, N=2)

    assert len(result) == 2


def test_returns_empty_if_all_filtered():
    items = [
        SRSItem(id=1, count_correct=50, count_wrong=0),
        SRSItem(id=2, count_correct=40, count_wrong=0),
    ]

    result = ExponentialSRSPolicy.retrieve_items(
        None, items, score_threshold=1, N=5
    )

    assert result == []
