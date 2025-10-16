'use client';

import { notFound } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { VocabularyFlashcard } from '@/components/features/flashcard';
import { 
    tradVocabulary1,
    tradVocabulary2,
    tradVocabulary3,
    tradVocabulary4,
    tradVocabulary5,
    type Vocabulary,
} from '@/data/vocabulary';


const vocabularyByLevel: Record<string, Vocabulary[]> = {
    "1": tradVocabulary1,
    "2": tradVocabulary2,
    "3": tradVocabulary3,
    "4": tradVocabulary4,
    "5": tradVocabulary5,
}


export default function FlashcardsPage({ params }: { params: Promise<{ level: string }>}) {
    const { level } = React.use(params);
    const [readyToRender, setReadyToRender] = useState<boolean>(false);
    const vocabulary = vocabularyByLevel[level];

    async function loadAndShuffle<T>(arr: T[]) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }

        return arr
    }

    useEffect(() => {
        loadAndShuffle(vocabulary);
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