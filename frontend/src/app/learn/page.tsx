'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { Vocabulary } from '@/lib/backend/types';
import { getVocabularyById, getVocabularyIdByPolicy, getVocabularyTopNFrequency } from '@/lib/backend/backend';
import { VocabularyFlashcardMasteryContainer } from '@/components/features/flashcard/container';
import { useUserContext } from '@/context/user';
import { shuffle } from '@/lib/utils';


function HomeButton() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center p-10 gap-6">
            <h2 className="text-2xl font-semibold">
                🎉 You have completed this vocabulary set!
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

    const { user } = useUserContext();

    async function loadVocabulary(userId?: string): Promise<Vocabulary[]> {
        if (userId) {
            const vocabIdArr = await getVocabularyIdByPolicy(userId)
            const vocabArr = await getVocabularyById(vocabIdArr);
            return vocabArr;                
        } else {
            const vocabArr = await getVocabularyTopNFrequency(8);
            return shuffle(vocabArr);
        }
    } 

    useEffect(() => {
        loadVocabulary(user?.id)
            .then((data) => {
                setVocabulary(data);
                setReadyToRender(true);
            });
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