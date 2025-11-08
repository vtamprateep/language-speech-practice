import dialogueData from './dialogue_raw/dialogue_data.json' assert {type: 'json'};


export interface Dialogue {
    id: string,
    path: string,
    title: string,
    description: string,
    dialogue: DialogueTurn[]
}

export interface DialogueTurn {
    turn: number;
    speaker: string;
    mandarin: string;
    pinyin: string;
    english: string;
    userPrompt: string;
    targetSentence: string;
    hint: string;
}


export const allDialogue: Dialogue[] = dialogueData;
