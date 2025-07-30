from typing import List, TypedDict


class VocabularyItem(TypedDict):
    chinese: str
    pinyin: str
    english: str


class GrammarItem(TypedDict):
    structure: str
    example: str
    meaning: str


class LessonModule(TypedDict):
    name: str
    vocabulary: List[VocabularyItem]
    scenarios: str
    grammar: List[GrammarItem]
