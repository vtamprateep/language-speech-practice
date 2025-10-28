export interface LessonModule {
    id: string;
    title: string;
    description: string;
    vocabularyId: number[]; // Hydrated with Vocabulary
    grammarId: number[] | null; // Hydrated with GrammarRule
    dialogueId: string | null;
    scenarioId?: string | null;
}


export interface LessonCollection {
    id: string;
    title: string;
    description: string;
    lessons: LessonModule[];
}

export const allLessons: LessonModule[] = [
    {
        id: "lesson-1",
        title: "Getting Started",
        description: "Introduce basic personal pronouns and starter vocabulary.",
        vocabularyId: [
            7787, // 你好
            114, // 我
            7788, // 你
            7789, // 他
            7790, // 她
            490, // 不
            125, // 的
            126, // 誰
            7791 // 名字
        ],
        grammarId: [2],
        dialogueId: null,
    },
    {
        id: "lesson-2",
        title: "Essential Verbs: To Be & To Have",
        description: "Teach foundational verbs 是 and 有, and how to use them in simple statements.",
        vocabularyId: [
            124, // 是
            424, // 有
            489, // 沒有
            121, // 在
            490, // 不
            7791, // 名字
            329, // 什麼/甚麼
            126, // 誰
        ],
        grammarId: [], //["Using 是 for identification", "Negation with 不 or 沒有", "Possession with 有 and 沒有"],
        dialogueId: null,
    },
    // {
    //     id: "lesson-3",
    //     title: ""
    // }
]


export const gettingStartedLessons = [
    {
        id: "lesson-3",
        name: "Greetings & Polite Expressions",
        objective: "Teach basic greetings and polite phrases used in everyday interactions.",
        vocabularyId: [7787, 116, 309, 305, 466, 307, 306, 36, 39, 40], // 你好, 您, 再見, 謝謝, 請, 對不起, 不客氣, 早上, 下午, 晚上
        grammarPoints: ["Politeness particles", "Using 請 for polite requests"],
        speakingFocus: "Greeting others naturally and politely.",
        outcome: "Learners can greet others appropriately and respond politely in different social settings."
    },
    {
        id: "lesson-4",
        name: "Names & Introductions",
        objective: "Teach how to ask and state names, and introduce oneself and others.",
        vocabularyId: [327, 7791, 304, 83, 491], // 叫, 名字, 認識, 高興, 也
        grammarPoints: ["Question structure: 你叫什麼名字？", "Using 也 and 很 for simple sentence linking"],
        speakingFocus: "Exchanging names and making introductions.",
        outcome: "Learners can introduce themselves and ask for someone’s name naturally."
    },
    {
        id: "lesson-5",
        name: "Simple Questions with 吗 and 呢",
        objective: "Introduce basic yes/no and follow-up question structures used in introductions.",
        vocabularyId: [330, 331, 124, 150, 131, 502, 11, 600], // 嗎, 呢, 是, 學生, 老師, 中國人, 美國人, 同學
        grammarPoints: ["Yes/No questions with 吗", "Follow-up questions with 呢"],
        speakingFocus: "Asking and responding to simple yes/no questions.",
        outcome: "Learners can use 吗 and 呢 to form and answer basic questions naturally."
    },
    {
        id: "lesson-6",
        name: "Countries & Nationalities",
        objective: "Teach country names and how to say where someone is from.",
        vocabularyId: [9, 10, 11, 12, 8, 367, 123, 121, 344], // 中國, 台灣, 美國, 日本, 國家, 哪裡, 從, 在, 去
        grammarPoints: ["Asking about origin with 哪裡 and 哪國", "Prepositions: 從, 在, 去"],
        speakingFocus: "Talking about where someone is from.",
        outcome: "Learners can ask and answer questions like 你是哪里人？ and 你從哪裡來？"
    },
    {
        id: "lesson-7",
        name: "Professions & Roles",
        objective: "Introduce common jobs and titles to describe people’s roles and occupations.",
        vocabularyId: [131, 132, 133, 134, 135, 141, 137, 136, 315], // 老師, 醫生, 護士, 司機, 老闆/老板, 工作, 公司, 同事, 做
        grammarPoints: ["Using 是 for professions", "Question word 谁/誰"],
        speakingFocus: "Describing and asking about what people do.",
        outcome: "Learners can describe occupations using basic sentence structures like 他是醫生."
    },
    {
        id: "lesson-8",
        name: "Putting It All Together: Self-Introductions",
        objective: "Integrate pronouns, verbs, greetings, and vocabulary into a complete self-introduction.",
        vocabularyId: [87, 184, 614], // 喜歡, 學習, 中文
        grammarPoints: ["Combining learned structures", "Sentence connectors with 和 and 也"],
        speakingFocus: "Delivering a short self-introduction naturally and confidently.",
        outcome: "Learners can introduce themselves including name, nationality, occupation, and interests."
    }
];

export const lessonKeys = allLessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description
}));
