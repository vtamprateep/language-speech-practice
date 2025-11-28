export type Language = string; // adjust if you have enums on frontend

export interface TextTranslate {
  text: string;
  sourceLang: Language;
  targetLang: Language;
}

export interface TextComparison {
  text_1: string;
  text_2: string;
}

export interface TTSRequest {
  text: string;
  language: string;
}

export interface Vocabulary {
  topic: string | null;
  traditional: string;
  simplified: string;
  pinyin: string;
  partOfSpeech: string | null;
  level: number;
  topicEnglish: string | null;
  english: string;
  id: number;
  relativeFreqPct: number;
}

export interface VocabularyProgress {
  id: number;
  vocabularyId: number;
  countWrong: number;
  countCorrect: number;
}