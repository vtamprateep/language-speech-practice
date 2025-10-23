export interface GrammarPracticeItem {
    id: number;
    prompt: string;
    fragments: string[];
    answer: string;
}

export interface GrammarRule {
    id: number;
    title: string;
    description: string;
    examples: string[];
    practice: GrammarPracticeItem[];
}

export const grammarRules: GrammarRule[] = [
    {
        id: 1,
        title: "Basic sentence order: Subject + Verb (+ Object)",
        description: "The basic Chinese sentence structure is Subject + Verb + Object.",
        examples: [
            "我愛你。 (Wǒ ài nǐ.) — I love you.",
            "他吃蘋果。 (Tā chī píngguǒ.) — He eats an apple."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘I like you.’", fragments: ["我", "喜歡", "你"], answer: "我喜歡你。" },
            { id: 2, prompt: "Reorder: 吃 / 他 / 米飯", fragments: ["吃", "他", "米飯"], answer: "他吃米飯。" },
            { id: 3, prompt: "Make a sentence: 我 + 看書", fragments: ["我", "看書"], answer: "我看書。" },
            { id: 4, prompt: "Translate: ‘She eats fruit.’", fragments: ["她", "吃", "水果"], answer: "她吃水果。" },
            { id: 5, prompt: "Reorder: 愛 / 我 / 他", fragments: ["愛", "我", "他"], answer: "他愛我。" }
        ]
    },
    {
        id: 2,
        title: "A 是 B — ‘A is B’",
        description: "Use 是 to link a subject and a noun, meaning ‘to be’.",
        examples: [
            "我是學生。 (Wǒ shì xuéshēng.) — I am a student.",
            "他是老師。 (Tā shì lǎoshī.) — He is a teacher."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘She is a doctor.’", fragments: ["她", "是", "醫生"], answer: "她是醫生。" },
            { id: 2, prompt: "Translate: ‘You are Chinese.’", fragments: ["你", "是", "中國人"], answer: "你是中國人。" },
            { id: 3, prompt: "Reorder: 是 / 他 / 學生", fragments: ["是", "他", "學生"], answer: "他是學生。" },
            { id: 4, prompt: "Make a sentence: We are friends.", fragments: ["我們", "是", "朋友"], answer: "我們是朋友。" },
            { id: 5, prompt: "Translate: ‘I am a teacher.’", fragments: ["我", "是", "老師"], answer: "我是老師。" }
        ]
    },
    {
        id: 3,
        title: "Negation with 不 (bù)",
        description: "Use 不 before a verb or adjective to negate it: 不 + Verb/Adj.",
        examples: [
            "我不是中國人。 (Wǒ bú shì Zhōngguó rén.) — I am not Chinese.",
            "他不高興。 (Tā bù gāoxìng.) — He is not happy."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘I am not a teacher.’", fragments: ["我", "不是", "老師"], answer: "我不是老師。" },
            { id: 2, prompt: "Translate: ‘He is not tall.’", fragments: ["他", "不", "高"], answer: "他不高。" },
            { id: 3, prompt: "Reorder: 不 / 我 / 喜歡 / 咖啡", fragments: ["不", "我", "喜歡", "咖啡"], answer: "我不喜歡咖啡。" },
            { id: 4, prompt: "Make a sentence: She is not busy.", fragments: ["她", "不", "忙"], answer: "她不忙。" },
            { id: 5, prompt: "Translate: ‘We are not students.’", fragments: ["我們", "不是", "學生"], answer: "我們不是學生。" }
        ]
    },
    {
        id: 4,
        title: "Possession with 的 (de)",
        description: "Use 的 to show possession or description: X 的 Y.",
        examples: [
            "我的名字是李明。 (Wǒ de míngzì shì Lǐ Míng.) — My name is Li Ming.",
            "這是她的書。 (Zhè shì tā de shū.) — This is her book."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘My name is Wang.’", fragments: ["我的", "名字", "是", "王"], answer: "我的名字是王。" },
            { id: 2, prompt: "Make a sentence: His book.", fragments: ["他的", "書"], answer: "他的書。" },
            { id: 3, prompt: "Translate: ‘Her friend.’", fragments: ["她的", "朋友"], answer: "她的朋友。" },
            { id: 4, prompt: "Reorder: 的 / 貓 / 我", fragments: ["的", "貓", "我"], answer: "我的貓。" },
            { id: 5, prompt: "Make a sentence: This is my teacher.", fragments: ["這是", "我的", "老師"], answer: "這是我的老師。" }
        ]
    },
    {
        id: 5,
        title: "Yes–No questions with 嗎 (ma)",
        description: "Add 嗎 to the end of a statement to form a yes–no question.",
        examples: [
            "你好嗎？ (Nǐ hǎo ma?) — How are you?",
            "他是老師嗎？ (Tā shì lǎoshī ma?) — Is he a teacher?"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘Are you American?’", fragments: ["你", "是", "美國人", "嗎"], answer: "你是美國人嗎？" },
            { id: 2, prompt: "Make a question: Is she a student?", fragments: ["她", "是", "學生", "嗎"], answer: "她是學生嗎？" },
            { id: 3, prompt: "Translate: ‘Is he busy?’", fragments: ["他", "忙", "嗎"], answer: "他忙嗎？" },
            { id: 4, prompt: "Reorder: 嗎 / 你 / 好", fragments: ["嗎", "你", "好"], answer: "你好嗎？" },
            { id: 5, prompt: "Make a sentence: Are we friends?", fragments: ["我們", "是", "朋友", "嗎"], answer: "我們是朋友嗎？" }
        ]
    },
    {
        id: 6,
        title: "Question words like 什麼 (shénme)",
        description: "Use question words directly in place of what, who, where, etc. No need to move them to the front.",
        examples: [
            "你叫什麼名字？ (Nǐ jiào shénme míngzì?) — What is your name?",
            "你喜歡什麼？ (Nǐ xǐhuan shénme?) — What do you like?"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘What is this?’", fragments: ["這", "是", "什麼"], answer: "這是什麼？" },
            { id: 2, prompt: "Make a question: What do you want?", fragments: ["你", "想要", "什麼"], answer: "你想要什麼？" },
            { id: 3, prompt: "Translate: ‘What are you doing?’", fragments: ["你", "在", "做", "什麼"], answer: "你在做什麼？" },
            { id: 4, prompt: "Make a question: What book is this?", fragments: ["這", "是", "什麼", "書"], answer: "這是什麼書？" },
            { id: 5, prompt: "Translate: ‘What do you eat?’", fragments: ["你", "吃", "什麼"], answer: "你吃什麼？" }
        ]
    },
    {
        id: 7,
        title: "The particle 吧 (ba) for suggestions",
        description: "Add 吧 to the end of a sentence to make a polite suggestion or soften a command.",
        examples: [
            "我們走吧。 (Wǒmen zǒu ba.) — Let’s go.",
            "喝點水吧。 (Hē diǎn shuǐ ba.) — Have some water."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘Let’s eat.’", fragments: ["我們", "吃", "吧"], answer: "我們吃吧。" },
            { id: 2, prompt: "Translate: ‘Let’s go home.’", fragments: ["我們", "回家", "吧"], answer: "我們回家吧。" },
            { id: 3, prompt: "Reorder: 吧 / 我們 / 看電影", fragments: ["吧", "我們", "看電影"], answer: "我們看電影吧。" },
            { id: 4, prompt: "Make a sentence: Have some tea.", fragments: ["喝點", "茶", "吧"], answer: "喝點茶吧。" },
            { id: 5, prompt: "Translate: ‘Let’s rest.’", fragments: ["我們", "休息", "吧"], answer: "我們休息吧。" }
        ]
    },
    {
        id: 8,
        title: "The question word 誰 (shéi) — ‘Who’",
        description: "Use 誰 to ask about people.",
        examples: [
            "他是誰？ (Tā shì shéi?) — Who is he?",
            "你喜歡誰？ (Nǐ xǐhuan shéi?) — Who do you like?"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘Who is your teacher?’", fragments: ["誰", "是", "你的", "老師"], answer: "誰是你的老師？" },
            { id: 2, prompt: "Make a question: Who are you calling?", fragments: ["你", "在", "叫", "誰"], answer: "你在叫誰？" },
            { id: 3, prompt: "Translate: ‘Who likes tea?’", fragments: ["誰", "喜歡", "茶"], answer: "誰喜歡茶？" },
            { id: 4, prompt: "Reorder: 是 / 他 / 誰", fragments: ["是", "他", "誰"], answer: "他是誰？" },
            { id: 5, prompt: "Make a question: Who ate it?", fragments: ["誰", "吃", "了"], answer: "誰吃了？" }
        ]
    },
    {
        id: 9,
        title: "也 (yě) — ‘Also’",
        description: "Place 也 before the verb to say ‘also’ or ‘too’.",
        examples: [
            "我也是學生。 (Wǒ yě shì xuéshēng.) — I am also a student.",
            "他也喜歡茶。 (Tā yě xǐhuan chá.) — He also likes tea."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘I also like coffee.’", fragments: ["我", "也", "喜歡", "咖啡"], answer: "我也喜歡咖啡。" },
            { id: 2, prompt: "Make a sentence: She also studies.", fragments: ["她", "也", "學習"], answer: "她也學習。" },
            { id: 3, prompt: "Reorder: 我 / 也 / 是 / 學生", fragments: ["我", "也", "是", "學生"], answer: "我也是學生。" },
            { id: 4, prompt: "Translate: ‘They also eat.’", fragments: ["他們", "也", "吃"], answer: "他們也吃。" },
            { id: 5, prompt: "Make a sentence: I also have a cat.", fragments: ["我", "也", "有", "一隻", "貓"], answer: "我也有一隻貓。" }
        ]
    },
    {
        id: 10,
        title: "都 (dōu) — ‘All’",
        description: "Place 都 before the verb to indicate all members of a group.",
        examples: [
            "我們都是美國人。 (Wǒmen dōu shì Měiguó rén.) — We are all Americans.",
            "他們都喜歡音樂。 (Tāmen dōu xǐhuan yīnyuè.) — They all like music."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘We all like tea.’", fragments: ["我們", "都", "喜歡", "茶"], answer: "我們都喜歡茶。" },
            { id: 2, prompt: "Make a sentence: They all are students.", fragments: ["他們", "都", "是", "學生"], answer: "他們都是學生。" },
            { id: 3, prompt: "Reorder: 都 / 我們 / 喜歡 / 音樂", fragments: ["都", "我們", "喜歡", "音樂"], answer: "我們都喜歡音樂。" },
            { id: 4, prompt: "Translate: ‘Everyone is here.’", fragments: ["大家", "都", "在", "這兒"], answer: "大家都在這兒。" },
            { id: 5, prompt: "Make a sentence: Parents all come.", fragments: ["爸爸媽媽", "都", "來"], answer: "爸爸媽媽都來。" }
        ]
    },
    {
        id: 11,
        title: "了 (le) — completed action marker",
        description: "Place 了 after a verb to indicate a completed action or change of state.",
        examples: [
            "我吃了。 (Wǒ chī le.) — 我吃了。",
            "他來了。 (Tā lái le.) — 他來了。"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘I finished eating.’", fragments: ["我", "吃", "了"], answer: "我吃了。" },
            { id: 2, prompt: "Make a sentence: He arrived.", fragments: ["他", "來", "了"], answer: "他來了。" },
            { id: 3, prompt: "Reorder: 看 / 了 / 我 / 書", fragments: ["看", "了", "我", "書"], answer: "我看了書。" },
            { id: 4, prompt: "Translate: ‘She has gone.’", fragments: ["她", "走", "了"], answer: "她走了。" },
            { id: 5, prompt: "Make a sentence: I completed homework.", fragments: ["我", "做", "完", "了", "作業"], answer: "我做完了作業。" }
        ]
    },
    {
        id: 12,
        title: "和 (hé) — ‘And’ (for nouns)",
        description: "Use 和 to link nouns or noun phrases, not verbs or clauses.",
        examples: [
            "我和你。 (Wǒ hé nǐ.) — 我和你。",
            "我喜歡茶和咖啡。 (Wǒ xǐhuan chá hé kāfēi.) — 我喜歡茶和咖啡。"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘Mom and Dad.’", fragments: ["媽媽", "和", "爸爸"], answer: "媽媽和爸爸。" },
            { id: 2, prompt: "Make a sentence: I like apples and bananas.", fragments: ["我", "喜歡", "蘋果", "和", "香蕉"], answer: "我喜歡蘋果和香蕉。" },
            { id: 3, prompt: "Reorder: 和 / 他 / 我", fragments: ["和", "他", "我"], answer: "我和他。" },
            { id: 4, prompt: "Translate: ‘She and I are friends.’", fragments: ["她", "和", "我", "是", "朋友"], answer: "她和我是朋友。" },
            { id: 5, prompt: "Make a phrase: Tea and coffee.", fragments: ["茶", "和", "咖啡"], answer: "茶和咖啡。" }
        ]
    },
    {
        id: 13,
        title: "在 (zài) — location marker ‘at / in / on’",
        description: "Use 在 before a location word to say where something or someone is.",
        examples: [
            "我在家。 (Wǒ zài jiā.) — 我在家。",
            "他在學校。 (Tā zài xuéxiào.) — 他在學校。"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘She is at work.’", fragments: ["她", "在", "工作"], answer: "她在工作。" },
            { id: 2, prompt: "Make a sentence: I am at home.", fragments: ["我", "在", "家"], answer: "我在家。" },
            { id: 3, prompt: "Reorder: 在 / 學校 / 他", fragments: ["在", "學校", "他"], answer: "他在學校。" },
            { id: 4, prompt: "Translate: ‘They are at the park.’", fragments: ["他們", "在", "公園"], answer: "他們在公園。" },
            { id: 5, prompt: "Make a sentence: Where are you?", fragments: ["你", "在哪裡", "?"], answer: "你在哪裡？" }
        ]
    },
    {
        id: 14,
        title: "有 (yǒu) — ‘To have’ / existence",
        description: "Use 有 to express possession or existence.",
        examples: [
            "我有一個姐姐。 (Wǒ yǒu yī gè jiějie.) — 我有一個姐姐。",
            "桌子上有書。 (Zhuōzi shàng yǒu shū.) — 桌子上有書。"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘I have a dog.’", fragments: ["我", "有", "一隻", "狗"], answer: "我有一隻狗。" },
            { id: 2, prompt: "Make a sentence: There is a book on the table.", fragments: ["桌子", "上", "有", "書"], answer: "桌子上有書。" },
            { id: 3, prompt: "Reorder: 有 / 我 / 朋友", fragments: ["有", "我", "朋友"], answer: "我有朋友。" },
            { id: 4, prompt: "Translate: ‘Does he have money?’", fragments: ["他", "有", "錢", "嗎"], answer: "他有錢嗎？" },
            { id: 5, prompt: "Make a sentence: I have two brothers.", fragments: ["我", "有", "兩個", "哥哥"], answer: "我有兩個哥哥。" }
        ]
    },
    {
        id: 15,
        title: "沒有 (méiyǒu) — ‘To not have’ / negate 有",
        description: "Use 沒有 instead of 不有 to negate 有.",
        examples: [
            "我沒有錢。 (Wǒ méiyǒu qián.) — 我沒有錢。",
            "他沒有哥哥。 (Tā méiyǒu gēge.) — 他沒有哥哥。"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘I don’t have a car.’", fragments: ["我", "沒有", "車"], answer: "我沒有車。" },
            { id: 2, prompt: "Make a sentence: She has no sister.", fragments: ["她", "沒有", "妹妹"], answer: "她沒有妹妹。" },
            { id: 3, prompt: "Reorder: 沒有 / 錢 / 我", fragments: ["沒有", "錢", "我"], answer: "我沒有錢。" },
            { id: 4, prompt: "Translate: ‘There is no book.’", fragments: ["沒有", "書"], answer: "沒有書。" },
            { id: 5, prompt: "Make a sentence: I don’t have time.", fragments: ["我", "沒有", "時間"], answer: "我沒有時間。" }
        ]
    },
    {
        id: 16,
        title: "Measure words (個, 本, 杯, etc.)",
        description: "Most nouns require a measure word when counted or quantified.",
        examples: [
            "一個人 (yī gè rén) — 一個人",
            "三本書 (sān běn shū) — 三本書"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘two cups of tea.’", fragments: ["兩", "杯", "茶"], answer: "兩杯茶。" },
            { id: 2, prompt: "Make a phrase: three books.", fragments: ["三", "本", "書"], answer: "三本書。" },
            { id: 3, prompt: "Reorder: 個 / 一 / 人", fragments: ["個", "一", "人"], answer: "一個人。" },
            { id: 4, prompt: "Translate: ‘I bought five apples.’", fragments: ["我", "買", "了", "五", "個", "蘋果"], answer: "我買了五個蘋果。" },
            { id: 5, prompt: "Make a sentence: One cup of coffee.", fragments: ["一", "杯", "咖啡"], answer: "一杯咖啡。" }
        ]
    },
    {
        id: 17,
        title: "Adjectives as predicates",
        description: "In Chinese, adjectives can directly serve as predicates without ‘to be’.",
        examples: [
            "她很漂亮。 (Tā hěn piàoliang.) — 她很漂亮。",
            "天氣很熱。 (Tiānqì hěn rè.) — 天氣很熱。"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘He is tall.’", fragments: ["他", "很", "高"], answer: "他很高。" },
            { id: 2, prompt: "Make a sentence: She is pretty.", fragments: ["她", "很", "漂亮"], answer: "她很漂亮。" },
            { id: 3, prompt: "Reorder: 很 / 天氣 / 熱", fragments: ["很", "天氣", "熱"], answer: "天氣很熱。" },
            { id: 4, prompt: "Translate: ‘I am not happy.’ (use 不)", fragments: ["我", "不", "高興"], answer: "我不高興。" },
            { id: 5, prompt: "Make a sentence: Today is cold.", fragments: ["今天", "很", "冷"], answer: "今天很冷。" }
        ]
    },
    {
        id: 18,
        title: "Use of 很 (hěn) as a neutral link",
        description: "很 often functions as a neutral linker between subject and adjective, not always meaning ‘very’.",
        examples: [
            "我很忙。 (Wǒ hěn máng.) — 我很忙。",
            "他很高。 (Tā hěn gāo.) — 他很高。"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘She is smart.’", fragments: ["她", "很", "聰明"], answer: "她很聰明。" },
            { id: 2, prompt: "Make a sentence: I am busy.", fragments: ["我", "很", "忙"], answer: "我很忙。" },
            { id: 3, prompt: "Reorder: 很 / 我 / 忙", fragments: ["很", "我", "忙"], answer: "我很忙。" },
            { id: 4, prompt: "Translate: ‘He is tall.’", fragments: ["他", "很", "高"], answer: "他很高。" },
            { id: 5, prompt: "Make a sentence: The weather is very hot.", fragments: ["天氣", "很", "熱"], answer: "天氣很熱。" }
        ]
    },
    {
        id: 19,
        title: "呢 (ne) — question particle for ‘and you?’",
        description: "Used after a noun or pronoun to return the same question.",
        examples: [
            "我很好。你呢？ (Wǒ hěn hǎo. Nǐ ne?) — 我很好。你呢？",
            "他是學生，你呢？ (Tā shì xuéshēng, nǐ ne?) — 他是學生，你呢？"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘I’m fine. And you?’", fragments: ["我", "很好", "你", "呢"], answer: "我很好。你呢？" },
            { id: 2, prompt: "Make a short exchange using 呢.", fragments: ["你", "忙", "嗎", "我", "呢"], answer: "你忙嗎？我呢？" },
            { id: 3, prompt: "Reorder: 你 / 呢 / 怎麼樣", fragments: ["你", "呢", "怎麼樣"], answer: "你怎麼樣？" },
            { id: 4, prompt: "Translate: ‘What about him?’", fragments: ["他", "呢"], answer: "他呢？" },
            { id: 5, prompt: "Make a question: Are you hungry? And you?", fragments: ["你", "餓", "嗎", "我", "呢"], answer: "你餓嗎？我呢？" }
        ]
    },
    {
        id: 20,
        title: "Time expressions before the verb",
        description: "Time phrases like 今天 or 明天 usually appear before the verb in a sentence.",
        examples: [
            "我今天去學校。 (Wǒ jīntiān qù xuéxiào.) — 我今天去學校。",
            "他明天工作。 (Tā míngtiān gōngzuò.) — 他明天工作。"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘She will eat dinner tonight.’", fragments: ["她", "今天", "吃", "晚飯"], answer: "她今天吃晚飯。" },
            { id: 2, prompt: "Make a sentence: I go to school tomorrow.", fragments: ["我", "明天", "去", "學校"], answer: "我明天去學校。" },
            { id: 3, prompt: "Reorder: 今天 / 我 / 看電影", fragments: ["今天", "我", "看電影"], answer: "我今天看電影。" },
            { id: 4, prompt: "Translate: ‘He worked yesterday.’", fragments: ["他", "昨天", "工作", "了"], answer: "他昨天工作了。" },
            { id: 5, prompt: "Make a sentence: We will meet next week.", fragments: ["我們", "下個星期", "見面"], answer: "我們下個星期見面。" }
        ]
    }
];
