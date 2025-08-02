from lessons.types import LessonModule

AT_RESTAURANT: LessonModule = {
    "name": "At a Restaurant",
    "vocabulary": [
        {"chinese": "菜单", "pinyin": "càidān", "english": "menu"},
        {"chinese": "点菜", "pinyin": "diǎn cài", "english": "to order food"},
        {"chinese": "米饭", "pinyin": "mǐfàn", "english": "rice"},
        {"chinese": "鸡肉", "pinyin": "jīròu", "english": "chicken"},
        {"chinese": "水", "pinyin": "shuǐ", "english": "water"},
        {"chinese": "结账", "pinyin": "jiézhàng", "english": "to pay the bill"},
    ],
    "scenarios": "You walk into a restaurant and ask for a menu. You order a meal with two dishes and a drink. You ask for the bill and thank the server.",
    "grammar": [
        {
            "structure": "我想 + verb",
            "example": "我想点米饭。",
            "meaning": "I want to (do something)",
        },
        {
            "structure": "请给我 + noun",
            "example": "请给我菜单。",
            "meaning": "Please give me (something)",
        },
    ],
}
