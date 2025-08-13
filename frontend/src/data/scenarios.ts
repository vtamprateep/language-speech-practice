export interface DialogueTurn {
    turn: number;
    speaker: "Server";
    mandarin: string;
    pinyin: string;
    english: string;
    userPrompt: string;

}


export const guidedScenarios = [
    {
        "id": "1",
        "path": "at-a-restaurant",
        "title": "At a restaurant",
        "description": "Practice ordering a meal in Mandarin."
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
            "userPrompt": "Respond that it’s just you."
        },
        {
            "turn": 2,
            "speaker": "Server",
            "mandarin": "请跟我来。这是菜单。你想喝点什么？",
            "pinyin": "Qǐng gēn wǒ lái. Zhè shì càidān. Nǐ xiǎng hē diǎn shénme?",
            "english": "Please follow me. Here's the menu. What would you like to drink?",
            "userPrompt": "Respond in Mandarin by asking what drink options are available."
        },
        {
            "turn": 3,
            "speaker": "Server",
            "mandarin": "我们有茶，可乐，雪碧，还有橙汁。",
            "pinyin": "Wǒmen yǒu chá, kělè, xuěbì, hái yǒu chéngzhī.",
            "english": "We have tea, cola, Sprite, and orange juice.",
            "userPrompt": "Order a tea, specifying if you want it hot or cold."
        },
        {
            "turn": 4,
            "speaker": "Server",
            "mandarin": "好的，一杯热茶。你想好吃什么了吗？",
            "pinyin": "Hǎo de, yì bēi rè chá. Nǐ xiǎng hǎo chī shénme le ma?",
            "english": "Okay, one hot tea. Have you decided what to eat?",
            "userPrompt": "Ask what the server recommends."
        },
        {
            "turn": 5,
            "speaker": "Server",
            "mandarin": "我推荐宫保鸡丁或者麻婆豆腐，都很受欢迎。",
            "pinyin": "Wǒ tuījiàn Gōngbǎo jīdīng huòzhě Mápó dòufu, dōu hěn shòu huānyíng.",
            "english": "I recommend Kung Pao Chicken or Mapo Tofu. Both are very popular.",
            "userPrompt": "Say you’ll try the Kung Pao Chicken."
        },
        {
            "turn": 6,
            "speaker": "Server",
            "mandarin": "要不要来一碗米饭？",
            "pinyin": "Yào bù yào lái yì wǎn mǐfàn?",
            "english": "Would you like a bowl of rice with that?",
            "userPrompt": "Say yes, you’d like a bowl of rice."
        },
        {
            "turn": 7,
            "speaker": "Server",
            "mandarin": "辣不辣可以接受吗？",
            "pinyin": "Là bù là kěyǐ jiēshòu ma?",
            "english": "Is spicy food okay for you?",
            "userPrompt": "Say a little spicy is okay."
        },
        {
            "turn": 8,
            "speaker": "Server",
            "mandarin": "好的，一份宫保鸡丁，一碗米饭，一杯热茶。请稍等。",
            "pinyin": "Hǎo de, yí fèn Gōngbǎo jīdīng, yì wǎn mǐfàn, yì bēi rè chá. Qǐng shāo děng.",
            "english": "Okay, one Kung Pao Chicken, one bowl of rice, one hot tea. Please wait a moment.",
            "userPrompt": "Thank the server politely."
        },
        {
            "turn": 9,
            "speaker": "Server",
            "mandarin": "菜来了，请慢用！",
            "pinyin": "Cài lái le, qǐng màn yòng!",
            "english": "Here is your food. Enjoy your meal!",
            "userPrompt": "Say thank you and express that the food looks delicious."
        },
        {
            "turn": 10,
            "speaker": "Server",
            "mandarin": "不客气，如果需要别的，随时叫我。",
            "pinyin": "Bù kèqì, rúguǒ xūyào bié de, suíshí jiào wǒ.",
            "english": "You’re welcome. If you need anything else, just let me know.",
            "userPrompt": "Acknowledge politely and say you will."
        }
    ]
}
