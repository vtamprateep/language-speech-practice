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
    "scenarios": [
        "You walk into a restaurant and ask for a menu.",
        "You order a meal with two dishes and a drink.",
        "You ask for the bill and thank the server.",
    ],
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

GETTING_AROUND_TOWN: LessonModule = {
    "name": "Getting Around Town",
    "vocabulary": [
        {"chinese": "地铁", "pinyin": "dìtiě", "english": "subway"},
        {"chinese": "出租车", "pinyin": "chūzūchē", "english": "taxi"},
        {"chinese": "车站", "pinyin": "chēzhàn", "english": "station"},
        {"chinese": "左", "pinyin": "zuǒ", "english": "left"},
        {"chinese": "右", "pinyin": "yòu", "english": "right"},
        {
            "chinese": "怎么走",
            "pinyin": "zěnme zǒu",
            "english": "how to get (somewhere)",
        },
    ],
    "scenarios": [
        "You ask someone how to get to the subway station.",
        "You take a taxi and tell the driver your destination.",
        "You get lost and ask for directions at a bus stop.",
    ],
    "grammar": [
        {
            "structure": "去 + place + 怎么走？",
            "example": "去地铁站怎么走？",
            "meaning": "How do I get to (place)?",
        },
        {
            "structure": "在 + direction",
            "example": "在左边。",
            "meaning": "It's on the left.",
        },
    ],
}

DAILY_ROUTINE: LessonModule = {
    "name": "Daily Routine",
    "vocabulary": [
        {"chinese": "起床", "pinyin": "qǐchuáng", "english": "to get up"},
        {"chinese": "上班", "pinyin": "shàngbān", "english": "to go to work"},
        {"chinese": "吃饭", "pinyin": "chīfàn", "english": "to eat"},
        {"chinese": "睡觉", "pinyin": "shuìjiào", "english": "to sleep"},
        {"chinese": "几点", "pinyin": "jǐ diǎn", "english": "what time"},
        {"chinese": "每天", "pinyin": "měitiān", "english": "every day"},
    ],
    "scenarios": [
        "You describe your daily schedule to someone.",
        "You ask a friend what time they go to work.",
        "You talk about what you usually eat for breakfast.",
    ],
    "grammar": [
        {
            "structure": "我每天 + verb",
            "example": "我每天七点起床。",
            "meaning": "I (do something) every day",
        },
        {
            "structure": "你几点 + verb？",
            "example": "你几点睡觉？",
            "meaning": "What time do you (do something)?",
        },
    ],
}

MODULES = [AT_RESTAURANT, GETTING_AROUND_TOWN, DAILY_ROUTINE]
