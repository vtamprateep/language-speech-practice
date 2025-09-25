// data/grammar.ts

export interface GrammarRule {
    id: string;
    title: string;
    description: string;
    examples: string[];
    practice: string[];
}

export const grammarRules: GrammarRule[] = [
    {
        id: "word-order",
        title: "Basic Word Order: Subject + Verb + Object (SVO)",
        description: "Mandarin Chinese generally follows the Subject-Verb-Object order, just like English.",
        examples: [
            "我吃苹果。 (I eat apples.)",
            "他喜欢音乐。 (He likes music.)",
        ],
        practice: [
            "她 ___ 咖啡。",
            "我 ___ 中文。",
            "你 ___ 水。",
            "他们 ___ 饭。",
            "我们 ___ 电影。",
        ]
    },
    {
        id: "shi-sentences",
        title: "Using 是 (shì) for 'to be'",
        description: "是 is used to link a subject with a noun, but not with adjectives.",
        examples: [
            "我是老师。 (I am a teacher.)",
            "他是学生。 (He is a student.)",
        ],
        practice: [
            "她 ___ 医生。",
            "我们 ___ 朋友。",
            "你 ___ 中国人吗？",
            "他不是老师，他 ___ 学生。",
            "我 ___ 学生。",
        ]
    },
    {
        id: "measure-words",
        title: "Measure Words (量词)",
        description: "In Mandarin, nouns require measure words when counted or specified.",
        examples: [
            "一个人 (one person)",
            "三本书 (three books)",
        ],
        practice: [
            "两 ___ 苹果。",
            "五 ___ 狗。",
            "一 ___ 杯水。",
            "三 ___ 电影票。",
            "十 ___ 笔。",
        ]
    },
    {
        id: "negation",
        title: "Negation with 不 and 没",
        description: "不 is used for negating verbs in general, 没 is used for past actions or 'to not have'.",
        examples: [
            "我不喜欢咖啡。 (I don’t like coffee.)",
            "我没去过中国。 (I haven’t been to China.)",
        ],
        practice: [
            "我 ___ 想去。",
            "他 ___ 吃苹果。",
            "我 ___ 看过这本书。",
            "我们 ___ 学过这个。",
            "你 ___ 去过北京吗？",
        ]
    },
    {
        id: "questions-ma",
        title: "Yes/No Questions with 吗",
        description: "Add 吗 at the end of a statement to make it a yes/no question.",
        examples: [
            "你喜欢中国菜吗？ (Do you like Chinese food?)",
            "他是学生吗？ (Is he a student?)",
        ],
        practice: [
            "你是老师 ___ ？",
            "他会说中文 ___ ？",
            "你要去吗 ___ ？",
            "我们在北京 ___ ？",
            "你有朋友 ___ ？",
        ]
    },
    {
        id: "zai-location",
        title: "Using 在 to Indicate Location",
        description: "在 is used to show where someone or something is located.",
        examples: [
            "我在学校。 (I am at school.)",
            "书在桌子上。 (The book is on the table.)",
        ],
        practice: [
            "他 ___ 家。",
            "狗 ___ 桌子下。",
            "我们 ___ 北京。",
            "手机 ___ 包里。",
            "老师 ___ 教室。",
        ]
    },
    {
        id: "you-possession",
        title: "Using 有 for Possession",
        description: "有 means 'to have' and is used to show possession or existence.",
        examples: [
            "我有一本书。 (I have a book.)",
            "学校有很多学生。 (The school has many students.)",
        ],
        practice: [
            "他 ___ 一只狗。",
            "你 ___ 哥哥吗？",
            "我们 ___ 中文课。",
            "他们 ___ 车。",
            "我没有 ___ 钱。",
        ]
    },
    {
        id: "le-past",
        title: "了 (le) for Completed Actions",
        description: "了 is used after a verb to indicate a completed action.",
        examples: [
            "我吃了饭。 (I ate a meal.)",
            "他去了北京。 (He went to Beijing.)",
        ],
        practice: [
            "我 ___ 看电影。",
            "他们 ___ 买书。",
            "我们 ___ 去商店。",
            "他 ___ 学中文。",
            "你 ___ 喝水了吗？",
        ]
    },
    {
        id: "guo-experience",
        title: "过 (guo) for Past Experience",
        description: "过 indicates that someone has experienced something in the past.",
        examples: [
            "我去过中国。 (I have been to China.)",
            "你看过这部电影吗？ (Have you seen this movie?)",
        ],
        practice: [
            "你 ___ 吃过火锅吗？",
            "我 ___ 去过北京。",
            "他们没 ___ 来过这里。",
            "他 ___ 看过这本书。",
            "我们 ___ 听过这个词。",
        ]
    },
    {
        id: "ba-construction",
        title: "把字句 (bǎ construction)",
        description: "The 把 construction emphasizes the result of an action on an object.",
        examples: [
            "他把书放在桌子上。 (He put the book on the table.)",
            "我把门关上了。 (I closed the door.)",
        ],
        practice: [
            "请你 ___ 门关上。",
            "他 ___ 作业写完了。",
            "他们 ___ 苹果吃了。",
            "我 ___ 衣服洗了。",
            "我们 ___ 椅子搬进来。",
        ]
    },
];
