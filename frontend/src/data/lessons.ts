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
            7791, // 名字
            7798, // 我們 (we)
        ],
        grammarId: [],
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
    {
        "id": "lesson-3",
        "title": "First Sentences",
        "description": "Introduce basic nouns to form simple 'to be' and 'to have' sentences.",
        "vocabularyId": [
            150,  // 人 (person)
            132,  // 醫生 (doctor)
            7792, // 老師 (teacher)
            7793, // 學生 (student)
            7794, // 家 (home)
            7795, // 書 (book)
            7796, // 水 (water)
            7797, // 狗 (dog)
            7799, // 朋友 (friend)
            7800  // 中國人 (Chinese person)
        ],
        "grammarId": [2],
        "dialogueId": null
    }
]

export const lessonKeys = allLessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description
}));
