'use client';

import React, { useState, useEffect } from 'react';
import { VocabularyFlashcard } from '@/components/features/flashcard';
import { 
    allVocabulary,
    type Vocabulary
} from '@/data/vocabulary';


export default function FlashcardsPage({ params }: { params: Promise<{ level: string }>}) {
    const { level } = React.use(params);
    const [readyToRender, setReadyToRender] = useState<boolean>(false);
    const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);

    function loadAndShuffle<T>(arr: T[]) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }

        return arr;        
    }

    useEffect(() => {

        setVocabulary(
            loadAndShuffle(allVocabulary.filter((vocab) => String(vocab.level) == level))
        );
        setReadyToRender(true);
    }, [])

    if (!readyToRender) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">Loading flashcards...</p>
            </div>
        );
    }

    return (        
        <div className="flex flex-col items-center p-6 gap-6">
            <h1 className="text-2xl font-bold">Level {level} Flashcards</h1>
            <div>
                <VocabularyFlashcard vocabulary={vocabulary} />
            </div>
        </div>
    );
}