'use client';

import React, { useState, useRef, useEffect } from 'react';
import { guidedScenariosDialogue, DialogueTurn } from '@/data/scenarios';
import { translateText, calculateSimilarity } from '@/lib/backend';
import { GuidedDialogueText } from '@/components/features/dialogue';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}


export default function PracticalDialoguePage({ params }: { params: Promise<{ id: string }>}) {
    const { id } = React.use(params);
    const [dialogue, setDialogue] = useState<DialogueTurn[]>([]);

    useEffect(() => {  // On mount, grab appropriate dialogue
        const loadedDialogue = guidedScenariosDialogue[id];
        setDialogue(loadedDialogue);
    }, [])

    return (
        <div className="flex flex-col h-screen p-4">
            {dialogue.length && (
                <GuidedDialogueText dialogueSet={dialogue} />
            )}
        </div>
    );
}
