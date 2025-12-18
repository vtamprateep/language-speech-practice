"""Contains policy that determines which vocabulary is returned"""

from dataclasses import dataclass

import numpy as np
import pandas as pd


@dataclass
class SRSItem:
    id: int
    count_correct: int
    count_wrong: int


class ExponentialSRSPolicy:
    @staticmethod
    def retrieve_items(
        items: list[SRSItem],
        smooth_factor: int = 5,
        score_threshold: float | int = 15,
        N: int = 8,
    ) -> list[int]:
        """Given number of times the item has been answered correctly / incorrectly,
        calculate score and return N ids that need to be studied."""

        # Compute correctness ratio and total encounters
        df = pd.DataFrame(items)
        df["count_seen"] = df["count_correct"] + df["count_wrong"]
        df["correct_ratio"] = df["count_correct"] / (df["count_seen"] + smooth_factor)

        # Calculate exponential score
        df["sqrt_n"] = np.sqrt(df["count_seen"])
        df["pwr_correct_ratio"] = np.power(df["correct_ratio"], 2)
        df["score"] = np.exp(df["pwr_correct_ratio"] * df["sqrt_n"])

        # Sort by score descending, throw out high scorers, get top N, return ID
        df_filtered = df[df["score"] < score_threshold].sort_values("score")
        df_top_N = df_filtered.head(N)
        print(df_top_N)

        return df_top_N["id"].to_list()
