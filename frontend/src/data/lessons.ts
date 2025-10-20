import { Vocabulary } from "./vocabulary";
import { GrammarRule } from "./grammar";
import { DialogueTurn } from "./scenarios";


export interface LessonModule {
    id: string;
    title: string;
    description: string;
    vocabularyId: number[]; // Hydrated with Vocabulary
    grammarId: number[]; // Hydrated with GrammarRule
    dialogueId: string;
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
    grammarId: [1, 2],
    dialogueId: "introducing-yourself",
}
