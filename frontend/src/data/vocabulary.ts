import rawData1 from './vocabulary_raw/hsk_n1.json' assert { type:"json" };
import rawData2 from './vocabulary_raw/hsk_n2.json' assert { type:"json" };
import rawData3 from './vocabulary_raw/hsk_n3.json' assert { type:"json" };
import rawData4 from './vocabulary_raw/hsk_n4.json' assert { type:"json" };
import rawData5 from './vocabulary_raw/hsk_n5.json' assert { type:"json" };
import rawData6 from './vocabulary_raw/hsk_n6.json' assert { type:"json" };
import rawData7 from './vocabulary_raw/hsk_n7+.json' assert { type:"json" };


export interface VocabularyForm { 
    t: string; // traditional 
    i: { // transcriptions 
        y: string; // pinyin
        b: string; // bopomofo
    }; 
    m: string[]; // meanings 
    c: string[]; // classifiers 
} 

export interface VocabularyItem { 
    s: string; // simplified 
    r: string; // radical 
    l: string[]; // level 
    q: number; // frequency 
    p: string[]; // parts of speech 
    f: VocabularyForm[]; // forms 
}

export const vocabulary_1: VocabularyItem[] = rawData1 as VocabularyItem[];
export const vocabulary_2: VocabularyItem[] = rawData2 as VocabularyItem[];
export const vocabulary_3: VocabularyItem[] = rawData3 as VocabularyItem[];
export const vocabulary_4: VocabularyItem[] = rawData4 as VocabularyItem[];
export const vocabulary_5: VocabularyItem[] = rawData5 as VocabularyItem[];
export const vocabulary_6: VocabularyItem[] = rawData6 as VocabularyItem[];
export const vocabulary_7: VocabularyItem[] = rawData7 as VocabularyItem[];
