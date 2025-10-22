import { useEffect, useState } from "react";
import { Vocabulary } from "@/data/vocabulary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";


type Mode = "typing" | "multiple-choice";

export function VocabularyFlashcard({ vocabulary }: { vocabulary: Vocabulary[] }) {
    const [index, setIndex] = useState<number>(0);
    const [mode, setMode] = useState<Mode>("multiple-choice");
    const [currentItem, setCurrentItem] = useState<Vocabulary>(vocabulary[index]);
    const [userInput, setUserInput] = useState<string>("");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [choices, setChoices] = useState<string[]>([]);

    function nextCard() {
        const nextIndex = (index + 1) % vocabulary.length;
        setIndex(nextIndex);
        setCurrentItem(vocabulary[nextIndex]);
    }

    function prevCard() {
        const nextIndex = (index - 1) % vocabulary.length;
        setIndex(nextIndex);
        setCurrentItem(vocabulary[nextIndex]);
    }

    function checkAnswer(userInput: string) {
        const expectedAnswer = 
            mode === "typing" ? currentItem.vocabulary : currentItem.vocabularyEnglish;

        if (userInput.trim() === expectedAnswer) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    }

    useEffect(() => {
        // Reset input and feedback on card change
        setUserInput("");
        setIsCorrect(null);

        // Randomly pick mode to keep things interesting
        const randomMode: Mode = Math.random() < 0.5 ? "typing" : "multiple-choice";
        setMode(randomMode);

        if (randomMode === "multiple-choice") {
            const wrongAnswers = vocabulary
                .filter((v) => v.id !== currentItem.id)
                .sort(() => 0.5 - Math.random()) // shuffle
                .slice(0, 3)
                .map((v) => v.vocabularyEnglish);

            const allOptions = [...wrongAnswers, currentItem.vocabularyEnglish]
                .sort(() => 0.5 - Math.random()); // shuffle again

            setChoices(allOptions);
        }
    }, [index]);

    return (
        <div className="flex flex-col items-center p-6 gap-6">
            <div>
                <Flashcard item={vocabulary[index]} />
            </div>

            {/* User Interaction */}
            {mode === "typing" ? (
                <div className="flex flex-col items-center gap-2">
                    <Input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && checkAnswer(userInput)}
                        placeholder="Type the character here"
                    />
                    <Button onClick={() => checkAnswer(userInput)}>Check Answer</Button>

                    {/* Feedback */}
                    {isCorrect !== null && (
                        <p className={`mt-2 font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                            {isCorrect ? "Correct!" : `Incorrect. Here's the pinyin: ${currentItem.pinyin}`}
                        </p>
                    )}
                </div>
            ) : (
                // --- Multiple Choice Mode ---
                <div className="flex flex-col gap-2 w-72">
                    {choices.map((choice) => (
                        <Button
                            key={choice}
                            variant={
                                isCorrect === null
                                    ? "outline"
                                    : choice === currentItem.vocabularyEnglish
                                    ? "default"
                                    : "outline"
                            }
                            onClick={() => checkAnswer(choice)}
                            disabled={isCorrect !== null}
                            className={`text-left ${
                                isCorrect !== null && choice === currentItem.vocabularyEnglish
                                    ? "border-green-500 text-green-700"
                                    : ""
                            }`}
                        >
                            {choice}
                        </Button>
                    ))}

                    {isCorrect !== null && (
                        <p
                            className={`mt-2 text-center font-medium ${
                                isCorrect ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {isCorrect ? "Correct!" : "Incorrect"}
                        </p>
                    )}
                </div>
            )}
            

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

function MultipleChoice({choices} : { choices: string[]}) {
    
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
