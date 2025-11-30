import { Vocabulary } from "@/lib/backend/types";
import { useState, useEffect } from "react";
import { Mode } from "./types";
import { VocabularyProgressRecord } from "@/lib/backend/types";
import {
    getVocabularyProgress,
    putVocabularyProgressNewRecords,
    putVocabularyProgressUpdateRecords
} from "@/lib/backend/backend";
import { useUserContext } from "@/context/user";
import { chooseRandom, shuffle } from "@/lib/utils";


function generateChoices(vocabularyArr: Vocabulary[], skipId: number): Vocabulary[] {
    return vocabularyArr
        .filter((v) => v.id !== skipId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
}

async function commitVocabularyProgress(
    vocabularyProgressArr: VocabularyProgressRecord[],
): Promise<void> {
    putVocabularyProgressUpdateRecords(vocabularyProgressArr);
}

async function loadVocabularyProgress(
    vocabularyIdArr: number[],
    userId?: string
): Promise<VocabularyProgressRecord[]> {
    // If userId is not provided, give blank progress for all vocabulary
    if (!userId) {
        const vocabProgress = vocabularyIdArr.map((id) => {
            return {
                vocabularyId: id,
                countCorrect: 0,
                countWrong: 0
            }
        });
        return vocabProgress;
    }

    // Otherwise, get vocabulary progress records from database
    const vocabularyProgressRecord = await getVocabularyProgress(
        userId,
        vocabularyIdArr
    )
    const foundVocabId = vocabularyProgressRecord.map((v) => v.vocabularyId);

    // For new vocab, existing record may not exists. Create those records.
    const missingVocabIds = vocabularyIdArr.filter((v) => !foundVocabId.includes(v));

    // If none were missing, return. Otherwise, create those records
    if (missingVocabIds.length == 0) return vocabularyProgressRecord;
    const newRecords = await putVocabularyProgressNewRecords(userId, missingVocabIds);
    return [...vocabularyProgressRecord, ...newRecords];
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
    const [progress, setProgress] = useState<VocabularyProgressRecord[]>();
    const [endSession, setEndSession] = useState<boolean>(false);
    const currentVocabulary = vocabularyArr[index];

    const { user } = useUserContext();

    const next = () => {
        // Block going to next vocab until user has answered
        if (isCorrect == undefined) return;

        // Update progress
        setProgress(prev => {
            const updated = structuredClone(prev);
            updateProgress(progress!, currentVocabulary, isCorrect);
            return updated
        })

        // Get ID of vocabulary to quiz
        const remainingVocabId = progress!.map((v) => {
            if (v.countCorrect < 5) return v.vocabularyId
        })
        const remainingVocab = vocabularyArr.filter((v) => remainingVocabId.includes(v.id));

        // If none, lesson complete, return
        if (remainingVocab.length == 0) {
            setEndSession(true);
            commitVocabularyProgress(progress!);
            return;
        }

        // Update states for next flashcard
        setIsCorrect(null);

        const mode = chooseRandom(["typing", "multiple-choice"]) as Mode;
        setMode(mode);
        if (mode === "multiple-choice") {
            const wrongAnswers = generateChoices(
                vocabularyArr, currentVocabulary.id
            ).map((v) => v.english);
            setChoices(shuffle([...wrongAnswers, currentVocabulary.english]));
        };


        // Select random unmastered vocab and set
        const randomVocab = chooseRandom(remainingVocab);
        const randomIndex = vocabularyArr.findIndex((v) => v.id == randomVocab.id);
        setIndex(randomIndex);
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

    useEffect(() => {
        loadVocabularyProgress(
            vocabularyArr.map((v) => v.id),
            user?.id
        )
            .then((response) => {
                setProgress(response);
            })
        
    }, [])

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