export interface GrammarPractice {
    id: number;
    prompt: string;
    fragments: string[];
    correct: string;
}

export interface GrammarRule {
    id: number;
    title: string;
    description: string;
    examples: string[];
    practice: GrammarPractice[];
}

export const grammarRules: GrammarRule[] = [
    {
        id: 1,
        title: "Basic sentence order: Subject + Verb (+ Object)",
        description: "The basic Chinese sentence structure is Subject + Verb + Object.",
        examples: [
            "我爱你。 (Wǒ ài nǐ.) — I love you.",
            "他吃苹果。 (Tā chī píngguǒ.) — He eats an apple."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘I like you.’", fragments: ["我", "喜欢", "你"], correct: "我喜欢你。" },
            { id: 2, prompt: "Reorder: 吃 / 他 / 米饭", fragments: ["吃", "他", "米饭"], correct: "他吃米饭。" },
            { id: 3, prompt: "Make a sentence: 我 + 看书", fragments: ["我", "看书"], correct: "我看书。" },
            { id: 4, prompt: "Translate: ‘She eats fruit.’", fragments: ["她", "吃", "水果"], correct: "她吃水果。" },
            { id: 5, prompt: "Reorder: 爱 / 我 / 他", fragments: ["爱", "我", "他"], correct: "他爱我。" }
        ]
    },
    {
        id: 2,
        title: "A 是 B — ‘A is B’",
        description: "Use 是 to link a subject and a noun, meaning ‘to be’.",
        examples: [
            "我是学生。 (Wǒ shì xuéshēng.) — I am a student.",
            "他是老师。 (Tā shì lǎoshī.) — He is a teacher."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘She is a doctor.’", fragments: ["她", "是", "医生"], correct: "她是医生。" },
            { id: 2, prompt: "Translate: ‘You are Chinese.’", fragments: ["你", "是", "中国人"], correct: "你是中国人。" },
            { id: 3, prompt: "Reorder: 是 / 他 / 学生", fragments: ["是", "他", "学生"], correct: "他是学生。" },
            { id: 4, prompt: "Make a sentence: We are friends.", fragments: ["我们", "是", "朋友"], correct: "我们是朋友。" },
            { id: 5, prompt: "Translate: ‘I am a teacher.’", fragments: ["我", "是", "老师"], correct: "我是老师。" }
        ]
    },
    {
        id: 3,
        title: "Negation with 不 (bù)",
        description: "Use 不 before a verb or adjective to negate it: 不 + Verb/Adj.",
        examples: [
            "我不是中国人。 (Wǒ bú shì Zhōngguó rén.) — I am not Chinese.",
            "他不高兴。 (Tā bù gāoxìng.) — He is not happy."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘I am not a teacher.’", fragments: ["我", "不是", "老师"], correct: "我不是老师。" },
            { id: 2, prompt: "Translate: ‘He is not tall.’", fragments: ["他", "不", "高"], correct: "他不高。" },
            { id: 3, prompt: "Reorder: 不 / 我 / 喜欢 / 咖啡", fragments: ["不", "我", "喜欢", "咖啡"], correct: "我不喜欢咖啡。" },
            { id: 4, prompt: "Make a sentence: She is not busy.", fragments: ["她", "不", "忙"], correct: "她不忙。" },
            { id: 5, prompt: "Translate: ‘We are not students.’", fragments: ["我们", "不是", "学生"], correct: "我们不是学生。" }
        ]
    },
    {
        id: 4,
        title: "Possession with 的 (de)",
        description: "Use 的 to show possession or description: X 的 Y.",
        examples: [
            "我的名字是李明。 (Wǒ de míngzì shì Lǐ Míng.) — My name is Li Ming.",
            "这是她的书。 (Zhè shì tā de shū.) — This is her book."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘My name is Wang.’", fragments: ["我的", "名字", "是", "王"], correct: "我的名字是王。" },
            { id: 2, prompt: "Make a sentence: His book.", fragments: ["他的", "书"], correct: "他的书。" },
            { id: 3, prompt: "Translate: ‘Her friend.’", fragments: ["她的", "朋友"], correct: "她的朋友。" },
            { id: 4, prompt: "Reorder: 的 / 猫 / 我", fragments: ["的", "猫", "我"], correct: "我的猫。" },
            { id: 5, prompt: "Make a sentence: This is my teacher.", fragments: ["这是", "我的", "老师"], correct: "这是我的老师。" }
        ]
    },
    {
        id: 5,
        title: "Yes–No questions with 吗 (ma)",
        description: "Add 吗 to the end of a statement to form a yes–no question.",
        examples: [
            "你好吗？ (Nǐ hǎo ma?) — How are you?",
            "他是老师吗？ (Tā shì lǎoshī ma?) — Is he a teacher?"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘Are you American?’", fragments: ["你", "是", "美国人", "吗"], correct: "你是美国人吗？" },
            { id: 2, prompt: "Make a question: Is she a student?", fragments: ["她", "是", "学生", "吗"], correct: "她是学生吗？" },
            { id: 3, prompt: "Translate: ‘Is he busy?’", fragments: ["他", "忙", "吗"], correct: "他忙吗？" },
            { id: 4, prompt: "Reorder: 吗 / 你 / 好", fragments: ["吗", "你", "好"], correct: "你好吗？" },
            { id: 5, prompt: "Make a sentence: Are we friends?", fragments: ["我们", "是", "朋友", "吗"], correct: "我们是朋友吗？" }
        ]
    },
    {
        id: 6,
        title: "Question words like 什么 (shénme)",
        description: "Use question words directly in place of what, who, where, etc. No need to move them to the front.",
        examples: [
            "你叫什么名字？ (Nǐ jiào shénme míngzì?) — What is your name?",
            "你喜欢什么？ (Nǐ xǐhuan shénme?) — What do you like?"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘What is this?’", fragments: ["这", "是", "什么"], correct: "这是什么？" },
            { id: 2, prompt: "Make a question: What do you want?", fragments: ["你", "想要", "什么"], correct: "你想要什么？" },
            { id: 3, prompt: "Translate: ‘What are you doing?’", fragments: ["你", "在", "做", "什么"], correct: "你在做什么？" },
            { id: 4, prompt: "Make a question: What book is this?", fragments: ["这", "是", "什么", "书"], correct: "这是什么书？" },
            { id: 5, prompt: "Translate: ‘What do you eat?’", fragments: ["你", "吃", "什么"], correct: "你吃什么？" }
        ]
    },
    {
        id: 7,
        title: "The particle 吧 (ba) for suggestions",
        description: "Add 吧 to the end of a sentence to make a polite suggestion or soften a command.",
        examples: [
            "我们走吧。 (Wǒmen zǒu ba.) — Let’s go.",
            "喝点水吧。 (Hē diǎn shuǐ ba.) — Have some water."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘Let’s eat.’", fragments: ["我们", "吃", "吧"], correct: "我们吃吧。" },
            { id: 2, prompt: "Translate: ‘Let’s go home.’", fragments: ["我们", "回家", "吧"], correct: "我们回家吧。" },
            { id: 3, prompt: "Reorder: 吧 / 我们 / 看电影", fragments: ["吧", "我们", "看电影"], correct: "我们看电影吧。" },
            { id: 4, prompt: "Make a sentence: Have some tea.", fragments: ["喝点", "茶", "吧"], correct: "喝点茶吧。" },
            { id: 5, prompt: "Translate: ‘Let’s rest.’", fragments: ["我们", "休息", "吧"], correct: "我们休息吧。" }
        ]
    },
    {
        id: 8,
        title: "The question word 谁 (shéi) — ‘Who’",
        description: "Use 谁 to ask about people.",
        examples: [
            "他是谁？ (Tā shì shéi?) — Who is he?",
            "你喜欢谁？ (Nǐ xǐhuan shéi?) — Who do you like?"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘Who is your teacher?’", fragments: ["谁", "是", "你的", "老师"], correct: "谁是你的老师？" },
            { id: 2, prompt: "Make a question: Who are you calling?", fragments: ["你", "在", "叫", "谁"], correct: "你在叫谁？" },
            { id: 3, prompt: "Translate: ‘Who likes tea?’", fragments: ["谁", "喜欢", "茶"], correct: "谁喜欢茶？" },
            { id: 4, prompt: "Reorder: 是 / 他 / 谁", fragments: ["是", "他", "谁"], correct: "他是谁？" },
            { id: 5, prompt: "Make a question: Who ate it?", fragments: ["谁", "吃", "了"], correct: "谁吃了？" }
        ]
    },
    {
        id: 9,
        title: "也 (yě) — ‘Also’",
        description: "Place 也 before the verb to say ‘also’ or ‘too’.",
        examples: [
            "我也是学生。 (Wǒ yě shì xuéshēng.) — I am also a student.",
            "他也喜欢茶。 (Tā yě xǐhuan chá.) — He also likes tea."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘I also like coffee.’", fragments: ["我", "也", "喜欢", "咖啡"], correct: "我也喜欢咖啡。" },
            { id: 2, prompt: "Make a sentence: She also studies.", fragments: ["她", "也", "学", "习"], correct: "她也学习。" },
            { id: 3, prompt: "Reorder: 我 / 也 / 是 / 学生", fragments: ["我", "也", "是", "学生"], correct: "我也是学生。" },
            { id: 4, prompt: "Translate: ‘They also eat.’", fragments: ["他们", "也", "吃"], correct: "他们也吃。" },
            { id: 5, prompt: "Make a sentence: I also have a cat.", fragments: ["我", "也", "有", "一只", "猫"], correct: "我也有一只猫。" }
        ]
    },
    {
        id: 10,
        title: "都 (dōu) — ‘All’",
        description: "Place 都 before the verb to indicate all members of a group.",
        examples: [
            "我们都是美国人。 (Wǒmen dōu shì Měiguó rén.) — We are all Americans.",
            "他们都喜欢音乐。 (Tāmen dōu xǐhuan yīnyuè.) — They all like music."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘We all like tea.’", fragments: ["我们", "都", "喜欢", "茶"], correct: "我们都喜欢茶。" },
            { id: 2, prompt: "Make a sentence: They all are students.", fragments: ["他们", "都", "是", "学生"], correct: "他们都是学生。" },
            { id: 3, prompt: "Reorder: 都 / 我们 / 喜欢 / 音乐", fragments: ["都", "我们", "喜欢", "音乐"], correct: "我们都喜欢音乐。" },
            { id: 4, prompt: "Translate: ‘Everyone is here.’", fragments: ["大家", "都", "在", "这儿"], correct: "大家都在这儿。" },
            { id: 5, prompt: "Make a sentence: Parents all come.", fragments: ["爸爸妈妈", "都", "来"], correct: "爸爸妈妈都来。" }
        ]
    },
    {
        id: 11,
        title: "了 (le) — completed action marker",
        description: "Place 了 after a verb to indicate a completed action or change of state.",
        examples: [
            "我吃了。 (Wǒ chī le.) — I ate.",
            "他来了。 (Tā lái le.) — He came."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘I finished eating.’", fragments: ["我", "吃", "了"], correct: "我吃了。" },
            { id: 2, prompt: "Make a sentence: He arrived.", fragments: ["他", "来", "了"], correct: "他来了。" },
            { id: 3, prompt: "Reorder: 看 / 了 / 我 / 书", fragments: ["看", "了", "我", "书"], correct: "我看了书。" },
            { id: 4, prompt: "Translate: ‘She has gone.’", fragments: ["她", "走", "了"], correct: "她走了。" },
            { id: 5, prompt: "Make a sentence: I completed homework.", fragments: ["我", "做", "完", "了", "作业"], correct: "我做完了作业。" }
        ]
    },
    {
        id: 12,
        title: "和 (hé) — ‘And’ (for nouns)",
        description: "Use 和 to link nouns or noun phrases, not verbs or clauses.",
        examples: [
            "我和你。 (Wǒ hé nǐ.) — You and I.",
            "我喜欢茶和咖啡。 (Wǒ xǐhuan chá hé kāfēi.) — I like tea and coffee."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘Mom and Dad.’", fragments: ["妈妈", "和", "爸爸"], correct: "妈妈和爸爸。" },
            { id: 2, prompt: "Make a sentence: I like apples and bananas.", fragments: ["我", "喜欢", "苹果", "和", "香蕉"], correct: "我喜欢苹果和香蕉。" },
            { id: 3, prompt: "Reorder: 和 / 他 / 我", fragments: ["和", "他", "我"], correct: "我和他。" },
            { id: 4, prompt: "Translate: ‘She and I are friends.’", fragments: ["她", "和", "我", "是", "朋友"], correct: "她和我是朋友。" },
            { id: 5, prompt: "Make a phrase: Tea and coffee.", fragments: ["茶", "和", "咖啡"], correct: "茶和咖啡。" }
        ]
    },
    {
        id: 13,
        title: "在 (zài) — location marker ‘at / in / on’",
        description: "Use 在 before a location word to say where something or someone is.",
        examples: [
            "我在家。 (Wǒ zài jiā.) — I am at home.",
            "他在学校。 (Tā zài xuéxiào.) — He is at school."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘She is at work.’", fragments: ["她", "在", "工作"], correct: "她在工作。" },
            { id: 2, prompt: "Make a sentence: I am at home.", fragments: ["我", "在", "家"], correct: "我在家。" },
            { id: 3, prompt: "Reorder: 在 / 学校 / 他", fragments: ["在", "学校", "他"], correct: "他在学校。" },
            { id: 4, prompt: "Translate: ‘They are at the park.’", fragments: ["他们", "在", "公园"], correct: "他们在公园。" },
            { id: 5, prompt: "Make a sentence: Where are you?", fragments: ["你", "在哪里", "?"], correct: "你在哪里？" }
        ]
    },
    {
        id: 14,
        title: "有 (yǒu) — ‘To have’ / existence",
        description: "Use 有 to express possession or existence.",
        examples: [
            "我有一个姐姐。 (Wǒ yǒu yī gè jiějie.) — I have a sister.",
            "桌子上有书。 (Zhuōzi shàng yǒu shū.) — There is a book on the table."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘I have a dog.’", fragments: ["我", "有", "一只", "狗"], correct: "我有一只狗。" },
            { id: 2, prompt: "Make a sentence: There is a book on the table.", fragments: ["桌子", "上", "有", "书"], correct: "桌子上有书。" },
            { id: 3, prompt: "Reorder: 有 / 我 / 朋友", fragments: ["有", "我", "朋友"], correct: "我有朋友。" },
            { id: 4, prompt: "Translate: ‘Does he have money?’", fragments: ["他", "有", "钱", "吗"], correct: "他有钱吗？" },
            { id: 5, prompt: "Make a sentence: I have two brothers.", fragments: ["我", "有", "两个", "哥哥"], correct: "我有两个哥哥。" }
        ]
    },
    {
        id: 15,
        title: "没有 (méiyǒu) — ‘To not have’ / negate 有",
        description: "Use 没有 instead of 不有 to negate 有.",
        examples: [
            "我没有钱。 (Wǒ méiyǒu qián.) — I don’t have money.",
            "他没有哥哥。 (Tā méiyǒu gēge.) — He doesn’t have an older brother."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘I don’t have a car.’", fragments: ["我", "没有", "车"], correct: "我没有车。" },
            { id: 2, prompt: "Make a sentence: She has no sister.", fragments: ["她", "没有", "妹妹"], correct: "她没有妹妹。" },
            { id: 3, prompt: "Reorder: 没有 / 钱 / 我", fragments: ["没有", "钱", "我"], correct: "我没有钱。" },
            { id: 4, prompt: "Translate: ‘There is no book.’", fragments: ["没有", "书"], correct: "没有书。" },
            { id: 5, prompt: "Make a sentence: I don’t have time.", fragments: ["我", "没有", "时间"], correct: "我没有时间。" }
        ]
    },
    {
        id: 16,
        title: "Measure words (个, 本, 杯, etc.)",
        description: "Most nouns require a measure word when counted or quantified.",
        examples: [
            "一个人 (yī gè rén) — one person",
            "三本书 (sān běn shū) — three books"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘two cups of tea.’", fragments: ["两", "杯", "茶"], correct: "两杯茶。" },
            { id: 2, prompt: "Make a phrase: three books.", fragments: ["三", "本", "书"], correct: "三本书。" },
            { id: 3, prompt: "Reorder: 个 / 一 / 人", fragments: ["个", "一", "人"], correct: "一个人。" },
            { id: 4, prompt: "Translate: ‘I bought five apples.’", fragments: ["我", "买", "了", "五", "个", "苹果"], correct: "我买了五个苹果。" },
            { id: 5, prompt: "Make a sentence: One cup of coffee.", fragments: ["一", "杯", "咖啡"], correct: "一杯咖啡。" }
        ]
    },
    {
        id: 17,
        title: "Adjectives as predicates",
        description: "In Chinese, adjectives can directly serve as predicates without ‘to be’.",
        examples: [
            "她很漂亮。 (Tā hěn piàoliang.) — She is beautiful.",
            "天气很热。 (Tiānqì hěn rè.) — The weather is hot."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘He is tall.’", fragments: ["他", "很", "高"], correct: "他很高。" },
            { id: 2, prompt: "Make a sentence: She is pretty.", fragments: ["她", "很", "漂亮"], correct: "她很漂亮。" },
            { id: 3, prompt: "Reorder: 很 / 天气 / 热", fragments: ["很", "天气", "热"], correct: "天气很热。" },
            { id: 4, prompt: "Translate: ‘I am not happy.’ (use 不)", fragments: ["我", "不", "高兴"], correct: "我不高兴。" },
            { id: 5, prompt: "Make a sentence: Today is cold.", fragments: ["今天", "很", "冷"], correct: "今天很冷。" }
        ]
    },
    {
        id: 18,
        title: "Use of 很 (hěn) as a neutral link",
        description: "很 often functions as a neutral linker between subject and adjective, not always meaning ‘very’.",
        examples: [
            "我很忙。 (Wǒ hěn máng.) — I am busy.",
            "他很高。 (Tā hěn gāo.) — He is tall."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘She is smart.’", fragments: ["她", "很", "聪明"], correct: "她很聪明。" },
            { id: 2, prompt: "Make a sentence: I am busy.", fragments: ["我", "很", "忙"], correct: "我很忙。" },
            { id: 3, prompt: "Reorder: 很 / 我 / 忙", fragments: ["很", "我", "忙"], correct: "我很忙。" },
            { id: 4, prompt: "Translate: ‘He is tall.’", fragments: ["他", "很", "高"], correct: "他很高。" },
            { id: 5, prompt: "Make a sentence: The weather is very hot.", fragments: ["天气", "很", "热"], correct: "天气很热。" }
        ]
    },
    {
        id: 19,
        title: "呢 (ne) — question particle for ‘and you?’",
        description: "Used after a noun or pronoun to return the same question.",
        examples: [
            "我很好。你呢？ (Wǒ hěn hǎo. Nǐ ne?) — I’m good. And you?",
            "他是学生，你呢？ (Tā shì xuéshēng, nǐ ne?) — He’s a student, what about you?"
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘I’m fine. And you?’", fragments: ["我", "很好", "你", "呢"], correct: "我很好。你呢？" },
            { id: 2, prompt: "Make a short exchange using 呢.", fragments: ["你", "忙", "吗", "我", "呢"], correct: "你忙吗？我呢？" },
            { id: 3, prompt: "Reorder: 你 / 呢 / 怎么样", fragments: ["你", "呢", "怎么样"], correct: "你怎么样？" },
            { id: 4, prompt: "Translate: ‘What about him?’", fragments: ["他", "呢"], correct: "他呢？" },
            { id: 5, prompt: "Make a question: Are you hungry? And you?", fragments: ["你", "饿", "吗", "我", "呢"], correct: "你饿吗？我呢？" }
        ]
    },
    {
        id: 20,
        title: "Time expressions before the verb",
        description: "Time phrases like 今天 or 明天 usually appear before the verb in a sentence.",
        examples: [
            "我今天去学校。 (Wǒ jīntiān qù xuéxiào.) — I’m going to school today.",
            "他明天工作。 (Tā míngtiān gōngzuò.) — He works tomorrow."
        ],
        practice: [
            { id: 1, prompt: "Translate: ‘She will eat dinner tonight.’", fragments: ["她", "今天", "吃", "晚饭"], correct: "她今天吃晚饭。" },
            { id: 2, prompt: "Make a sentence: I go to school tomorrow.", fragments: ["我", "明天", "去", "学校"], correct: "我明天去学校。" },
            { id: 3, prompt: "Reorder: 今天 / 我 / 看电影", fragments: ["今天", "我", "看电影"], correct: "我今天看电影。" },
            { id: 4, prompt: "Translate: ‘He worked yesterday.’", fragments: ["他", "昨天", "工作", "了"], correct: "他昨天工作了。" },
            { id: 5, prompt: "Make a sentence: We will meet next week.", fragments: ["我们", "下个星期", "见面"], correct: "我们下个星期见面。" }
        ]
    }
];
