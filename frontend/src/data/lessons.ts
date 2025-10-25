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


export const gettingStartedLessons = [
    {
        id: "lesson-1",
        name: "Pronouns & People Words",
        objective: "Introduce basic personal pronouns and people-related vocabulary.",
        vocabulary: ["我", "你", "他", "她", "我們", "你們", "他們", "人", "朋友", "家人", "先生", "小姐"],
        grammarPoints: ["Using personal pronouns", "Plural form with 們"],
        speakingFocus: "Referring to oneself and others accurately.",
        outcome: "Learners can identify and use basic pronouns to refer to themselves and others."
    },
    {
        id: "lesson-2",
        name: "Essential Verbs: To Be & To Have",
        objective: "Teach foundational verbs 是 and 有, and how to use them in simple statements.",
        vocabulary: ["是", "有", "沒有", "在", "不", "名字", "什麼", "誰", "年", "生日"],
        grammarPoints: ["Using 是 for identification", "Negation with 不 or 沒有", "Possession with 有 and 沒有"],
        speakingFocus: "Making simple statements about identity or possession.",
        outcome: "Learners can construct sentences like 我是學生 or 我有一個朋友."
    },
    {
        id: "lesson-3",
        name: "Greetings & Polite Expressions",
        objective: "Teach basic greetings and polite phrases used in everyday interactions.",
        vocabulary: ["你好", "您好", "再見", "謝謝", "請", "對不起", "不客氣", "早上", "下午", "晚上"],
        grammarPoints: ["Politeness particles", "Using 請 for polite requests"],
        speakingFocus: "Greeting others naturally and politely.",
        outcome: "Learners can greet others appropriately and respond politely in different social settings."
    },
    {
        id: "lesson-4",
        name: "Names & Introductions",
        objective: "Teach how to ask and state names, and introduce oneself and others.",
        vocabulary: ["叫", "名字", "認識", "高興", "也"],
        grammarPoints: ["Question structure: 你叫什麼名字？", "Using 也 and 很 for simple sentence linking"],
        speakingFocus: "Exchanging names and making introductions.",
        outcome: "Learners can introduce themselves and ask for someone’s name naturally."
    },
    {
        id: "lesson-5",
        name: "Simple Questions with 吗 and 呢",
        objective: "Introduce basic yes/no and follow-up question structures used in introductions.",
        vocabulary: ["嗎", "呢", "是嗎", "學生", "老師", "中國人", "美國人", "同學"],
        grammarPoints: ["Yes/No questions with 吗", "Follow-up questions with 呢"],
        speakingFocus: "Asking and responding to simple yes/no questions.",
        outcome: "Learners can use 吗 and 呢 to form and answer basic questions naturally."
    },
    {
        id: "lesson-6",
        name: "Countries & Nationalities",
        objective: "Teach country names and how to say where someone is from.",
        vocabulary: ["中國", "台灣", "美國", "日本", "國家", "哪裡", "從", "在", "去"],
        grammarPoints: ["Asking about origin with 哪裡 and 哪國", "Prepositions: 從, 在, 去"],
        speakingFocus: "Talking about where someone is from.",
        outcome: "Learners can ask and answer questions like 你是哪里人？ and 你從哪裡來？"
    },
    {
        id: "lesson-7",
        name: "Professions & Roles",
        objective: "Introduce common jobs and titles to describe people’s roles and occupations.",
        vocabulary: ["老師", "醫生", "護士", "司機", "老闆", "工作", "公司", "同事", "做"],
        grammarPoints: ["Using 是 for professions", "Question word 谁/誰"],
        speakingFocus: "Describing and asking about what people do.",
        outcome: "Learners can describe occupations using basic sentence structures like 他是醫生."
    },
    {
        id: "lesson-8",
        name: "Putting It All Together: Self-Introductions",
        objective: "Integrate pronouns, verbs, greetings, and vocabulary into a complete self-introduction.",
        vocabulary: ["喜歡", "學習", "中文"],
        grammarPoints: ["Combining learned structures", "Sentence connectors with 和 and 也"],
        speakingFocus: "Delivering a short self-introduction naturally and confidently.",
        outcome: "Learners can introduce themselves including name, nationality, occupation, and interests."
    }
];
