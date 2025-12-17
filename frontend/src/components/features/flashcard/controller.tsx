import { Vocabulary } from "@/lib/backend/types";
import { useState, useEffect } from "react";
import { Mode } from "./types";
import { VocabularyProgressRecord } from "@/lib/backend/types";
import { chooseRandom, shuffle } from "@/lib/utils";


function generateChoices(vocabularyArr: Vocabulary[], skipId: number): Vocabulary[] {
    return vocabularyArr
        .filter((v) => v.id !== skipId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
}


export function useFlashcardController(vocabularyArr: Vocabulary[]) {
    const [index, setIndex] = useState(0);
    const [mode, setMode] = useState<Mode>("typing");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [choices, setChoices] = useState<string[]>([]);
    const currentVocabulary = vocabularyArr[index];

    const next = () =>
        setIndex((prev) => Math.min(prev + 1, vocabularyArr.length - 1));

    const prev = () =>
        setIndex((prev) => Math.max(prev - 1, 0));

    const checkResponse = (answer: string) => {
        const expected =
            mode === "typing" ? currentVocabulary.traditional : currentVocabulary.english;

        const correct = answer.trim() === expected;
        setIsCorrect(correct);
        return correct;
    }

    useEffect(() => {
        const mode = chooseRandom(["typing", "multiple-choice"]) as Mode;
        setIsCorrect(null);
        setMode(mode);

        if (mode === "typing") return;

        // Logic to select other choices for "multiple-choice"
        const wrongAnswers = generateChoices(
            vocabularyArr, currentVocabulary.id
        ).map((v) => v.english);

        const opts = [...wrongAnswers, currentVocabulary.english].sort(
            () => 0.5 - Math.random()
        );

        setChoices(opts);
    }, [index]);

    return {
        currentVocabulary,
        mode,
        isCorrect,
        choices,
        next,
        prev,
        checkResponse,
    };
}

export function useFlashcardMasteryController(
    vocabularyArr: Vocabulary[],
    vocabularyProgress: VocabularyProgressRecord[]
) {
    const [index, setIndex] = useState<number>(0);
    const [mode, setMode] = useState<Mode>("typing");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [choices, setChoices] = useState<string[]>([]);
    const [endSession, setEndSession] = useState<boolean>(false);
    const [iterationCount, setIterationCount] = useState<number>(1);

    const maxIteration = 10;
    const currentVocabulary = vocabularyArr[index];
    const progress = vocabularyProgress;

    const next = () => {
        // Block going to next vocab until user has answered
        if (isCorrect == undefined) return;

        // Update progress
        updateProgress(progress!, currentVocabulary, isCorrect);

        // Increment number of flashcards seen or terminate session
        if (iterationCount == maxIteration) {
            setEndSession(true);
            return;
        }
        setIterationCount(prev => prev + 1);

        // Update states for next flashcard
        setIsCorrect(null);
        const randomVocab = chooseRandom(vocabularyArr);
        const randomIndex = vocabularyArr.findIndex((v) => v.id == randomVocab.id);
        setIndex(randomIndex);

        const mode = chooseRandom(["typing", "multiple-choice"]) as Mode;
        setMode(mode);
        if (mode === "multiple-choice") {
            const wrongAnswers = generateChoices(
                vocabularyArr, randomVocab.id
            ).map((v) => v.english);
            setChoices(shuffle([...wrongAnswers, randomVocab.english]));
        };
    }

    const checkResponse = (answer: string) => {
        const expected =
            mode === "typing" ? currentVocabulary.traditional : currentVocabulary.english;

        const correct = answer.trim() === expected;
        setIsCorrect(correct);
        
        return correct;
    }

    const updateProgress = (
        progress: VocabularyProgressRecord[],
        vocabulary: Vocabulary,
        answerdCorrectly: boolean
    ) => {
        const vocabProgress = progress.find((v) => v.vocabularyId == vocabulary.id);
        if (!vocabProgress) {
            return;
        } else if (answerdCorrectly) {
            vocabProgress.countCorrect ++
        } else {
            vocabProgress.countWrong ++
        }
    }

    return {
        currentVocabulary,
        mode,
        isCorrect,
        choices,
        endSession,
        next,
        checkResponse
    };
}