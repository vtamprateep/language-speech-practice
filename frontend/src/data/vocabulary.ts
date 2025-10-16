import rawData1 from './vocabulary_raw/hsk_n1.json' assert { type:"json" };
import rawData2 from './vocabulary_raw/hsk_n2.json' assert { type:"json" };
import rawData3 from './vocabulary_raw/hsk_n3.json' assert { type:"json" };
import rawData4 from './vocabulary_raw/hsk_n4.json' assert { type:"json" };
import rawData5 from './vocabulary_raw/hsk_n5.json' assert { type:"json" };
import rawData6 from './vocabulary_raw/hsk_n6.json' assert { type:"json" };
import rawData7 from './vocabulary_raw/hsk_n7+.json' assert { type:"json" };

import mandarinVocab1 from './vocabulary_raw/mandarin_vocabulary_level_1.json' assert { type:'json'};
import mandarinVocab2 from './vocabulary_raw/mandarin_vocabulary_level_2.json' assert { type:'json'};
import mandarinVocab3 from './vocabulary_raw/mandarin_vocabulary_level_3.json' assert { type:'json'};
import mandarinVocab4 from './vocabulary_raw/mandarin_vocabulary_level_4.json' assert { type:'json'};
import mandarinVocab5 from './vocabulary_raw/mandarin_vocabulary_level_5.json' assert { type:'json'};


// For https://github.com/drkameleon/complete-hsk-vocabulary
export interface VocabularyForm { 
    traditional: string;
    transcriptions: {
        pinyin: string;
        bopomofo: string;
    }; 
    meanings: string[];
    classifiers: string[];
} 

export interface VocabularyItem { 
    simplified: string;
    radical: string;
    level: string[];
    frequency: number;
    pos: string[];
    forms: VocabularyForm[];
}

export const vocabulary_1: VocabularyItem[] = rawData1 as VocabularyItem[];
export const vocabulary_2: VocabularyItem[] = rawData2 as VocabularyItem[];
export const vocabulary_3: VocabularyItem[] = rawData3 as VocabularyItem[];
export const vocabulary_4: VocabularyItem[] = rawData4 as VocabularyItem[];
export const vocabulary_5: VocabularyItem[] = rawData5 as VocabularyItem[];
export const vocabulary_6: VocabularyItem[] = rawData6 as VocabularyItem[];
export const vocabulary_7: VocabularyItem[] = rawData7 as VocabularyItem[];


// For https://www.roc-taiwan.org/at_de/post/634.html
export interface Vocabulary {
    topic: string | null;
    vocabulary: string;
    pinyin: string;
    partOfSpeech: string | null;
    level: number;
    topicEnglish: string | null;
    vocabularyEnglish: string;
}

export const tradVocabulary1: Vocabulary[] = mandarinVocab1 as Vocabulary[];
export const tradVocabulary2: Vocabulary[] = mandarinVocab2 as Vocabulary[];
export const tradVocabulary3: Vocabulary[] = mandarinVocab3 as Vocabulary[];
export const tradVocabulary4: Vocabulary[] = mandarinVocab4 as Vocabulary[];
export const tradVocabulary5: Vocabulary[] = mandarinVocab5 as Vocabulary[];