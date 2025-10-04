'use client';

import React, { useState, useRef, useEffect } from 'react';
import { guidedScenariosDialogue, DialogueTurn } from '@/data/scenarios';
import { WaveformAudioPlayer, AudioRecorder } from '@/lib/components/ui/audio';
import GuidedDialogueAudio from '@/components/features/dialogue';

import { translateText, transcribeAudio, calculateSimilarity, generateAudio } from '@/lib/backend';


interface VoiceMessage {
    sender: 'user' | 'bot';
    audioUrl: string;
}


export default function PracticeDialoguePage({ params }: { params: Promise<{ id: string }>}) {
    const { id } = React.use(params);
    const [dialogue, setDialogue] = useState<DialogueTurn[]>([]);

    useEffect(() => {  // On mount, grab appropriate dialogue
        const loadedDialogue = guidedScenariosDialogue[id];
        setDialogue(loadedDialogue);
    }, [])

    return (
        <div className="flex flex-col h-screen p-4">
            {dialogue.length && (
                <GuidedDialogueAudio dialogueSet={dialogue} />
            )}
        </div>
    );
}
