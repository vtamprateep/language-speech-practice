'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { Vocabulary, getVocabularyTopNFrequency } from '@/lib/backend';
import { VocabularyFlashcardMasteryContainer } from '@/components/features/flashcard/flashcard';


function HomeButton() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center p-10 gap-6">
            <h2 className="text-2xl font-semibold">
                🎉 You have mastered all vocabulary in this set!
            </h2>

            <Button 
                onClick={() => router.push("/")}
                className="text-lg px-6 py-3"
            >
                Return to Home
            </Button>
        </div>
    )
}


export default function FlashcardsLearnPage({ params }: { params: Promise<{ level: string }>}) {
    const { level } = React.use(params);
    const [readyToRender, setReadyToRender] = useState<boolean>(false);
    const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
    const [renderHome, setRenderHome] = useState<boolean>(false);

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
        getVocabularyTopNFrequency(2)
            .then((data) => {
                loadAndShuffle(data);
                setVocabulary(data);
            })
            .finally(() => setReadyToRender(true));
    }, [])

    if (!readyToRender) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">Loading flashcards...</p>
            </div>
        );
    }

    return (     
        renderHome ? (
            <HomeButton />
        ) : (
            <div className="flex flex-col items-center p-6 gap-6">
                <h1 className="text-2xl font-bold">Level {level} Flashcards</h1>
                <div>
                    <VocabularyFlashcardMasteryContainer 
                        vocabulary={vocabulary}
                        callbackOnComplete={() => setRenderHome(true)}
                    />
                </div>
            </div>
        )
    );
}