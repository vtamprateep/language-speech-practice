import { useEffect, useState } from "react";
import { Vocabulary } from "@/data/vocabulary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";


export function VocabularyFlashcard({ vocabulary }: { vocabulary: Vocabulary[] }) {
    const [index, setIndex] = useState<number>(0);
    const [currentItem, setCurrentItem] = useState<Vocabulary>(vocabulary[index]);
    const [userInput, setUserInput] = useState<string>("");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    function nextCard() {
        let nextIndex = (index + 1) % vocabulary.length;
        setIndex(nextIndex);
        setCurrentItem(vocabulary[nextIndex]);
    }

    function prevCard() {
        let nextIndex = (index + 1) % vocabulary.length;
        setIndex(nextIndex);
        setCurrentItem(vocabulary[nextIndex]);
    }

    function checkAnswer() {
        if (userInput.trim() === currentItem.vocabulary) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    }

    useEffect(() => {
        // Reset input and feedback on card change
        setUserInput("");
        setIsCorrect(null);
    }, [index]);

    return (
        <div className="flex flex-col items-center p-6 gap-6">
            <div>
                <Flashcard item={vocabulary[index]} />
            </div>

            {/* User Interaction */}

            <div className="flex flex-col items-center gap-2">
                <Input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                    placeholder="Type the character here"
                    // className="w-64 text-center border rounded px-2 py-1 text-xl"
                />
                <Button onClick={checkAnswer}>Check Answer</Button>

                {/* Feedback */}
                {isCorrect !== null && (
                    <p className={`mt-2 font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                        {isCorrect ? "Correct!" : `Incorrect. Here's the pinyin: ${currentItem.pinyin}`}
                    </p>
                )}
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

function Flashcard({ item }: { item: Vocabulary }) {
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
                        {item.pinyin}{" "}
                    </p>
                    <p className="mt-2 space-y-1 text-sm text-gray-700">
                        {item.vocabularyEnglish}
                    </p>
                </CardContent>
            ) : (
                <CardContent className="absolute w-full h-full flex items-center justify-center backface-hidden">
                    <span className="text-4xl font-bold text-black">{item.vocabulary}</span>
                </CardContent>
            )}
        </Card>
    );
}
