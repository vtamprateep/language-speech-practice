import { useEffect, useState } from "react";
import { Vocabulary } from "@/lib/backend";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypedResponse, MultipleChoiceResponse } from "./response";
import { useFlashcardController, useFlashcardMasteryController } from "./controller";


export function VocabularyFlashcardContainer({ vocabulary }: { vocabulary: Vocabulary[] }) {
    const {
        currentVocabulary,
        mode,
        choices,
        isCorrect,
        next,
        prev,
        checkResponse,
    } = useFlashcardController(vocabulary);

    return (
        <div className="flex flex-col items-center p-6 gap-6">
            <Flashcard item={currentVocabulary} />

            {mode === "typing" ? (
                <TypedResponse 
                    key={currentVocabulary.id}
                    callback={checkResponse}
                />
            ) : (
                <MultipleChoiceResponse
                    choices={choices}
                    callback={checkResponse}
                />
            )}

            {isCorrect !== null && (
                <p
                    className={`mt-2 font-medium ${
                        isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {isCorrect ? "Correct!" : "Incorrect"}
                </p>
            )}

            {/* Navigation */}
            <div className="flex gap-4">
                <Button onClick={prev}>
                    Back
                </Button>
                <Button onClick={next}>
                    Next
                </Button>
            </div>
        </div>
    );
}


export function VocabularyFlashcardMasteryContainer({ vocabulary }: { vocabulary: Vocabulary[] }) {
    const {
        currentVocabulary,
        mode,
        choices,
        isCorrect,
        endSession,
        renderTick,
        next,
        checkResponse,
    } = useFlashcardMasteryController(vocabulary);

    return (
        <div className="flex flex-col items-center p-6 gap-6">
            <Flashcard 
                key={renderTick}
                item={currentVocabulary} 
            />

            {mode === "typing" ? (
                <TypedResponse 
                    resetSignal={renderTick}
                    callback={checkResponse}
                />
            ) : (
                <MultipleChoiceResponse
                    choices={choices}
                    callback={checkResponse}
                />
            )}

            {isCorrect !== null && (
                <p
                    className={`mt-2 font-medium ${
                        isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {isCorrect ? "Correct!" : "Incorrect"}
                </p>
            )}

            {/* Navigation */}
            <div className="flex gap-4">
                <Button onClick={next}>
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
                        {item.english}
                    </p>
                </CardContent>
            ) : (
                <CardContent className="absolute w-full h-full flex items-center justify-center backface-hidden">
                    <span className="text-4xl font-bold text-black">{item.traditional}</span>
                </CardContent>
            )}
        </Card>
    );
}
