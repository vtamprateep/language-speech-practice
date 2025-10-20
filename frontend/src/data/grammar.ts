// data/grammar.ts

export interface GrammarRule {
    id: number;
    title: string;
    description: string;
    examples: string[];
    practice: string[];
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
            "Translate: ‘I like you.’",
            "Make a sentence: 我 + Verb + Object."
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
            "Translate: ‘She is a doctor.’",
            "Make a sentence: 我是 + …"
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
            "Translate: ‘I am not a teacher.’",
            "Make a sentence: 他不 + Adj."
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
            "Translate: ‘My name is Wang.’",
            "Make a sentence: 他/她的 + Noun."
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
            "Translate: ‘Are you American?’",
            "Make a sentence: 你是 + … + 吗？"
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
            "Translate: ‘What is this?’",
            "Make a question using 什么."
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
            "Translate: ‘Let’s eat.’",
            "Make a sentence ending with 吧."
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
            "Translate: ‘Who is your teacher?’",
            "Make a question using 谁."
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
            "Translate: ‘I also like coffee.’",
            "Make a sentence using 也."
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
            "Translate: ‘We all like tea.’",
            "Make a sentence using 都."
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
            "Translate: ‘I finished eating.’",
            "Make a sentence with 了 after the verb."
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
            "Translate: ‘Mom and Dad.’",
            "Make a sentence using 和."
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
            "Translate: ‘She is at work.’",
            "Make a sentence with 在."
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
            "Translate: ‘I have a dog.’",
            "Make a sentence: 桌子上有 + …"
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
            "Translate: ‘I don’t have a car.’",
            "Make a sentence using 没有."
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
            "Translate: ‘two cups of tea.’",
            "Make a phrase with 个 or 本."
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
            "Translate: ‘He is tall.’",
            "Make a sentence: Subject + 很 + Adj."
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
            "Translate: ‘She is smart.’",
            "Make a sentence with 很 + Adj."
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
            "Translate: ‘I’m fine. And you?’",
            "Make a short exchange using 呢."
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
            "Translate: ‘She will eat dinner tonight.’",
            "Make a sentence starting with 今天."
        ]
    }
];
