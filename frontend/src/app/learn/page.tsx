'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { Vocabulary } from '@/lib/backend/types';
import { 
    getVocabularyById,
    getVocabularyIdByPolicy,
    getVocabularyTopNFrequency,
    getVocabularyProgress,
    putVocabularyProgressNewRecords,
    putVocabularyProgressUpdateRecords
} from '@/lib/backend/backend';
import { VocabularyFlashcardMasteryContainer } from '@/components/features/flashcard/container';
import { useUserContext } from '@/context/user';
import { shuffle } from '@/lib/utils';
import { VocabularyProgressRecord } from '@/lib/backend/types';


async function loadVocabularyProgress(
    vocabularyIdArr: number[],
    userId?: string
): Promise<VocabularyProgressRecord[]> {
    // If userId is not provided, give blank progress for all vocabulary
    if (!userId) {
        const vocabProgress = vocabularyIdArr.map((id) => {
            return {
                vocabularyId: id,
                countCorrect: 0,
                countWrong: 0
            }
        });
        return vocabProgress;
    }

    // Otherwise, get vocabulary progress records from database
    const vocabularyProgressRecord = await getVocabularyProgress(
        userId,
        vocabularyIdArr
    )
    const foundVocabId = vocabularyProgressRecord.map((v) => v.vocabularyId);

    // For new vocab, existing record may not exists. Create those records.
    const missingVocabIds = vocabularyIdArr.filter((v) => !foundVocabId.includes(v));

    // If none were missing, return. Otherwise, create those records
    if (missingVocabIds.length == 0) return vocabularyProgressRecord;
    const newRecords = await putVocabularyProgressNewRecords(userId, missingVocabIds);
    return [...vocabularyProgressRecord, ...newRecords];
}


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
    const [vocabularyProgress, setVocabularyProgress] = useState<VocabularyProgressRecord[]>([]);
    const [renderHome, setRenderHome] = useState<boolean>(false);

    const { user } = useUserContext();

    const setup = async () => {
        // Load vocabulary
        const vocabArr = await loadVocabulary(user?.id);
        setVocabulary(vocabArr);

        // Load vocabulary progress
        const vocabIdArr = vocabArr.map((entry) => entry.id);
        const vocabProgressArr = await loadVocabularyProgress(vocabIdArr, user?.id);
        setVocabularyProgress(vocabProgressArr);

        setReadyToRender(true);
    }

    const cleanup = () => {
        putVocabularyProgressUpdateRecords(vocabularyProgress);
        setRenderHome(true);
    }

    useEffect(() => {
        setup();
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
                        vocabularyProgress={vocabularyProgress}
                        callbackOnComplete={() => cleanup()}
                    />
                </div>
            </div>
        )
    );
}