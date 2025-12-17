import { useEffect } from "react";
import { Vocabulary, VocabularyProgressRecord } from "@/lib/backend/types";
import { Button } from "@/components/ui/button";
import { TypedResponse, MultipleChoiceResponse } from "./response";
import { useFlashcardController, useFlashcardMasteryController } from "./controller";
import { Flashcard } from "./flashcard";


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


export function VocabularyFlashcardMasteryContainer({ 
    vocabulary,
    vocabularyProgress,
    callbackOnComplete
}: {
    vocabulary: Vocabulary[],
    vocabularyProgress: VocabularyProgressRecord[],
    callbackOnComplete?: () => void,
}) {
    const {
        currentVocabulary,
        mode,
        choices,
        isCorrect,
        endSession,
        next,
        checkResponse,
    } = useFlashcardMasteryController(vocabulary, vocabularyProgress);

    // Use effect to trigger callback when session ends
    useEffect(() => {
        if (endSession) {
            callbackOnComplete?.();
        }
    }, [endSession, callbackOnComplete]);

    return (
        <div className="flex flex-col items-center p-6 gap-6">
            <Flashcard
                item={currentVocabulary} 
            />

            {mode === "typing" ? (
                <TypedResponse
                    disabled={isCorrect != undefined}
                    callback={checkResponse}
                />
            ) : (
                <MultipleChoiceResponse
                    choices={choices}
                    disabled={isCorrect != undefined}
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
