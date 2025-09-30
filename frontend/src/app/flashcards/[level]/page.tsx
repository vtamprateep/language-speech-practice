'use client';

import { notFound } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { VocabularyFlashcard } from '@/components/features/flashcard';
import { 
    vocabulary_1,
    vocabulary_2,
    vocabulary_3,
    vocabulary_4,
    vocabulary_5,
    vocabulary_6,
    vocabulary_7,
    type VocabularyItem,
} from '@/data/vocabulary';


const vocabularyByLevel: Record<string, VocabularyItem[]> = {
    "1": vocabulary_1,
    "2": vocabulary_2,
    "3": vocabulary_3,
    "4": vocabulary_4,
    "5": vocabulary_5,
    "6": vocabulary_6,
    "7": vocabulary_7,
}


export default function FlashcardsPage({ params }: { params: Promise<{ level: string }>}) {
    const { level } = React.use(params);
    const vocabulary = vocabularyByLevel[level];
    if (!vocabulary) return notFound()

    const [index, setIndex] = useState<number>(0);

    function shuffle<T>(arr: T[]) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }

        return arr
    }

    function nextCard() {
        setIndex((i) => (i + 1) % vocabulary.length);
    }

    function prevCard() {
        setIndex((i) => (i - 1 + vocabulary.length) % vocabulary.length);
    }

    useEffect(() => {
        shuffle(vocabulary);
    }, [])

    return (
        <div className="flex flex-col items-center p-6 gap-6">
            <h1 className="text-2xl font-bold">HSK Level {level} Flashcards</h1>

            <div
                className="
                    relative 
                    w-64 
                    h-40 
                    cursor-pointer 
                    perspective
                "
            >
                <VocabularyFlashcard key={index} item={vocabulary[index]} />
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button
                    onClick={prevCard}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                    Previous
                </button>
                <button
                    onClick={nextCard}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                    Next
                </button>
            </div>

            <p className="text-sm text-gray-500">
                {index + 1} / {vocabulary.length}
            </p>
        </div>
    );
}