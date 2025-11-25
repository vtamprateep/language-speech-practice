import { Vocabulary } from "@/lib/backend";
import { useState, useEffect } from "react";


type Mode = "typing" | "multiple-choice";

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
        setIsCorrect(null);

        const random: Mode = Math.random() < 0.5 ? "typing" : "multiple-choice";
        setMode(random);

        if (random === "multiple-choice") {
            const wrongAnswers = vocabularyArr
                .filter((v) => v.id !== currentVocabulary.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map((v) => v.english);

            const opts = [...wrongAnswers, currentVocabulary.english].sort(
                () => 0.5 - Math.random()
            );

            setChoices(opts);
        }
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


type VocabularyPerformance  = {
    correct: number;
    wrong: number;
    mastered: boolean;
}

export function useFlashcardMasteryController(vocabularyArr: Vocabulary[]) {
    const [index, setIndex] = useState<number>(0);
    const [mode, setMode] = useState<Mode>("typing");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [choices, setChoices] = useState<string[]>([]);
    const [trackRecord, setTrackRecord] = useState<Record<number, VocabularyPerformance>>();
    const [endSession, setEndSession] = useState<boolean>(false);

    const [renderTick, setRenderTick] = useState<number>(0);

    const currentVocabulary = vocabularyArr[index];

    const next = () => {
        if (!trackRecord) return;

        // Collect ID of unmastered vocabulary
        const notMastered = vocabularyArr
            .filter((v) => !trackRecord![v.id].mastered
        );

        if (notMastered.length == 0) {
            setEndSession(true);
            return;
        }

        // Select random unmastered vocab and set
        const randomVocab = notMastered[Math.floor(Math.random() * notMastered.length)];
        const randomIndex = vocabularyArr.findIndex((v) => v.id == randomVocab.id);

        setIndex(randomIndex);
        setRenderTick(renderTick => renderTick + 1);
    }

    const checkResponse = (answer: string) => {
        const expected =
            mode === "typing" ? currentVocabulary.traditional : currentVocabulary.english;

        const correct = answer.trim() === expected;
        setIsCorrect(correct);
        updatePerformance(currentVocabulary, correct);
        return correct;
    }

    const randMode = () => Math.random() < 0.5 ? "typing" : "multiple-choice";

    const updateChoices = () => {
        // Pick out 3 other vocabulary as wrong options
        const wrongAnswers = vocabularyArr
                .filter((v) => v.id !== currentVocabulary.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map((v) => v.english);

        // Debug
        console.log(wrongAnswers);

        // Gather options and randomize
        const opts = [...wrongAnswers, currentVocabulary.english].sort(
            () => 0.5 - Math.random()
        );

        setChoices(opts);
    }

    const updatePerformance = (vocabulary: Vocabulary, answerdCorrectly: boolean) => {
        const vocabularyId = vocabulary.id;
        if (answerdCorrectly) {
            trackRecord![vocabularyId].correct ++
        } else {
            trackRecord![vocabularyId].wrong ++
        }

        // Debug
        console.log(trackRecord![vocabularyId]);

        // Basic policy - if you get it right at least 5 times, you're good
        if (trackRecord![vocabularyId].correct >= 3) {
            trackRecord![vocabularyId].mastered = true;
        }
    }

    useEffect(() => {
        // Set-up performance tracking
        const performanceRecord = Object.fromEntries(
            vocabularyArr.map(v => [
                v.id,
                { correct: 0, wrong: 0, mastered: false }
            ])
        );
        setTrackRecord(performanceRecord);
    }, [])

    useEffect(() => {
        setIsCorrect(null);
        
        // Randomly select mode for next flashcard
        const nextMode = randMode();
        setMode(nextMode);
        if (nextMode === "multiple-choice") updateChoices();

    }, [index]);

    return {
        currentVocabulary,
        mode,
        isCorrect,
        choices,
        endSession,
        renderTick,
        next,
        checkResponse,
        setRenderTick
    };
}