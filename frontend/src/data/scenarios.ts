export interface DialogueTurn {
    turn: number;
    speaker: string;
    mandarin: string;
    pinyin: string;
    english: string;
    userPrompt: string;
    targetSentence: string;
    hint: string;
}


export const guidedScenarios = [
    {
        "id": "1",
        "path": "at-a-restaurant",
        "title": "At a restaurant",
        "description": "Practice ordering a meal in Mandarin."
    },
    {
        "id": "2",
        "path": "introducing-yourself",
        "title": "Introducing yourself",
        "description": "Learn how to greet one another."
    }
]

export const guidedScenariosDialogue: Record<string, DialogueTurn[]> = {
    "at-a-restaurant": [
        {
            "turn": 1,
            "speaker": "Server",
            "mandarin": "欢迎光临！几位？",
            "pinyin": "Huānyíng guānglín! Jǐ wèi?",
            "english": "Welcome! How many people?",
            "userPrompt": "Respond that it’s just you.",
            "targetSentence": "It’s just me.",
            "hint": "Use a phrase that means 'just me' in Mandarin. You can start with '只…'."
        },
        {
            "turn": 2,
            "speaker": "Server",
            "mandarin": "请跟我来。这是菜单。你想喝点什么？",
            "pinyin": "Qǐng gēn wǒ lái. Zhè shì càidān. Nǐ xiǎng hē diǎn shénme?",
            "english": "Please follow me. Here's the menu. What would you like to drink?",
            "userPrompt": "Respond in Mandarin by asking what drink options are available.",
            "targetSentence": "What drinks do you have?",
            "hint": "Ask about drinks. '你们有什么…?' is a common way to ask what options there are."
        },
        {
            "turn": 3,
            "speaker": "Server",
            "mandarin": "我们有茶，可乐，雪碧，还有橙汁。",
            "pinyin": "Wǒmen yǒu chá, kělè, xuěbì, hái yǒu chéngzhī.",
            "english": "We have tea, cola, Sprite, and orange juice.",
            "userPrompt": "Order a tea, specifying you want it hot.",
            "targetSentence": "I’d like a hot tea.",
            "hint": "Start with '我要…' and add '热' for hot or '冰' for cold before the drink name."
        },
        {
            "turn": 4,
            "speaker": "Server",
            "mandarin": "好的，一杯热茶。你想好吃什么了吗？",
            "pinyin": "Hǎo de, yì bēi rè chá. Nǐ xiǎng hǎo chī shénme le ma?",
            "english": "Okay, one hot tea. Have you decided what to eat?",
            "userPrompt": "Ask what the server recommends.",
            "targetSentence": "What do you recommend?",
            "hint": "Use '你推荐…吗？' to politely ask for a recommendation."
        },
        {
            "turn": 5,
            "speaker": "Server",
            "mandarin": "我推荐宫保鸡丁或者麻婆豆腐，都很受欢迎。",
            "pinyin": "Wǒ tuījiàn Gōngbǎo jīdīng huòzhě Mápó dòufu, dōu hěn shòu huānyíng.",
            "english": "I recommend Kung Pao Chicken or Mapo Tofu. Both are very popular.",
            "userPrompt": "Say you’ll try the Kung Pao Chicken.",
            "targetSentence": "I’ll have the Kung Pao Chicken.",
            "hint": "Use '我要…' to order and include the dish name. Keep it simple."
        },
        {
            "turn": 6,
            "speaker": "Server",
            "mandarin": "要不要来一碗米饭？",
            "pinyin": "Yào bù yào lái yì wǎn mǐfàn?",
            "english": "Would you like a bowl of rice with that?",
            "userPrompt": "Say yes, you’d like a bowl of rice.",
            "targetSentence": "Yes, I’d like a bowl of rice.",
            "hint": "You can start with '好' or '我要…' and mention '米饭'."
        },
        {
            "turn": 7,
            "speaker": "Server",
            "mandarin": "辣不辣可以接受吗？",
            "pinyin": "Là bù là kěyǐ jiēshòu ma?",
            "english": "Is spicy food okay for you?",
            "userPrompt": "Say a little spicy is okay.",
            "targetSentence": "A little spicy is okay.",
            "hint": "Use '一点辣可以' to express mild spice is fine."
        },
        {
            "turn": 8,
            "speaker": "Server",
            "mandarin": "好的，一份宫保鸡丁，一碗米饭，一杯热茶。请稍等。",
            "pinyin": "Hǎo de, yí fèn Gōngbǎo jīdīng, yì wǎn mǐfàn, yì bēi rè chá. Qǐng shāo děng.",
            "english": "Okay, one Kung Pao Chicken, one bowl of rice, one hot tea. Please wait a moment.",
            "userPrompt": "Thank the server politely.",
            "targetSentence": "Thank you.",
            "hint": "A simple '谢谢' works well here."
        },
        {
            "turn": 9,
            "speaker": "Server",
            "mandarin": "菜来了，请慢用！",
            "pinyin": "Cài lái le, qǐng màn yòng!",
            "english": "Here is your food. Enjoy your meal!",
            "userPrompt": "Say thank you and express that the food looks delicious.",
            "targetSentence": "Thank you, it looks delicious!",
            "hint": "Combine '谢谢' with '看起来很好吃' to express gratitude and compliment the food."
        },
        {
            "turn": 10,
            "speaker": "Server",
            "mandarin": "不客气，如果需要别的，随时叫我。",
            "pinyin": "Bù kèqì, rúguǒ xūyào bié de, suíshí jiào wǒ.",
            "english": "You’re welcome. If you need anything else, just let me know.",
            "userPrompt": "Acknowledge politely and say you will.",
            "targetSentence": "Okay, I will.",
            "hint": "You can say '好，我会的' to acknowledge politely."
        }
    ],
    "introducing-yourself": [
        {
            "turn": 1,
            "speaker": "Other Person",
            "mandarin": "你好！",
            "pinyin": "Nǐ hǎo!",
            "english": "Hello!",
            "userPrompt": "Say hello back.",
            "targetSentence": "Hello!",
            "hint": "Keep it simple with '你好'."
        },
        {
            "turn": 2,
            "speaker": "Other Person",
            "mandarin": "我是小王。你叫什麼名字？",
            "pinyin": "Wǒ shì Xiǎo Wáng. Nǐ jiào shénme míngzì?",
            "english": "I am Xiao Wang. What is your name?",
            "userPrompt": "Introduce yourself by saying 'I am ___'.",
            "targetSentence": "I am ___.",
            "hint": "Use '我是' to say 'I am'."
        }
    ]
}
