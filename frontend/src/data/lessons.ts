import { VocabularyItem } from "./vocabulary";
import { GrammarRule } from "./grammar";
import { DialogueTurn } from "./scenarios";


export interface LessonModule {
    id: string;
    title: string;
    description: string;
    vocabulary: VocabularyItem[];
    grammar: GrammarRule[];
    dialogue: DialogueTurn[];
    scenarioId?: string;
}


export interface LessonCollection {
    id: string;
    title: string;
    description: string;
    lessons: LessonModule[];
}


export const introducingYourselfLesson: LessonModule = {
    id: "lesson-1",
    title: "Introducing Yourself",
    description: "Learn how to greet people and introduce yourself in Mandarin.",
    vocabulary: [  // TODO: Each vocabulary should reference an ID, so we don't duplicate it
        {
            simplified: "你",
            radical: "亻",
            level: ["HSK1"],
            frequency: 5,
            pos: ["pronoun"],
            forms: [
                {
                    traditional: "你",
                    transcriptions: {
                        pinyin: "nǐ",
                        bopomofo: "ㄋㄧˇ",
                    },
                    meanings: ["you"],
                    classifiers: []
                }
            ]
        },
        {
            simplified: "我",
            radical: "戈",
            level: ["HSK1"],
            frequency: 1,
            pos: ["pronoun"],
            forms: [
                {
                    traditional: "我",
                    transcriptions: {
                        pinyin: "wǒ",
                        bopomofo: "ㄨㄛˇ",
                    },
                    meanings: ["I", "me"],
                    classifiers: []
                }
            ]
        },
        {
            simplified: "他",
            radical: "亻",
            level: ["HSK1"],
            frequency: 3,
            pos: ["pronoun"],
            forms: [
                {
                    traditional: "他",
                    transcriptions: {
                        pinyin: "tā",
                        bopomofo: "ㄊㄚ",
                    },
                    meanings: ["he", "him"],
                    classifiers: []
                }
            ]
        },
        {
            simplified: "她",
            radical: "女",
            level: ["HSK1"],
            frequency: 4,
            pos: ["pronoun"],
            forms: [
                {
                    traditional: "她",
                    transcriptions: {
                        pinyin: "tā",
                        bopomofo: "ㄊㄚ",
                    },
                    meanings: ["she", "her"],
                    classifiers: []
                }
            ]
        },
        {
            simplified: "我们",
            radical: "亻",
            level: ["HSK1"],
            frequency: 6,
            pos: ["pronoun"],
            forms: [
                {
                    traditional: "我們",
                    transcriptions: {
                        pinyin: "wǒmen",
                        bopomofo: "ㄨㄛˇ ㄇㄣ˙",
                    },
                    meanings: ["we", "us"],
                    classifiers: []
                }
            ]
        },
        {
            simplified: "他们",
            radical: "亻",
            level: ["HSK1"],
            frequency: 7,
            pos: ["pronoun"],
            forms: [
                {
                    traditional: "他們",
                    transcriptions: {
                        pinyin: "tāmen",
                        bopomofo: "ㄊㄚ ㄇㄣ˙",
                    },
                    meanings: ["they", "them (male or mixed)"],
                    classifiers: []
                }
            ]
        },
        {
            simplified: "她们",
            radical: "女",
            level: ["HSK1"],
            frequency: 8,
            pos: ["pronoun"],
            forms: [
                {
                    traditional: "她們",
                    transcriptions: {
                        pinyin: "tāmen",
                        bopomofo: "ㄊㄚ ㄇㄣ˙",
                    },
                    meanings: ["they", "them (female)"],
                    classifiers: []
                }
            ]
        }
    ],
    grammar: [  // TODO: Deduplicate entries by referencing ID
        {
            id: "grammar-1",
            title: "Using 是 to identify",
            description: "The verb '是' (shì) is used to link a subject and a noun or identity.",
            examples: ["我是学生。", "他是老师。"],
            practice: ["我是___。", "你是___吗？"]
        }
    ],
    dialogue: [  // TODO: Deduplicate entries by referencing ID
        {
            turn: 1,
            speaker: "Other Person",
            mandarin: "你好！",
            pinyin: "Nǐ hǎo!",
            english: "Hello!",
            userPrompt: "Say hello back.",
            targetSentence: "Hello!",
            hint: "Keep it simple with '你好'."
        },
        {
            turn: 2,
            speaker: "Other Person",
            mandarin: "我是小王。你叫什麼名字？",
            pinyin: "Wǒ shì Xiǎo Wáng. Nǐ jiào shénme míngzì?",
            english: "I am Xiao Wang. What is your name?",
            userPrompt: "Introduce yourself by saying 'I am ___'.",
            targetSentence: "I am ___.",
            hint: "Use '我是' to say 'I am'."
        }
    ],
    scenarioId: "introducing-yourself"
}