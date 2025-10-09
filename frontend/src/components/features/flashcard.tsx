import { useEffect, useState } from "react";
import { VocabularyItem } from "@/data/vocabulary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";


export function VocabularyFlashcard({ vocabulary }: { vocabulary: VocabularyItem[] }) {
    const [index, setIndex] = useState<number>(0);

    function nextCard() {
        setIndex((i) => (i + 1) % vocabulary.length);
    }

    function prevCard() {
        setIndex((i) => (i - 1 + vocabulary.length) % vocabulary.length);
    }

    return (
        <div className="flex flex-col items-center p-6 gap-6">
            <div>
                <Flashcard item={vocabulary[index]} />
            </div>
            

            {/* Controls */}
            <div className="flex gap-4">
                <Button
                    onClick={prevCard}
                >
                    Back
                </Button>
                <Button
                    onClick={nextCard}
                >
                    Next
                </Button>
            </div>
        </div>
        
    );
}

function Flashcard({ item }: { item: VocabularyItem }) {
    const [flipped, setFlipped] = useState(false);
    
    useEffect(() => {
        setFlipped(false);
    }, [item])

    return (
        <Card
            className="relative w-64 h-40 cursor-pointer transition-transform duration-500"
            onClick={() => setFlipped(!flipped)}
        >
            {flipped ? (
                <CardContent className="absolute w-full h-full flex flex-col items-center justify-center backface-hidden p-4">
                    <p className="text-lg font-medium text-black">
                        {item.forms[0]?.transcriptions.pinyin}{" "}
                        <span className="text-gray-500">
                            ({item.forms[0]?.transcriptions.bopomofo})
                        </span>
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                        {item.forms[0]?.meanings.map((meaning, idx) => (
                            <li key={idx}>• {meaning}</li>
                        ))}
                    </ul>
                </CardContent>
            ) : (
                <CardContent className="absolute w-full h-full flex items-center justify-center backface-hidden">
                    <span className="text-4xl font-bold text-black">{item.simplified}</span>
                </CardContent>
            )}
        </Card>
    );
}
