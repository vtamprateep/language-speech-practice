import grammarData from './grammar_raw/grammar_data.json' assert {type:'json'};

export interface GrammarPracticeItem {
    id: number;
    prompt: string;
    fragments: string[];
    answer: string;
}

export interface GrammarRule {
    id: number;
    title: string;
    description: string;
    examples: string[];
    practice: GrammarPracticeItem[];
}

export const grammarRules: GrammarRule[] = grammarData as GrammarRule[];