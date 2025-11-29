import { Vocabulary } from "@/lib/backend/types";
import { useState, useEffect } from "react";
import { Mode } from "./types";
import { VocabularyProgressRecord } from "@/lib/backend/types";
import {
    getVocabularyTopNFrequency,
    getVocabularyProgress,
    putVocabularyProgressNewRecords
} from "@/lib/backend/backend";


function chooseRandom(options: string[]): string {
    return options[Math.floor(Math.random() * options.length)];
}

function generateChoices(vocabularyArr: Vocabulary[], skipId: number): Vocabulary[] {
    return vocabularyArr
        .filter((v) => v.id !== skipId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
}

async function loadVocabularyPerformance(userId: string) {
    /* Make vocabulary calls to database to load vocabulary */
    // Get vocabulary set for learning
    const vocabularySet = await getVocabularyTopNFrequency();
    const vocabularyIdSet = vocabularySet.map((v) => v.id);

    // Get vocabulary records
    const vocabularyProgressRecord = await getVocabularyProgress(
        userId,
        vocabularySet.map((v) => v.id)
    )

    // Get missing vocabularyId
    const missingRecords = vocabularyProgressRecord.filter((v) => vocabularyIdSet.some((id) => id != v.vocabularyId));
    const missingVocabIds = missingRecords.map((v) => v.vocabularyId);

    // Create new records for missing vocabularyId
    const newRecords = await putVocabularyProgressNewRecords(userId, missingVocabIds);

    // Merge records and return
    return [...vocabularyProgressRecord, newRecords];
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

export function useFlashcardMasteryController(vocabularyArr: Vocabulary[]) {
    const [index, setIndex] = useState<number>(0);
    const [mode, setMode] = useState<Mode>("typing");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [choices, setChoices] = useState<string[]>([]);
    const [performance, setPerformance] = useState<VocabularyProgressRecord[]>();
    const [endSession, setEndSession] = useState<boolean>(false);
    const currentVocabulary = vocabularyArr[index];

    const next = () => {
        if (!performance) return;

        // Collect ID of unmastered vocabulary
        const notMastered = vocabularyArr
            .filter((v) => performance![v.id].countCorrect < 3);

        if (notMastered.length == 0) {
            setEndSession(true);
            return;
        }

        // Select random unmastered vocab and set
        const randomVocab = notMastered[Math.floor(Math.random() * notMastered.length)];
        const randomIndex = vocabularyArr.findIndex((v) => v.id == randomVocab.id);
        setIndex(randomIndex);
    }

    const checkResponse = (answer: string) => {
        const expected =
            mode === "typing" ? currentVocabulary.traditional : currentVocabulary.english;

        const correct = answer.trim() === expected;
        setIsCorrect(correct);
        setPerformance(prev => {
            const updated = structuredClone(prev);
            updatePerformance(updated!, currentVocabulary, correct);
            return updated
        })
        return correct;
    }

    const updatePerformance = (
        trackRecord: Record<number, VocabularyProgressRecord>,
        vocabulary: Vocabulary,
        answerdCorrectly: boolean
    ) => {
        if (answerdCorrectly) {
            trackRecord[vocabulary.id].countCorrect ++
        } else {
            trackRecord[vocabulary.id].countWrong ++
        }
    }

    useEffect(() => {
        loadVocabularyPerformance(userId)
            .then((response) => {
                setPerformance(response);
            })
        
    }, [])

    useEffect(() => {
        setIsCorrect(null);
        
        // Randomly select mode for next flashcard
        const mode = chooseRandom(["typing", "multiple-choice"]) as Mode;
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
        endSession,
        next,
        checkResponse
    };
}