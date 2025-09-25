'use client';

import { notFound } from 'next/navigation';
import React, { useState, useEffect } from 'react';
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


function Flashcard({ item }: { item: VocabularyItem }) {
    const [flipped, setFlipped] = useState(false);
  
    return (
        <div
            className="
                relative 
                w-64 
                h-40 
                cursor-pointer 
                perspective
            "
            onClick={() => setFlipped(!flipped)}
        >
            <div
                className={`
                    absolute 
                    w-full 
                    h-full 
                    rounded-xl 
                    shadow-lg 
                    transition-transform 
                    duration-500 
                `}
            >
                {flipped ? (
                    <div className="absolute w-full h-full flex flex-col items-center justify-center bg-white rounded-xl backface-hidden p-4">
                        <p className="text-lg font-medium text-black">
                            {item.f[0]?.i.y} ({item.f[0]?.i.b})
                        </p>
                        <ul className="mt-2 text-sm text-gray-700">
                            {item.f[0]?.m.map((m, i) => (
                                <li key={i}>{m}</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="absolute w-full h-full flex items-center justify-center bg-white rounded-xl backface-hidden">
                        <span className="text-4xl font-bold text-black">{item.s}</span>
                    </div>
                    
                )}
            </div>
        </div>
    );
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

            <Flashcard key={index} item={vocabulary[index]} />

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