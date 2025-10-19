import { Vocabulary } from "./vocabulary";
import { GrammarRule } from "./grammar";
import { DialogueTurn } from "./scenarios";


export interface LessonModule {
    id: string;
    title: string;
    description: string;
    vocabularyId: number[]; // Hydrated with Vocabulary
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
    vocabularyId: [
        7787, // 你好
        114, // 我
        7788, // 你
        7789, // 他
        7790, // 她
        124, // 是
        490, // 不
        125, // 的
        126, // 誰
        7791 // 名字
    ],
    grammar: [
        {
            id: "grammar-1",
            title: "Using 是 to identify",
            description: "The verb '是' (shì) is used to link a subject and a noun or identity.",
            examples: ["我是学生。", "他是老师。"],
            practice: ["我是___。", "你是___吗？"]
        }
    ],
    dialogue: [
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
