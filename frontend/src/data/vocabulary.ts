import vocabularyData from './vocabulary_raw/vocabulary_data.json' assert { type:'json'};


// For https://www.roc-taiwan.org/at_de/post/634.html
export interface Vocabulary {
    topic: string | null;
    vocabulary: string;
    pinyin: string;
    partOfSpeech: string | null;
    level: number;
    topicEnglish: string | null;
    vocabularyEnglish: string;
    id: number;
}

export const allVocabulary: Vocabulary[] = vocabularyData as Vocabulary[];
