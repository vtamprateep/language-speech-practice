'use client';

import React, { useState, useEffect } from 'react';
import { allDialogue, DialogueTurn } from '@/data/dialogue';
import { GuidedDialogueText } from '@/components/features/dialogue';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}


export default function PracticalDialoguePage({ params }: { params: Promise<{ id: string }>}) {
    const { id } = React.use(params);
    const [dialogue, setDialogue] = useState<DialogueTurn[]>([]);

    useEffect(() => {  // On mount, grab appropriate dialogue
        const loadedDialogue = allDialogue.find((obj) => obj.id == id);
        setDialogue(loadedDialogue!.dialogue);
    }, [])

    return (
        <div className="flex flex-col h-screen p-4">
            {dialogue.length && (
                <GuidedDialogueText dialogueSet={dialogue} />
            )}
        </div>
    );
}
