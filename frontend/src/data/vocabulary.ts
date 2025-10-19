import mandarinVocab1 from './vocabulary_raw/mandarin_vocabulary_level_1.json' assert { type:'json'};
import mandarinVocab2 from './vocabulary_raw/mandarin_vocabulary_level_2.json' assert { type:'json'};
import mandarinVocab3 from './vocabulary_raw/mandarin_vocabulary_level_3.json' assert { type:'json'};
import mandarinVocab4 from './vocabulary_raw/mandarin_vocabulary_level_4.json' assert { type:'json'};
import mandarinVocab5 from './vocabulary_raw/mandarin_vocabulary_level_5.json' assert { type:'json'};


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

export const tradVocabulary1: Vocabulary[] = mandarinVocab1 as Vocabulary[];
export const tradVocabulary2: Vocabulary[] = mandarinVocab2 as Vocabulary[];
export const tradVocabulary3: Vocabulary[] = mandarinVocab3 as Vocabulary[];
export const tradVocabulary4: Vocabulary[] = mandarinVocab4 as Vocabulary[];
export const tradVocabulary5: Vocabulary[] = mandarinVocab5 as Vocabulary[];