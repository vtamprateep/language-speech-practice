import lessonData from './lesson_raw/lesson_data.json' assert {type:'json'};


export interface LessonModule {
    id: string;
    title: string;
    description: string;
    vocabularyId: number[]; // Hydrated with Vocabulary
    grammarId: number[] | null; // Hydrated with GrammarRule
    dialogueId: string | null;
    scenarioId?: string | null;
}

export const allLessons: LessonModule[] = lessonData;

export const lessonKeys = allLessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description
}));
